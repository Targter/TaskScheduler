// import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
// import { prisma } from "@/lib/db";
// import { decrypt } from "@/lib/crypto";
// import { NextResponse } from "next/server";

// async function handler(req: Request) {
//   const body = await req.json();
//   const { taskId } = body;

//   if (!taskId) return new NextResponse("Missing Task ID", { status: 400 });

//   console.log(`🚀 LinkedIn Worker waking up for Task: ${taskId}`);

//   // 1. Fetch Task with User & Executions
//   const task = await prisma.task.findUnique({
//     where: { id: taskId },
//     include: {
//       user: {
//         include: { platformAccounts: true },
//       },
//       executions: true,
//     },
//   });

//   if (!task) return new NextResponse("Task not found", { status: 404 });

//   // 2. Identify the specific Execution for LinkedIn
//   const execution = task.executions.find((e) => e.platform === "LINKEDIN");

//   // If already done, stop
//   if (!execution || execution.status === "SUCCESS") {
//     return new NextResponse("Already processed", { status: 200 });
//   }

//   // 3. Mark as RUNNING
//   await prisma.taskExecution.update({
//     where: { id: execution.id },
//     data: { status: "RUNNING", startedAt: new Date() },
//   });

//   // 4. Find LinkedIn Account
//   const linkedinAccount = task.user.platformAccounts.find(
//     (acc) => acc.platform === "LINKEDIN"
//   );

//   if (!linkedinAccount) {
//     await prisma.taskExecution.update({
//         where: { id: execution.id },
//         data: { status: "FAILED", error: "No Connected LinkedIn Account" }
//     });
//     return new NextResponse("No connected LinkedIn account", { status: 200 });
//   }

//   // ============================================================
//   // 🔒 TOKEN VALIDATION (LinkedIn Specific)
//   // ============================================================
  
//   const accessToken = decrypt(linkedinAccount.encryptedAccessToken);
//   const now = new Date();

//   // LinkedIn tokens last 60 days and usually CANNOT be refreshed programmatically 
//   // without the user logging in again (unless you have Enterprise permissions).
//   // We check if it is expired.
//   if (linkedinAccount.expiresAt && linkedinAccount.expiresAt < now) {
//     console.error("❌ LinkedIn Token Expired");
    
//     await prisma.taskExecution.update({
//         where: { id: execution.id },
//         data: { 
//             status: "FAILED", 
//             error: "Connection expired. Please reconnect LinkedIn.",
//             finishedAt: new Date() 
//         }
//     });
    
//     // Return 200 to stop QStash from retrying. User action required.
//     return new NextResponse("Token Expired", { status: 200 });
//   }

//   // ============================================================
//   // 📨 POST CONTENT
//   // ============================================================

//   try {
//     // LinkedIn ID needs to be a URN. 
//     // Usually 'person' for personal profiles. 
//     // If you support Company Pages later, this might need to be 'organization'.
//     const authorUrn = `urn:li:person:${linkedinAccount.externalId}`;

//     const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//         "X-Restli-Protocol-Version": "2.0.0", // Important for v2 API
//       },
//       body: JSON.stringify({
//         author: authorUrn,
//         lifecycleState: "PUBLISHED",
//         specificContent: {
//           "com.linkedin.ugc.ShareContent": {
//             shareCommentary: { text: task.content },
//             shareMediaCategory: "NONE", 
//           },
//         },
//         visibility: { 
//           "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" 
//         },
//       }),
//     });

//     if (!response.ok) {
//         const errData = await response.json();
//         console.error("LinkedIn API Error:", JSON.stringify(errData, null, 2));
//         throw new Error(errData.message || "LinkedIn API Request Failed");
//     }

//     // 5. Success Transaction
//     await prisma.$transaction([
//         prisma.taskExecution.update({
//             where: { id: execution.id },
//             data: { status: "SUCCESS", finishedAt: new Date() }
//         }),
//         // Only mark parent task COMPLETED if you want (or handle logic if multiple platforms exist)
//         prisma.task.update({
//             where: { id: taskId },
//             data: { status: "COMPLETED" }
//         })
//     ]);

//     return new NextResponse("LinkedIn Post Sent Successfully", { status: 200 });

//   } catch (error: any) {
//     console.error("Worker Execution Failed:", error);
    
//     await prisma.taskExecution.update({
//         where: { id: execution.id },
//         data: { 
//             status: "FAILED", 
//             error: error.message || "Unknown Error", 
//             finishedAt: new Date() 
//         }
//     });

