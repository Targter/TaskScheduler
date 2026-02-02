

// import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
// import { prisma } from "@/lib/db";
// import { decrypt, encrypt } from "@/lib/crypto"; // <--- IMPORT ENCRYPT
// import { NextResponse } from "next/server";

// async function handler(req: Request) {
//   const body = await req.json();
//   const { taskId } = body;

//   if (!taskId) return new NextResponse("Missing Task ID", { status: 400 });

//   console.log(`🚀 Worker waking up for Task: ${taskId}`);

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

//   // 2. Identify the specific Execution for Twitter
//   const execution = task.executions.find((e) => e.platform === "TWITTER");

//   // If already done, stop
//   if (!execution || execution.status === "SUCCESS") {
//     return new NextResponse("Already processed", { status: 200 });
//   }

//   // 3. Mark as RUNNING
//   await prisma.taskExecution.update({
//     where: { id: execution.id },
//     data: { status: "RUNNING", startedAt: new Date() },
//   });

//   // 4. Find Twitter Account
//   let twitterAccount = task.user.platformAccounts.find(
//     (acc) => acc.platform === "TWITTER"
//   );

//   if (!twitterAccount) {
//     await prisma.taskExecution.update({
//         where: { id: execution.id },
//         data: { status: "FAILED", error: "No Connected Account" }
//     });
//     return new NextResponse("No connected Twitter account", { status: 200 });
//   }

//   // ============================================================
//   // 🔄 AUTO-REFRESH LOGIC START
//   // ============================================================
  
//   let accessToken = decrypt(twitterAccount.encryptedAccessToken);
//   const now = new Date();
  
//   // Check if token is expired (or expires in the next 5 minutes)
//   const isExpired = twitterAccount.expiresAt && twitterAccount.expiresAt < new Date(now.getTime() + 5 * 60000);

//   if (isExpired) {
//     console.log("⏳ Access Token expired. Refreshing with Twitter...");
    
//     try {
//         if (!twitterAccount.encryptedRefreshToken) {
//             throw new Error("No refresh token available");
//         }

//         const refreshToken = decrypt(twitterAccount.encryptedRefreshToken);
        
//         // Call Helper Function (defined at bottom)
//         const newCredentials = await refreshTwitterToken(refreshToken);

//         // Update Database with NEW tokens
//         // Twitter rotates refresh tokens, so we must save the new one too.
//         twitterAccount = await prisma.platformAccount.update({
//             where: { id: twitterAccount.id },
//             data: {
//                 encryptedAccessToken: encrypt(newCredentials.access_token),
//                 encryptedRefreshToken: encrypt(newCredentials.refresh_token),
//                 expiresAt: new Date(Date.now() + newCredentials.expires_in * 1000),
//             }
//         });

//         // Update the variable to use the NEW access token for the post below
//         accessToken = newCredentials.access_token;
//         console.log("✅ Token refreshed & saved.");

//     } catch (refreshError: any) {
//         console.error("Token Refresh Failed:", refreshError);
        
//         await prisma.taskExecution.update({
//             where: { id: execution.id },
//             data: { 
//                 status: "FAILED", 
//                 error: "Connection expired. Please reconnect Twitter.",
//                 finishedAt: new Date() 
//             }
//         });
//         // We return 200 so QStash stops retrying. The user MUST reconnect manually.
//         return new NextResponse("Token Refresh Failed", { status: 200 });
//     }
//   }
//   // ============================================================
//   // 🔄 AUTO-REFRESH LOGIC END
//   // ============================================================

//   // 5. Post to Twitter
//   try {
//     const response = await fetch("https://api.twitter.com/2/tweets", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ text: task.content }),
//     });

//     if (!response.ok) {
//         const errData = await response.json();
//         console.error("Twitter API Error:", errData);
//         throw new Error(JSON.stringify(errData));
//     }

//     // 6. Success Transaction
//     await prisma.$transaction([
//         prisma.taskExecution.update({
//             where: { id: execution.id },
//             data: { status: "SUCCESS", finishedAt: new Date() }
//         }),
//         prisma.task.update({
//             where: { id: taskId },
//             data: { status: "COMPLETED" }
//         })
//     ]);

//     return new NextResponse("Tweet Sent Successfully", { status: 200 });

//   } catch (error: any) {
//     console.error("Worker Execution Failed:", error);
    
//     await prisma.taskExecution.update({
//         where: { id: execution.id },
//         data: { status: "FAILED", error: error.message || "Unknown Error", finishedAt: new Date() }
//     });

//     await prisma.task.update({
//         where: { id: taskId },
//         data: { status: "FAILED" }
//     });

//     return new NextResponse("Worker Processed (Failed)", { status: 200 });
//   }
// }

// // --- Helper Function to Call Twitter API ---
// async function refreshTwitterToken(refreshToken: string) {
//     const url = "https://api.twitter.com/2/oauth2/token";
    
//     // Twitter requires Basic Auth with Client ID & Secret for refreshing
//     const basicAuth = Buffer.from(
//         `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
//     ).toString("base64");

//     const params = new URLSearchParams({
//         grant_type: "refresh_token",
//         refresh_token: refreshToken,
//     });

//     const res = await fetch(url, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//             "Authorization": `Basic ${basicAuth}`,
//         },
//         body: params,
//     });

//     if (!res.ok) {
//         const text = await res.text();
//         throw new Error(`Twitter Refresh Error: ${text}`);
//     }

//     return await res.json();
// }

// export const POST = verifySignatureAppRouter(handler);



import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { prisma } from "@/lib/db";
import { decrypt, encrypt } from "@/lib/crypto";
import { NextResponse } from "next/server";

