

// // import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
// // import { prisma } from "@/lib/db";
// // import { decrypt, encrypt } from "@/lib/crypto"; // <--- IMPORT ENCRYPT
// // import { NextResponse } from "next/server";

// // async function handler(req: Request) {
// //   const body = await req.json();
// //   const { taskId } = body;

// //   if (!taskId) return new NextResponse("Missing Task ID", { status: 400 });

// //   console.log(`🚀 Worker waking up for Task: ${taskId}`);

// //   // 1. Fetch Task with User & Executions
// //   const task = await prisma.task.findUnique({
// //     where: { id: taskId },
// //     include: {
// //       user: {
// //         include: { platformAccounts: true },
// //       },
// //       executions: true,
// //     },
// //   });

// //   if (!task) return new NextResponse("Task not found", { status: 404 });

// //   // 2. Identify the specific Execution for Twitter
// //   const execution = task.executions.find((e) => e.platform === "TWITTER");

// //   // If already done, stop
// //   if (!execution || execution.status === "SUCCESS") {
// //     return new NextResponse("Already processed", { status: 200 });
// //   }

// //   // 3. Mark as RUNNING
// //   await prisma.taskExecution.update({
// //     where: { id: execution.id },
// //     data: { status: "RUNNING", startedAt: new Date() },
// //   });

// //   // 4. Find Twitter Account
// //   let twitterAccount = task.user.platformAccounts.find(
// //     (acc) => acc.platform === "TWITTER"
// //   );

// //   if (!twitterAccount) {
// //     await prisma.taskExecution.update({
// //         where: { id: execution.id },
// //         data: { status: "FAILED", error: "No Connected Account" }
// //     });
// //     return new NextResponse("No connected Twitter account", { status: 200 });
// //   }

// //   // ============================================================
// //   // 🔄 AUTO-REFRESH LOGIC START
// //   // ============================================================
  
// //   let accessToken = decrypt(twitterAccount.encryptedAccessToken);
// //   const now = new Date();
  
// //   // Check if token is expired (or expires in the next 5 minutes)
// //   const isExpired = twitterAccount.expiresAt && twitterAccount.expiresAt < new Date(now.getTime() + 5 * 60000);

// //   if (isExpired) {
// //     console.log("⏳ Access Token expired. Refreshing with Twitter...");
    
// //     try {
// //         if (!twitterAccount.encryptedRefreshToken) {
// //             throw new Error("No refresh token available");
// //         }

// //         const refreshToken = decrypt(twitterAccount.encryptedRefreshToken);
        
// //         // Call Helper Function (defined at bottom)
// //         const newCredentials = await refreshTwitterToken(refreshToken);

// //         // Update Database with NEW tokens
// //         // Twitter rotates refresh tokens, so we must save the new one too.
// //         twitterAccount = await prisma.platformAccount.update({
// //             where: { id: twitterAccount.id },
// //             data: {
// //                 encryptedAccessToken: encrypt(newCredentials.access_token),
// //                 encryptedRefreshToken: encrypt(newCredentials.refresh_token),
// //                 expiresAt: new Date(Date.now() + newCredentials.expires_in * 1000),
// //             }
// //         });

// //         // Update the variable to use the NEW access token for the post below
// //         accessToken = newCredentials.access_token;
// //         console.log("✅ Token refreshed & saved.");

// //     } catch (refreshError: any) {
// //         console.error("Token Refresh Failed:", refreshError);
        
// //         await prisma.taskExecution.update({
// //             where: { id: execution.id },
// //             data: { 
// //                 status: "FAILED", 
// //                 error: "Connection expired. Please reconnect Twitter.",
// //                 finishedAt: new Date() 
// //             }
// //         });
// //         // We return 200 so QStash stops retrying. The user MUST reconnect manually.
// //         return new NextResponse("Token Refresh Failed", { status: 200 });
// //     }
// //   }
// //   // ============================================================
// //   // 🔄 AUTO-REFRESH LOGIC END
// //   // ============================================================

// //   // 5. Post to Twitter
// //   try {
// //     const response = await fetch("https://api.twitter.com/2/tweets", {
// //       method: "POST",
// //       headers: {
// //         Authorization: `Bearer ${accessToken}`,
// //         "Content-Type": "application/json",
// //       },
// //       body: JSON.stringify({ text: task.content }),
// //     });

// //     if (!response.ok) {
// //         const errData = await response.json();
// //         console.error("Twitter API Error:", errData);
// //         throw new Error(JSON.stringify(errData));
// //     }