//     // Mark Task as Failed
//     await prisma.task.update({
//         where: { id: taskId },
//         data: { status: "FAILED" }
//     });

//     return new NextResponse("Worker Processed (Failed)", { status: 200 });
//   }
// }

// export const POST = verifySignatureAppRouter(handler);


import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import { NextResponse } from "next/server";

// --- Helper: Upload Image from URL to LinkedIn ---
async function uploadImageToLinkedIn(accessToken: string, authorUrn: string, imageUrl: string) {
  try {
    // 1. Fetch the image binary from UploadThing/URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error(`Failed to download image: ${imageUrl}`);
    const imageBuffer = await imageResponse.arrayBuffer();

    // 2. Register the upload with LinkedIn
    const registerResponse = await fetch("https://api.linkedin.com/v2/assets?action=registerUpload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
          owner: authorUrn,
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      }),
    });

    if (!registerResponse.ok) {
        const error = await registerResponse.json();
        throw new Error(`LinkedIn Register Error: ${JSON.stringify(error)}`);
    }

    const registerData = await registerResponse.json();
    
    // Get the upload URL and the Asset URN
    const uploadUrl = registerData.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;
    const assetUrn = registerData.value.asset;

    // 3. Upload the binary to the URL provided by LinkedIn
    const uploadStep = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/octet-stream", // Binary stream
      },
      body: imageBuffer,
    });

    if (!uploadStep.ok) throw new Error("Failed to upload image binary to LinkedIn");

    return assetUrn;
  } catch (error) {
    console.error("Image Upload Helper Failed:", error);
    throw error;
  }
}

async function handler(req: Request) {
  const body = await req.json();
  const { taskId } = body;

  if (!taskId) return new NextResponse("Missing Task ID", { status: 400 });

  console.log(`🚀 LinkedIn Worker waking up for Task: ${taskId}`);

  // 1. Fetch Task
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

  // 2. Identify Execution
  const execution = task.executions.find((e) => e.platform === "LINKEDIN");

  if (!execution || execution.status === "SUCCESS") {
    return new NextResponse("Already processed", { status: 200 });
  }

  // 3. Mark RUNNING
  await prisma.taskExecution.update({
    where: { id: execution.id },
    data: { status: "RUNNING", startedAt: new Date() },
  });

  // 4. Find Account
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

  // 🔒 Token Validation
  const accessToken = decrypt(linkedinAccount.encryptedAccessToken);
  const now = new Date();

  if (linkedinAccount.expiresAt && linkedinAccount.expiresAt < now) {
    await prisma.taskExecution.update({
        where: { id: execution.id },
        data: { 
            status: "FAILED", 
            error: "Connection expired. Please reconnect LinkedIn.",
            finishedAt: new Date() 
        }
    });
    return new NextResponse("Token Expired", { status: 200 });
  }

  // ============================================================
  // 📨 POST LOGIC (Text vs Image)
  // ============================================================

  try {
    const authorUrn = `urn:li:person:${linkedinAccount.externalId}`;
    
    // Parse mediaUrls from the task (assuming it's stored as JSON or string array)
    // Adjust based on your Prisma Schema. If it's a Json field: task.mediaUrls
    let mediaUrls: string[] = [];
    if (Array.isArray(task.mediaUrls)) {
        mediaUrls = task.mediaUrls as string[];
    } else if (typeof task.mediaUrls === 'string') {
        try { mediaUrls = JSON.parse(task.mediaUrls); } catch(e) {}
    }

    let shareContent: any = {
        shareCommentary: { text: task.content },
        shareMediaCategory: "NONE",
    };

    // If we have images, process them
    if (mediaUrls.length > 0) {
        console.log(`📸 Processing ${mediaUrls.length} images for LinkedIn...`);
        
        // Parallel upload to LinkedIn to get Asset URNs
        const assetUrns = await Promise.all(
            mediaUrls.map(url => uploadImageToLinkedIn(accessToken, authorUrn, url))
        );

        shareContent.shareMediaCategory = "IMAGE";
        shareContent.media = assetUrns.map(urn => ({
            status: "READY",
            description: { text: "Image" },
            media: urn,
            title: { text: "Posted via App" } // Title is often hidden but required in some contexts
        }));
    }

    // Send the Post
    const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify({
        author: authorUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": shareContent,
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

    // 5. Success
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

    await prisma.task.update({
        where: { id: taskId },
        data: { status: "FAILED" }
    });

    return new NextResponse("Worker Processed (Failed)", { status: 200 });
  }
}

export const POST = verifySignatureAppRouter(handler);