// --- Helper: Upload Media to Twitter (v1.1) ---
async function uploadMediaToTwitter(accessToken: string, imageUrl: string) {
  try {
    console.log(`📥 Downloading image for X: ${imageUrl}`);

    // 1. Download Image from UploadThing
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) throw new Error(`Failed to download image: ${imageUrl}`);
    
    // Get the Content-Type to ensure we give it the right extension if possible
    const contentType = imageRes.headers.get("content-type") || "image/jpeg";
    const blob = await imageRes.blob();

    // 2. Prepare FormData
    const formData = new FormData();
    
    // 🚨 CRITICAL FIX: Twitter REJECTS uploads without a filename in the metadata.
    // We explicitly add "image.jpg" (or derived name) as the 3rd argument.
    const filename = contentType.includes("png") ? "upload.png" : "upload.jpg";
    formData.append("media", blob, filename); 
    
    formData.append("media_category", "tweet_image");

    // 3. Upload to Twitter v1.1 Endpoint
    const uploadRes = await fetch("https://upload.twitter.com/1.1/media/upload.json", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        // Note: Do NOT set "Content-Type" manually here. fetch/FormData sets the boundary.
      },
      body: formData,
    });

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      // Try to parse JSON error if possible for better logs
      try {
        const errJson = JSON.parse(errText);
        throw new Error(JSON.stringify(errJson));
      } catch {
        throw new Error(errText);
      }
    }

    const data = await uploadRes.json();
    console.log(`✅ Uploaded to X. Media ID: ${data.media_id_string}`);
    
    // Always use string version of ID for JS precision
    return data.media_id_string;

  } catch (error) {
    console.error("X Media Upload Error:", error);
    throw error;
  }
}

async function handler(req: Request) {
  const body = await req.json();
  const { taskId } = body;

  if (!taskId) return new NextResponse("Missing Task ID", { status: 400 });

  console.log(`🚀 X (Twitter) Worker waking up for Task: ${taskId}`);

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
  const execution = task.executions.find((e) => e.platform === "TWITTER");

  if (!execution || execution.status === "SUCCESS") {
    return new NextResponse("Already processed", { status: 200 });
  }

  // 3. Mark RUNNING
  await prisma.taskExecution.update({
    where: { id: execution.id },
    data: { status: "RUNNING", startedAt: new Date() },
  });

  // 4. Find Account
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
  // 🔄 AUTO-REFRESH TOKEN
  // ============================================================
  
  let accessToken = decrypt(twitterAccount.encryptedAccessToken);
  const now = new Date();
  
  const isExpired = twitterAccount.expiresAt && twitterAccount.expiresAt < new Date(now.getTime() + 5 * 60000);

  if (isExpired) {
    console.log("⏳ Access Token expired. Refreshing with Twitter...");
    try {
        if (!twitterAccount.encryptedRefreshToken) {
            throw new Error("No refresh token available");
        }

        const refreshToken = decrypt(twitterAccount.encryptedRefreshToken);
        const newCredentials = await refreshTwitterToken(refreshToken);

        // Update DB
        twitterAccount = await prisma.platformAccount.update({
            where: { id: twitterAccount.id },
            data: {
                encryptedAccessToken: encrypt(newCredentials.access_token),
                encryptedRefreshToken: encrypt(newCredentials.refresh_token),
                expiresAt: new Date(Date.now() + newCredentials.expires_in * 1000),
            }
        });

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
        return new NextResponse("Token Refresh Failed", { status: 200 });
    }
  }

  // ============================================================
  // 📸 PROCESS & POST
  // ============================================================

  try {
    // --- 1. Parse Image URLs ---
    // Handles task.mediaUrl (string) OR task.mediaUrls (array/json) depending on your schema
    let imageUrls: string[] = [];

    // Check 'mediaUrl' (singular) field
    if (task.mediaUrls) {
        if (Array.isArray(task.mediaUrls)) imageUrls = task.mediaUrls as string[];
        else if (typeof task.mediaUrls === "string") {
            try {
                const parsed = JSON.parse(task.mediaUrls);
                imageUrls = Array.isArray(parsed) ? parsed : [task.mediaUrls];
            } catch {
                imageUrls = [task.mediaUrls];
            }
        }
    }
    // Check 'mediaUrls' (plural) field just in case schema changed
    else if ((task as any).mediaUrls) {
        const m = (task as any).mediaUrls;
        if (Array.isArray(m)) imageUrls = m;
        else if (typeof m === "string") {
            try { imageUrls = JSON.parse(m); } catch { imageUrls = [m]; }
        }
    }

    // --- 2. Upload Images ---
    const mediaIds: string[] = [];
    
    if (imageUrls.length > 0) {
      const imagesToUpload = imageUrls.slice(0, 4); // Max 4
      console.log(`📸 Uploading ${imagesToUpload.length} images to X...`);

      // Upload one by one to avoid rate limits or weird async FormData issues
      for (const url of imagesToUpload) {
          const id = await uploadMediaToTwitter(accessToken, url);
          if (id) mediaIds.push(id);
      }
    }

    // --- 3. Construct Tweet ---
    const tweetPayload: any = {
      text: task.content || "", 
    };

    if (mediaIds.length > 0) {
      tweetPayload.media = { media_ids: mediaIds };
    }

    // --- 4. Send Tweet ---
    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tweetPayload),
    });

    if (!response.ok) {
        const errData = await response.json();
        console.error("Twitter API Error:", JSON.stringify(errData, null, 2));
        throw new Error(errData.detail || errData.title || "Twitter API Failed");
    }

    // --- 5. Success ---
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

// --- Helper: Refresh Twitter Token ---
async function refreshTwitterToken(refreshToken: string) {
    const url = "https://api.twitter.com/2/oauth2/token";
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