// //     // 6. Success Transaction
// //     await prisma.$transaction([
// //         prisma.taskExecution.update({
// //             where: { id: execution.id },
// //             data: { status: "SUCCESS", finishedAt: new Date() }
// //         }),
// //         prisma.task.update({
// //             where: { id: taskId },
// //             data: { status: "COMPLETED" }
// //         })
// //     ]);

// //     return new NextResponse("Tweet Sent Successfully", { status: 200 });

// //   } catch (error: any) {
// //     console.error("Worker Execution Failed:", error);
    
// //     await prisma.taskExecution.update({
// //         where: { id: execution.id },
// //         data: { status: "FAILED", error: error.message || "Unknown Error", finishedAt: new Date() }
// //     });

// //     await prisma.task.update({
// //         where: { id: taskId },
// //         data: { status: "FAILED" }
// //     });

// //     return new NextResponse("Worker Processed (Failed)", { status: 200 });
// //   }
// // }

// // // --- Helper Function to Call Twitter API ---
// // async function refreshTwitterToken(refreshToken: string) {
// //     const url = "https://api.twitter.com/2/oauth2/token";
    
// //     // Twitter requires Basic Auth with Client ID & Secret for refreshing
// //     const basicAuth = Buffer.from(
// //         `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
// //     ).toString("base64");

// //     const params = new URLSearchParams({
// //         grant_type: "refresh_token",
// //         refresh_token: refreshToken,
// //     });

// //     const res = await fetch(url, {
// //         method: "POST",
// //         headers: {
// //             "Content-Type": "application/x-www-form-urlencoded",
// //             "Authorization": `Basic ${basicAuth}`,
// //         },
// //         body: params,
// //     });

// //     if (!res.ok) {
// //         const text = await res.text();
// //         throw new Error(`Twitter Refresh Error: ${text}`);
// //     }

// //     return await res.json();
// // }

// // export const POST = verifySignatureAppRouter(handler);


// import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
// import { prisma } from "@/lib/db";
// import { decrypt, encrypt } from "@/lib/crypto";
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
//   const isExpired = twitterAccount.expiresAt && twitterAccount.expiresAt < new Date(now.getTime() + 5 * 60000);

//   if (isExpired) {
//     console.log("⏳ Access Token expired. Refreshing...");
//     try {
//         if (!twitterAccount.encryptedRefreshToken) throw new Error("No refresh token");
//         const refreshToken = decrypt(twitterAccount.encryptedRefreshToken);
//         const newCredentials = await refreshTwitterToken(refreshToken);

//         twitterAccount = await prisma.platformAccount.update({
//             where: { id: twitterAccount.id },
//             data: {
//                 encryptedAccessToken: encrypt(newCredentials.access_token),
//                 encryptedRefreshToken: encrypt(newCredentials.refresh_token),
//                 expiresAt: new Date(Date.now() + newCredentials.expires_in * 1000),
//             }
//         });
//         accessToken = newCredentials.access_token;
//     } catch (refreshError: any) {
//         console.error("Token Refresh Failed:", refreshError);
//         await prisma.taskExecution.update({
//             where: { id: execution.id },
//             data: { status: "FAILED", error: "Connection expired.", finishedAt: new Date() }
//         });
//         return new NextResponse("Token Refresh Failed", { status: 200 });
//     }
//   }
//   // ============================================================
//   // 🔄 AUTO-REFRESH LOGIC END
//   // ============================================================

//   try {
//     // ============================================================
//     // 📸 MEDIA UPLOAD LOGIC START
//     // ============================================================
//     const mediaIds: string[] = [];

//     // Check if task has media
//     if (task.mediaUrls && task.mediaUrls.length > 0) {
//         console.log(`📸 Uploading ${task.mediaUrls.length} images to Twitter...`);
        
//         for (const url of task.mediaUrls) {
//             const mediaId = await uploadMediaToTwitter(url, accessToken);
//             if (mediaId) mediaIds.push(mediaId);
//         }
//     }
//     // ============================================================
//     // 📸 MEDIA UPLOAD LOGIC END
//     // ============================================================

//     // 5. Post Tweet (Text + Media)
//     const payload: any = {
//         text: task.content
//     };

//     // Attach media IDs if they exist
//     if (mediaIds.length > 0) {
//         payload.media = { media_ids: mediaIds };
//     }

//     const response = await fetch("https://api.twitter.com/2/tweets", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(payload),
//     });

