import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import { NextResponse } from "next/server";

async function handler(req: Request) {
  const body = await req.json();
  const { taskId } = body;

  if (!taskId) return new NextResponse("Missing Task ID", { status: 400 });

  console.log(`🚀 LinkedIn Worker waking up for Task: ${taskId}`);

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

  // 2. Identify the specific Execution for LinkedIn
  const execution = task.executions.find((e) => e.platform === "LINKEDIN");

  // If already done, stop
  if (!execution || execution.status === "SUCCESS") {
    return new NextResponse("Already processed", { status: 200 });
  }

  // 3. Mark as RUNNING
  await prisma.taskExecution.update({
    where: { id: execution.id },
    data: { status: "RUNNING", startedAt: new Date() },
  });

  // 4. Find LinkedIn Account
  const linkedinAccount = task.user.platformAccounts.find(
    (acc) => acc.platform === "LINKEDIN"
  );

  if (!linkedinAccount) {
    await prisma.taskExecution.update({
        where: { id: execution.id },
        data: { status: "FAILED", error: "No Connected LinkedIn Account" }
    });
    return new NextResponse("No connected LinkedIn account", { status: 200 });
  }

  // ============================================================
  // 🔒 TOKEN VALIDATION (LinkedIn Specific)
  // ============================================================
  
  const accessToken = decrypt(linkedinAccount.encryptedAccessToken);
  const now = new Date();

  // LinkedIn tokens last 60 days and usually CANNOT be refreshed programmatically 
  // without the user logging in again (unless you have Enterprise permissions).
  // We check if it is expired.
  if (linkedinAccount.expiresAt && linkedinAccount.expiresAt < now) {
    console.error("❌ LinkedIn Token Expired");
    
    await prisma.taskExecution.update({
        where: { id: execution.id },
        data: { 
            status: "FAILED", 
            error: "Connection expired. Please reconnect LinkedIn.",
            finishedAt: new Date() 
        }
    });
    
    // Return 200 to stop QStash from retrying. User action required.
    return new NextResponse("Token Expired", { status: 200 });
  }

  // ============================================================
  // 📨 POST CONTENT
  // ============================================================

  try {
    // LinkedIn ID needs to be a URN. 
    // Usually 'person' for personal profiles. 
    // If you support Company Pages later, this might need to be 'organization'.
    const authorUrn = `urn:li:person:${linkedinAccount.externalId}`;

    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0", // Important for v2 API
      },
      body: JSON.stringify({
        author: authorUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: task.content },
            shareMediaCategory: "NONE", 
          },
        },
        visibility: { 
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" 
        },
      }),
    });

    if (!response.ok) {
        const errData = await response.json();
        console.error("LinkedIn API Error:", JSON.stringify(errData, null, 2));
        throw new Error(errData.message || "LinkedIn API Request Failed");
    }

    // 5. Success Transaction
    await prisma.$transaction([
        prisma.taskExecution.update({
            where: { id: execution.id },
            data: { status: "SUCCESS", finishedAt: new Date() }
        }),
        // Only mark parent task COMPLETED if you want (or handle logic if multiple platforms exist)
        prisma.task.update({
            where: { id: taskId },
            data: { status: "COMPLETED" }
        })
    ]);

    return new NextResponse("LinkedIn Post Sent Successfully", { status: 200 });

  } catch (error: any) {
    console.error("Worker Execution Failed:", error);
    
    await prisma.taskExecution.update({
        where: { id: execution.id },
        data: { 
            status: "FAILED", 
            error: error.message || "Unknown Error", 
            finishedAt: new Date() 
        }
    });

    // Mark Task as Failed
    await prisma.task.update({
        where: { id: taskId },
        data: { status: "FAILED" }
    });

    return new NextResponse("Worker Processed (Failed)", { status: 200 });
  }
}

export const POST = verifySignatureAppRouter(handler);