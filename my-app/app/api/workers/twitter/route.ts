// import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
// import { prisma } from "@/lib/db";
// import { decrypt } from "@/lib/crypto";
// import { NextResponse } from "next/server";

// async function handler(req: Request) {
//   const body = await req.json();
//   const { taskId } = body;

//   if (!taskId) return new NextResponse("Missing Task ID", { status: 400 });

//   console.log(`🚀 Worker waking up for Task: ${taskId}`);

//   // 1. Fetch Task
//   const task = await prisma.task.findUnique({
//     where: { id: taskId },
//     include: {
//       user: {
//         include: { platformAccounts: true },
//       },
//     },
//   });

//   // Idempotency: Don't run if already done or failed
//   if (!task || task.status === "COMPLETED" || task.status === "FAILED") {
//     return new NextResponse("Task already processed", { status: 200 });
//   }

//   // 2. Find Twitter Credentials
//   const twitterAccount = task.user.platformAccounts.find(
//     (acc) => acc.platform === "TWITTER"
//   );

//   if (!twitterAccount) {
//     await prisma.task.update({
//         where: { id: taskId },
//         data: { status: "FAILED" }
//     });
//     return new NextResponse("No connected Twitter account", { status: 400 });
//   }

//   // 3. Post to Twitter
//   try {
//     const accessToken = decrypt(twitterAccount.encryptedAccessToken);

//     const response = await fetch("https://api.twitter.com/2/tweets", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ text: task.content }),
//     });

//     if (!response.ok) {
//         // Parse error to see if it's a "Duplicate Content" error or Auth error
//         const errData = await response.json();
//         console.error("Twitter API Error:", errData);
//         throw new Error("Twitter refused the post");
//     }

//     // 4. Mark Success
//     await prisma.task.update({
//       where: { id: taskId },
//       data: {
//         status: "COMPLETED",
//         executions: {
//             updateMany: {
//                 where: { taskId: taskId, platform: "TWITTER" },
//                 data: { status: "SUCCESS", finishedAt: new Date() }
//             }
//         }
//       },
//     });

//     return new NextResponse("Tweet Sent Successfully", { status: 200 });

//   } catch (error) {
//     console.error("Worker Execution Failed:", error);
    
//     // Mark as Failed in DB
//     await prisma.task.update({
//         where: { id: taskId },
//         data: { status: "FAILED" }
//     });

//     // Return 500 so QStash knows to retry (if you want automatic retries)
//     // Or return 200 to stop QStash from retrying if you think it's a permanent error
//     return new NextResponse("Worker Error", { status: 500 });
//   }
// }

// // Security: Verify request comes from QStash
// export const POST = verifySignatureAppRouter(handler);



import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import { NextResponse } from "next/server";

async function handler(req: Request) {
  const body = await req.json();
  const { taskId } = body;

  if (!taskId) return new NextResponse("Missing Task ID", { status: 400 });

  console.log(`🚀 Worker processing Task: ${taskId}`);

  // 1. Fetch Task AND the specific Twitter Execution
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

  // 2. Find the specific execution entry for TWITTER
  const execution = task.executions.find((e) => e.platform === "TWITTER");

  // Idempotency: Stop if already done
  if (!execution || execution.status === "SUCCESS") {
    return new NextResponse("Execution already completed or missing", { status: 200 });
  }

  // 3. Mark Execution as RUNNING
  await prisma.taskExecution.update({
    where: { id: execution.id },
    data: { status: "RUNNING", startedAt: new Date() }
  });

  // 4. Get Twitter Credentials
  const twitterAccount = task.user.platformAccounts.find(
    (acc) => acc.platform === "TWITTER"
  );

  if (!twitterAccount) {
    await prisma.taskExecution.update({
        where: { id: execution.id },
        data: { status: "FAILED", error: "No Twitter Account Connected" }
    });
    // Return 200 to stop QStash from retrying indefinitely
    return new NextResponse("No connected Twitter account", { status: 200 });
  }

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

    // 5. Success Transaction
    await prisma.$transaction([
        // Update Execution to SUCCESS
        prisma.taskExecution.update({
            where: { id: execution.id },
            data: { status: "SUCCESS", finishedAt: new Date() }
        }),
        // Optional: Update Parent Task to COMPLETED if this was the only/last execution
        prisma.task.update({
            where: { id: taskId },
            data: { status: "COMPLETED" } 
        })
    ]);

    return new NextResponse("Tweet Sent Successfully", { status: 200 });

  } catch (error: any) {
    console.error("Worker Execution Failed:", error);
    
    // 6. Handle Failure
    await prisma.taskExecution.update({
        where: { id: execution.id },
        data: { 
            status: "FAILED", 
            error: error.message || "Unknown Error",
            finishedAt: new Date()
        }
    });

    // Mark Task as Failed (or partially failed)
    await prisma.task.update({
        where: { id: taskId },
        data: { status: "FAILED" }
    });

    // Return 200 to acknowledge receipt (stop retry loop for logic errors)
    // Return 500 if you want QStash to retry (e.g. for network blips)
    return new NextResponse("Worker Processed (Failed)", { status: 200 });
  }
}

export const POST = verifySignatureAppRouter(handler);