//     if (!response.ok) {
//         const errData = await response.json();
//         console.error("Twitter API Error:", errData);
//         throw new Error(JSON.stringify(errData));
//     }

//     // 6. Success
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
//     // Mark parent task failed too
//     await prisma.task.update({
//         where: { id: taskId },
//         data: { status: "FAILED" }
//     });
//     return new NextResponse("Worker Processed (Failed)", { status: 200 });
//   }
// }

// // --- HELPER 1: Refresh Token ---
// async function refreshTwitterToken(refreshToken: string) {
//     const url = "https://api.twitter.com/2/oauth2/token";
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

//     if (!res.ok) throw new Error(await res.text());
//     return await res.json();
// }

// // --- HELPER 2: Upload Media to Twitter V1.1 ---
// async function uploadMediaToTwitter(imageUrl: string, accessToken: string) {
//     try {
//         // 1. Fetch the image from the URL (UploadThing / S3)
//         const imageRes = await fetch(imageUrl);
//         const arrayBuffer = await imageRes.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);

//         // 2. Prepare Form Data for Twitter
//         // Note: Twitter V1.1 requires multipart/form-data
//         const formData = new FormData();
//         const blob = new Blob([buffer]);
//         formData.append("media", blob);

//         // 3. Upload to Twitter (V1.1 Endpoint)
//         // Twitter V2 does not have media upload yet, we must use V1.1
//         const uploadRes = await fetch("https://upload.twitter.com/1.1/media/upload.json", {
//             method: "POST",
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//                 // Do NOT set Content-Type header manually for FormData, fetch does it automatically with boundary
//             },
//             body: formData,
//         });

//         const data = await uploadRes.json();

//         if (!uploadRes.ok) {
//             console.error("X Media Upload Error:", data);
//             throw new Error(`Media upload failed: ${data.error || "Unknown"}`);
//         }

//         // Return the Media ID String
//         return data.media_id_string;

//     } catch (e) {
//         console.error("X Media Upload Exception:", e);
//         // We throw so the main handler marks the task as failed
//         throw e;
//     }
// }

// export const POST = verifySignatureAppRouter(handler);


// import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
// import { prisma } from "@/lib/db";
// import { decrypt, encrypt } from "@/lib/crypto";
// import { NextResponse } from "next/server";
// import { TwitterApi } from "twitter-api-v2"; // <--- NEW IMPORT

// async function handler(req: Request) {
//   const body = await req.json();
//   const { taskId } = body;

//   if (!taskId) return new NextResponse("Missing Task ID", { status: 400 });

//   console.log(`🚀 Worker waking up for Task: ${taskId}`);

//   // 1. Fetch Task
//   const task = await prisma.task.findUnique({
//     where: { id: taskId },
//     include: {
//       user: { include: { platformAccounts: true } },
//       executions: true,
//     },
//   });

//   if (!task) return new NextResponse("Task not found", { status: 404 });

//   // 2. Check Execution
//   const execution = task.executions.find((e) => e.platform === "TWITTER");
//   if (!execution || execution.status === "SUCCESS") {
//     return new NextResponse("Already processed", { status: 200 });
//   }

//   // 3. Mark Running
//   await prisma.taskExecution.update({
//     where: { id: execution.id },
//     data: { status: "RUNNING", startedAt: new Date() },
//   });

//   // 4. Get Account
//   let twitterAccount = task.user.platformAccounts.find(
//     (acc) => acc.platform === "TWITTER"
//   );

//   if (!twitterAccount) {
//     await prisma.taskExecution.update({
//       where: { id: execution.id },
//       data: { status: "FAILED", error: "No Connected Account" },
//     });
//     return new NextResponse("No account", { status: 200 });
//   }

//   // ============================================================
//   // 🔄 AUTO-REFRESH LOGIC
//   // ============================================================
//   let accessToken = decrypt(twitterAccount.encryptedAccessToken);
//   const now = new Date();
  
//   if (twitterAccount.expiresAt && twitterAccount.expiresAt < new Date(now.getTime() + 5 * 60000)) {
//     console.log("⏳ Token expired. Refreshing...");
//     try {
//       if (!twitterAccount.encryptedRefreshToken) throw new Error("No refresh token");
      
//       const refreshToken = decrypt(twitterAccount.encryptedRefreshToken);
      
//       // Use library to refresh
//       const client = new TwitterApi({ 
//         clientId: process.env.TWITTER_CLIENT_ID!, 
//         clientSecret: process.env.TWITTER_CLIENT_SECRET! 
//       });
      
