import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { prisma } from "@/lib/db";
import { decrypt, encrypt } from "@/lib/crypto";
import { NextResponse } from "next/server";

// ------------------------------------------------------------------
// CONFIGURATION
// ------------------------------------------------------------------
const HARDCODED_RECIPIENT_PHONE = "918107438116"; // Enter your target number here
const META_API_VERSION = "v20.0";

async function handler(req: Request) {
  const body = await req.json();
  const { taskId } = body;

  if (!taskId) return new NextResponse("Missing Task ID", { status: 400 });

  console.log(`💚 WhatsApp Worker starting for Task: ${taskId}`);

  // 1. Fetch Task, User, and Accounts
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

  // 2. Identify the specific execution entry
  const execution = task.executions.find((e) => e.platform === "WHATSAPP");

  if (!execution || execution.status === "SUCCESS") {
    return new NextResponse("Already processed", { status: 200 });
  }

  // 3. Mark as RUNNING
  await prisma.taskExecution.update({
    where: { id: execution.id },
    data: { status: "RUNNING", startedAt: new Date() },
  });

  // 4. Find the WhatsApp Account
  let waAccount = task.user.platformAccounts.find(
    (acc) => acc.platform === "WHATSAPP"
  );

  if (!waAccount) {
    await prisma.taskExecution.update({
        where: { id: execution.id },
        data: { status: "FAILED", error: "No Connected WhatsApp Account" }
    });
    return new NextResponse("No connected WhatsApp account", { status: 200 });
  }

  // ============================================================
  // 🔓 EXTRACT CREDENTIALS (SCHEMA WORKAROUND)
  // ============================================================
  let accessToken = decrypt(waAccount.encryptedAccessToken);
  
  // WORKAROUND: We stored the Phone Number ID inside 'encryptedRefreshToken'
  let phoneNumberId = "";
  if (waAccount.encryptedRefreshToken) {
    try {
        phoneNumberId = decrypt(waAccount.encryptedRefreshToken);
    } catch (e) {
        console.error("Failed to decrypt Phone ID");
    }
  }

  if (!phoneNumberId) {
    await prisma.taskExecution.update({
        where: { id: execution.id },
        data: { status: "FAILED", error: "Configuration Error: Phone Number ID missing." }
    });
    return new NextResponse("Missing Phone ID", { status: 200 });
  }

  // ============================================================
  // 🔄 AUTO-REFRESH LOGIC
  // ============================================================
  const now = new Date();
  // Check if token expires in the next 24 hours
  const isExpiring = waAccount.expiresAt && waAccount.expiresAt < new Date(now.getTime() + 24 * 60 * 60 * 1000);

  if (isExpiring) {
    console.log("⏳ WhatsApp Token expiring. Refreshing...");
    try {
        const newTokens = await refreshMetaToken(accessToken);

        // Update DB
        // IMPORTANT: We must re-encrypt the phoneNumberId into the refresh token field
        // to preserve it, otherwise it might get overwritten or lost if we aren't careful.
        waAccount = await prisma.platformAccount.update({
            where: { id: waAccount.id },
            data: {
                encryptedAccessToken: encrypt(newTokens.access_token),
                // Keep the phone ID safely stored here
                encryptedRefreshToken: encrypt(phoneNumberId), 
                expiresAt: new Date(Date.now() + (newTokens.expires_in || 5184000) * 1000),
            }
        });

        accessToken = newTokens.access_token;
        console.log("✅ WhatsApp Token refreshed.");

    } catch (refreshError: any) {
        console.error("Meta Refresh Failed:", refreshError);
        await prisma.taskExecution.update({
            where: { id: execution.id },
            data: { status: "FAILED", error: "Token Expired. Please Reconnect." }
        });
        return new NextResponse("Token Refresh Failed", { status: 200 });
    }
  }

  // ============================================================
  // 📤 SENDING LOGIC
  // ============================================================

  try {
    const url = `https://graph.facebook.com/${META_API_VERSION}/${phoneNumberId}/messages`;
    
    // Logic: Use template if content is 'hello_world', otherwise text.
    // Remember: Text only works if the user replied < 24h ago.
    const isTemplate = task.content === "hello_world";

    let payload: any = {
      messaging_product: "whatsapp",
      to: HARDCODED_RECIPIENT_PHONE,
    };

    if (isTemplate) {
      payload.type = "template";
      payload.template = {
        name: "hello_world",
        language: { code: "en_US" }
      };
    } else {
      payload.type = "text";
      payload.text = { body: task.content };
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("WhatsApp API Error:", data);
        throw new Error(data.error?.message || "WhatsApp API Error");
    }

    // 5. Success - Update Status
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

    return new NextResponse("WhatsApp Sent Successfully", { status: 200 });

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

// --- Helper: Refresh Meta Token ---
async function refreshMetaToken(currentAccessToken: string) {
    const url = new URL(`https://graph.facebook.com/${META_API_VERSION}/oauth/access_token`);
    url.searchParams.append("grant_type", "fb_exchange_token");
    url.searchParams.append("client_id", process.env.META_CLIENT_ID!);
    url.searchParams.append("client_secret", process.env.META_CLIENT_SECRET!);
    url.searchParams.append("fb_exchange_token", currentAccessToken);

    const res = await fetch(url.toString(), { method: "GET" });
    const data = await res.json();
    
    if (!res.ok) {  
        throw new Error(data.error?.message || "Failed to exchange token");
    }

    return data;
}

export const POST = verifySignatureAppRouter(handler);