import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import { NextResponse } from "next/server";

// 1. Disable Body Parsing (QStash needs raw body for signature verification)
// Next.js App Router handles this automatically, but we use the helper below.

async function handler(req: Request) {
  // 2. Parse Payload
  const body = await req.json();
  const { taskId } = body;

  if (!taskId) return new NextResponse("No Task ID", { status: 400 });

  console.log(`👷 Worker started for Task: ${taskId}`);

  // 3. Fetch Task & Tokens
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      user: {
        include: { platformAccounts: true },
      },
    },
  });

  // Idempotency Check: If already done, stop.
  if (!task || task.status === "COMPLETED") {
    return new NextResponse("Task already completed or missing", { status: 200 });
  }

  // 4. Find Twitter Account
  const twitterAccount = task.user.platformAccounts.find(
    (acc) => acc.platform === "TWITTER"
  );

  if (!twitterAccount) {
    await prisma.task.update({
        where: { id: taskId },
        data: { status: "FAILED" }
    });
    return new NextResponse("No Twitter Account", { status: 400 });
  }

  // 5. Execute Post
  try {
    const accessToken = decrypt(twitterAccount.encryptedAccessToken);

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
        throw new Error(JSON.stringify(errData));
    }

    // 6. Success!
    await prisma.task.update({
      where: { id: taskId },
      data: {
        status: "COMPLETED",
        executions: {
            updateMany: {
                where: { taskId: taskId, platform: "TWITTER" },
                data: { status: "SUCCESS", finishedAt: new Date() }
            }
        }
      },
    });

    console.log(`✅ Tweet Sent for Task ${taskId}`);
    return new NextResponse("Success", { status: 200 });

  } catch (error: any) {
    console.error(`❌ Worker Failed:`, error);
    

    return new NextResponse(error.message, { status: 500 });
  }
}

// 7. Apply Security Wrapper
// This ensures ONLY QStash can call this API. Hackers cannot trigger it.
export const POST = verifySignatureAppRouter(handler);