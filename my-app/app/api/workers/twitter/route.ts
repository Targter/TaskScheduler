

import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { prisma } from "@/lib/db";
import { decrypt, encrypt } from "@/lib/crypto"; // <--- IMPORT ENCRYPT
import { NextResponse } from "next/server";

async function handler(req: Request) {
  const body = await req.json();
  const { taskId } = body;

  if (!taskId) return new NextResponse("Missing Task ID", { status: 400 });

  console.log(`🚀 Worker waking up for Task: ${taskId}`);

  // 1. Fetch Task with User & Executions
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      user: {
        include: { platformAccounts: true },
      },
      executions: true,
    },
  });

  if (!task) return new NextResponse("Task not found", { status: 404 });

  // 2. Identify the specific Execution for Twitter
  const execution = task.executions.find((e) => e.platform === "TWITTER");

  // If already done, stop
  if (!execution || execution.status === "SUCCESS") {
    return new NextResponse("Already processed", { status: 200 });
  }

  // 3. Mark as RUNNING
  await prisma.taskExecution.update({
    where: { id: execution.id },
    data: { status: "RUNNING", startedAt: new Date() },
  });

  // 4. Find Twitter Account
  let twitterAccount = task.user.platformAccounts.find(
    (acc) => acc.platform === "TWITTER"
  );

  if (!twitterAccount) {
    await prisma.taskExecution.update({
        where: { id: execution.id },
        data: { status: "FAILED", error: "No Connected Account" }
    });
    return new NextResponse("No connected Twitter account", { status: 200 });
  }

  // ============================================================
  // 🔄 AUTO-REFRESH LOGIC START
  // ============================================================
  
  let accessToken = decrypt(twitterAccount.encryptedAccessToken);
  const now = new Date();
  
  // Check if token is expired (or expires in the next 5 minutes)
  const isExpired = twitterAccount.expiresAt && twitterAccount.expiresAt < new Date(now.getTime() + 5 * 60000);

  if (isExpired) {
    console.log("⏳ Access Token expired. Refreshing with Twitter...");
    
    try {
        if (!twitterAccount.encryptedRefreshToken) {
            throw new Error("No refresh token available");
        }

        const refreshToken = decrypt(twitterAccount.encryptedRefreshToken);
        
        // Call Helper Function (defined at bottom)
        const newCredentials = await refreshTwitterToken(refreshToken);

        // Update Database with NEW tokens
        // Twitter rotates refresh tokens, so we must save the new one too.
        twitterAccount = await prisma.platformAccount.update({
            where: { id: twitterAccount.id },
            data: {
                encryptedAccessToken: encrypt(newCredentials.access_token),
                encryptedRefreshToken: encrypt(newCredentials.refresh_token),
                expiresAt: new Date(Date.now() + newCredentials.expires_in * 1000),
            }
        });

        // Update the variable to use the NEW access token for the post below
        accessToken = newCredentials.access_token;
        console.log("✅ Token refreshed & saved.");

    } catch (refreshError: any) {
        console.error("Token Refresh Failed:", refreshError);
        
        await prisma.taskExecution.update({
            where: { id: execution.id },
            data: { 
                status: "FAILED", 
                error: "Connection expired. Please reconnect Twitter.",
                finishedAt: new Date() 
            }
        });
        // We return 200 so QStash stops retrying. The user MUST reconnect manually.
        return new NextResponse("Token Refresh Failed", { status: 200 });
    }
  }
  // ============================================================
  // 🔄 AUTO-REFRESH LOGIC END
  // ============================================================

  // 5. Post to Twitter
  try {
    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: task.content }),
    });

    if (!response.ok) {
        const errData = await response.json();
        console.error("Twitter API Error:", errData);
        throw new Error(JSON.stringify(errData));
    }

    // 6. Success Transaction
    await prisma.$transaction([
        prisma.taskExecution.update({
            where: { id: execution.id },
            data: { status: "SUCCESS", finishedAt: new Date() }
        }),
        prisma.task.update({
            where: { id: taskId },
            data: { status: "COMPLETED" }
        })
    ]);

    return new NextResponse("Tweet Sent Successfully", { status: 200 });

  } catch (error: any) {
    console.error("Worker Execution Failed:", error);
    
    await prisma.taskExecution.update({
        where: { id: execution.id },
        data: { status: "FAILED", error: error.message || "Unknown Error", finishedAt: new Date() }
    });

    await prisma.task.update({
        where: { id: taskId },
        data: { status: "FAILED" }
    });

    return new NextResponse("Worker Processed (Failed)", { status: 200 });
  }
}

// --- Helper Function to Call Twitter API ---
async function refreshTwitterToken(refreshToken: string) {
    const url = "https://api.twitter.com/2/oauth2/token";
    
    // Twitter requires Basic Auth with Client ID & Secret for refreshing
    const basicAuth = Buffer.from(
        `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
    ).toString("base64");

    const params = new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
    });

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${basicAuth}`,
        },
        body: params,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`Twitter Refresh Error: ${text}`);
    }

    return await res.json();
}

export const POST = verifySignatureAppRouter(handler);