//       const { client: newClient, accessToken: newAccess, refreshToken: newRefresh, expiresIn } = 
//         await client.refreshOAuth2Token(refreshToken);

//       await prisma.platformAccount.update({
//         where: { id: twitterAccount.id },
//         data: {
//           encryptedAccessToken: encrypt(newAccess),
//           encryptedRefreshToken: encrypt(newRefresh!),
//           expiresAt: new Date(Date.now() + expiresIn * 1000),
//         },
//       });
      
//       accessToken = newAccess;
//       console.log("✅ Token refreshed.");
//     } catch (error: any) {
//       console.error("Refresh Failed:", error);
//       await prisma.taskExecution.update({
//         where: { id: execution.id },
//         data: { status: "FAILED", error: "Connection expired.", finishedAt: new Date() }
//       });
//       return new NextResponse("Refresh Failed", { status: 200 });
//     }
//   }

//   try {
//     // Initialize Client with User Access Token
//     const client = new TwitterApi(accessToken);

//     // ============================================================
//     // 📸 MEDIA UPLOAD LOGIC
//     // ============================================================
//     const mediaIds: string[] = [];

//     if (task.mediaUrls && task.mediaUrls.length > 0) {
//       console.log(`📸 Uploading ${task.mediaUrls.length} images...`);
      
//       for (const url of task.mediaUrls) {
//         // Download Image
//         const imgRes = await fetch(url);
//         if (!imgRes.ok) throw new Error("Failed to download image");
//         const arrayBuffer = await imgRes.arrayBuffer();
//         const buffer = Buffer.from(arrayBuffer);

//         // Upload using Library (Handles V1.1 internals automatically)
//         const mediaId = await client.v1.uploadMedia(buffer, { mimeType: 'image/jpeg' });
//         mediaIds.push(mediaId);
//       }
//     }

//     // ============================================================
//     // 📝 POST TWEET
//     // ============================================================
//     const payload: any = { text: task.content };
//     if (mediaIds.length > 0) {
//       payload.media = { media_ids: mediaIds };
//     }

//     // Post using Library (V2 API)
//     await client.v2.tweet(payload);

//     // Success
//     await prisma.$transaction([
//       prisma.taskExecution.update({
//         where: { id: execution.id },
//         data: { status: "SUCCESS", finishedAt: new Date() },
//       }),
//       prisma.task.update({
//         where: { id: taskId },
//         data: { status: "COMPLETED" },
//       }),
//     ]);

//     return new NextResponse("Success", { status: 200 });

//   } catch (error: any) {
//     console.error("Worker Failed:", error);
//     await prisma.taskExecution.update({
//       where: { id: execution.id },
//       data: { status: "FAILED", error: error.message || "Unknown Error", finishedAt: new Date() },
//     });
//     // Mark task failed
//     await prisma.task.update({ where: { id: taskId }, data: { status: "FAILED" } });
    
//     return new NextResponse("Worker Failed", { status: 200 });
//   }
// }

// export const POST = verifySignatureAppRouter(handler);

// this is in starting with and without media configurationos



import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { prisma } from "@/lib/db";
import { decrypt, encrypt } from "@/lib/crypto"; // <--- IMPORT ENCRYPT
import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";


async function postTweetWithRetry(
  accessToken: string,
  text: string
) {

  const MAX_RETRIES = 5;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {

    const res = await fetch(
      "https://api.twitter.com/2/tweets",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "User-Agent": "TaskSchedulerWorker/1.0",
          "Accept": "application/json",
        },
        body: JSON.stringify({ text }),
      }
    );

    const data = await res.json();

    console.log(
      `Tweet attempt ${attempt}`,
      res.status,
      data
    );

    if (res.ok) return data;

    // ✅ retryable twitter infra errors
    if ([503,502,429].includes(res.status)) {
      await new Promise(r =>
        setTimeout(r, 2000 * attempt)
      );
      continue;
    }

    throw new Error(JSON.stringify(data));
  }

  throw new Error("Twitter unavailable after retries");
}


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
    // const response = await fetch("https://api.twitter.com/2/tweets", {
    //   method: "POST",
    //   headers: {
    //     Authorization: `Bearer ${accessToken}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ text: task.content }),
    // });

    // if (!response.ok) {
    //     const errData = await response.json();
    //     console.error("Twitter API Error:", errData);
    //     throw new Error(JSON.stringify(errData));
    // }
    await postTweetWithRetry(
    accessToken,
    task.content
);

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
    //   revalidateTag("dashboard-posts", "dashboard-posts-key");

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