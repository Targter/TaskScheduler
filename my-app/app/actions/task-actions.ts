
// "use server";
// // export const runtime = "nodejs";

// import { authOptions } from "@/lib/auth"; // Update path if you use "@/auth"
// import { getServerSession } from "next-auth";
// import { prisma } from "@/lib/db";
// import { revalidatePath } from "next/cache";
// import { Client } from "@upstash/qstash";
// import { redis } from "@/lib/redis";


// // Initialize QStash Client
// const qstash = new Client({
//   token: process.env.QSTASH_TOKEN!,
// });

// export async function scheduleTask(formData: FormData) {
//   // 1. Authentication Check
//   const session = await getServerSession(authOptions);
//   if (!session?.user?.id) {
//     return { error: "Unauthorized" };
//   }

//    const key = `user:${session.user.id}:post`;
  
//   // Get current count (defaults to 0 if null)
//   // const currentUsage = await redis.get<number>(key) || 0;
//     const currentUsageRaw = await redis.get(key);
//   const currentUsage = Number(currentUsageRaw ?? 0);
//   const LIMIT = 10;

//   if (currentUsage >= LIMIT) {
//     return { error: `Free limit reached (${LIMIT}/${LIMIT}). Upgrade to post more.` };
//   }

//   // Above. Redis Implementation...


//   // 2. Extract Data
//   const content = formData.get("content") as string;
//   const dateStr = formData.get("scheduledAt") as string;
  
//   // Extract platforms
//   const platforms: string[] = [];
//    const mediaUrlsString = formData.get("mediaUrls") as string;
//   let mediaUrls: string[] = [];
  
//   if (mediaUrlsString) {
//     try {
//       mediaUrls = JSON.parse(mediaUrlsString);
//     } catch (e) {
//       console.error("Failed to parse media URLs");
//     }
//   }

//    // If your frontend uses append('platforms', 'X'), we use getAll here.
//   const rawPlatforms = formData.getAll("platforms") as string[]; 
  
//   // If rawPlatforms is empty, fall back to checking individual keys (Backward compatibility)
//   // const platforms: string[] = [];
//   if (rawPlatforms.length > 0) {
//     platforms.push(...rawPlatforms);
//   } else {
//     // Fallback check
//     if (formData.get("TWITTER")) platforms.push("TWITTER");
//     if (formData.get("LINKEDIN")) platforms.push("LINKEDIN");
//     if (formData.get("INSTAGRAM")) platforms.push("INSTAGRAM");
//     if (formData.get("WHATSAPP")) platforms.push("WHATSAPP");
//   }
//   // 3. Validation
//   if (!content) return { error: "Content is required" };
//   if (platforms.length === 0) return { error: "Select a platform" };

//   // 4. Parse Date & Convert to Seconds (CRITICAL STEP)
//   const scheduledAt = new Date(dateStr);
  
//   // ERROR FIX: 
//   // JavaScript .getTime() gives MILLISECONDS (e.g. 1700000000000).
//   // QStash needs SECONDS (e.g. 1700000000).
//   // We divide by 1000 and floor it.
//   const unixTimestamp = Math.floor(scheduledAt.getTime() / 1000);

//   try {
//     // 5. Save to Database
//     const task = await prisma.task.create({
//       data: {
//         userId: session.user.id,
//         content: content,
//         scheduledAt: scheduledAt,
//         status: "PENDING",
//         mediaUrls: mediaUrls,
//         executions: {
//           create: platforms.map((p) => ({
//             platform: p as any,
//             status: "PENDING",
//           })),
//         },
//       },
//     });

//     const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

//     // 6. Push to QStash
//     // We map over platforms to schedule a job for each
//     const promises = platforms.map(async (platform) => {
//       // Determine the worker URL based on platform if needed
//       // For now, using your existing twitter worker
//       // console.log("${workerPath}",platform.toLowerCase())
//       // const workerUrl = `${baseUrl}/api/workers/twitter`;

//        let workerPath = "";
//       if (platform === "TWITTER") {
//         workerPath = "/api/workers/twitter";
//       } else if (platform === "LINKEDIN") {
//         workerPath = "/api/workers/linkedin"; // Make sure this file exists!
//       } else if (platform === "WHATSAPP") {
//         workerPath = "/api/workers/whatsapp"; // <--- ROUTES TO THE NEW WORKER
//       }else {
//         workerPath = "/api/workers/instagram";
//         // console.warn(`Unknown platform: ${platform}`);
//         // return; 
//       }

//       const workerUrl = `${baseUrl}${workerPath}`;

//       // 
//       return qstash.publishJSON({
//         url: workerUrl,
//         body: { taskId: task.id, platform },
//         notBefore: unixTimestamp, 
//         retries: 3,
//       });
//     });
//     // increment... redis scheduling quota.. on success..
//     await redis.incr(key);
//     console.log("this increase:");

//     await Promise.all(promises);

//     revalidatePath("/dashboard");
//     return { success: true };

//   } catch (error: any) {
//     console.error("Scheduling Error:", error);
//     return { error: error.message || "Failed to schedule task" };
//   }
// }


"use server";

import { authOptions } from "@/lib/auth"; 
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import {  revalidatePath,revalidateTag } from "next/cache";
import { Client } from "@upstash/qstash";
import { redis } from "@/lib/redis";

// Initialize QStash Client
const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

const PLATFORM_LIMITS : Record<string,number> = {
   TWITTER: 10,
  LINKEDIN: 60,
  INSTAGRAM: 10, // Default limit
  WHATSAPP: 10   // Default limit
}
export async function scheduleTask(formData: FormData) {
  // 1. Authentication Check
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  // const key = `user:${session.user.id}:post`;
  
  // // --- FIX START: ROBUST READ ---
  // // We explicitly cast the return type and handle NaN
  // const currentUsageRaw = await redis.get(key) as string | number | null;
  // let currentUsage = Number(currentUsageRaw);
  
  // // If the value in Redis is garbage (NaN) or null, treat it as 0
  // if (isNaN(currentUsage) || currentUsageRaw === null) {
  //   currentUsage = 0;
  // }
  // // --- FIX END ---

  // const LIMIT = 10;

  // if (currentUsage >= LIMIT) {
  //   return { error: `Free limit reached (${LIMIT}/${LIMIT}). Upgrade to post more.` };
  // }

  // 2. Extract Data
  const content = formData.get("content") as string;
  const dateStr = formData.get("scheduledAt") as string;
  
  // Extract media
  const mediaUrlsString = formData.get("mediaUrls") as string;
  let mediaUrls: string[] = [];
  if (mediaUrlsString) {
    try {
      mediaUrls = JSON.parse(mediaUrlsString);
    } catch (e) {
      console.error("Failed to parse media URLs");
    }
  }

  // Extract platforms
  const rawPlatforms = formData.getAll("platforms") as string[]; 
  const platforms: string[] = [];
  if (rawPlatforms.length > 0) {
    platforms.push(...rawPlatforms);
  } else {
    if (formData.get("TWITTER")) platforms.push("TWITTER");
    if (formData.get("LINKEDIN")) platforms.push("LINKEDIN");
    if (formData.get("INSTAGRAM")) platforms.push("INSTAGRAM");
    if (formData.get("WHATSAPP")) platforms.push("WHATSAPP");
  }

  // 3. Validation
  if (!content) return { error: "Content is required" };
  if (platforms.length === 0) return { error: "Select a platform" };

  for (const platform of platforms) {
    const limit = PLATFORM_LIMITS[platform] || 10;
    
    // Key format: user:{id}:quota:{PLATFORM}
    const key = `user:${session.user.id}:quota:${platform}`;
    
    // --- ROBUST READ ---
    const currentUsageRaw = await redis.get(key) as string | number | null;
    let currentUsage = Number(currentUsageRaw);
    
    if (isNaN(currentUsage) || currentUsageRaw === null) {
      currentUsage = 0;
    }

    if (currentUsage >= limit) {
      return { 
        error: `You have reached your limit for ${platform === "TWITTER" ? "X (Twitter)" : "LinkedIn"} (${limit} posts). Upgrade to post more.` 
      };
    }
  }


  // 4. Parse Date & Convert to Seconds
  const scheduledAt = new Date(dateStr);
  const unixTimestamp = Math.floor(scheduledAt.getTime() / 1000);

  try {
    // 5. Save to Database
    const task = await prisma.task.create({
      data: {
        userId: session.user.id,
        content: content,
        scheduledAt: scheduledAt,
        status: "PENDING",
        mediaUrls: mediaUrls,
        executions: {
          create: platforms.map((p) => ({
            platform: p as any,
            status: "PENDING",
          })),
        },
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // 6. Push to QStash
    const promises = platforms.map(async (platform) => {
      let workerPath = "";
      if (platform === "TWITTER") {
        workerPath = "/api/workers/twitter";
      } else if (platform === "LINKEDIN") {
        workerPath = "/api/workers/linkedin"; 
      } else if (platform === "WHATSAPP") {
        workerPath = "/api/workers/whatsapp"; 
      } else {
        workerPath = "/api/workers/instagram";
      }

      const workerUrl = `${baseUrl}${workerPath}`;

      return qstash.publishJSON({
        url: workerUrl,
        body: { taskId: task.id, platform },
        notBefore: unixTimestamp, 
        retries: 3,
        delay:"180s"
      });
    });


    await Promise.all(promises);

    // --- FIX START: ROBUST INCREMENT ---
    // We wrap INCR in a try/catch. If the key is corrupted (not an integer),
    // INCR fails. In the catch block, we force-overwrite the key with a clean number.
    // try {
    //   await redis.incr(key);
    // } catch (redisError) {
    //   console.warn("Redis INCR failed (likely bad data format), resetting key:", redisError);
    //   // Force set the value to (current known usage + 1)
    //   await redis.set(key, currentUsage + 1);
    // }

     for (const platform of platforms) {
      const key = `user:${session.user.id}:quota:${platform}`;
      
      // --- ROBUST INCREMENT ---
      try {
        await redis.incr(key);
      } catch (redisError) {
        console.warn(`Redis INCR failed for ${platform}, resetting key:`, redisError);
        // Get current value again just to be safe, or default to 1
        const val = await redis.get(key) as string | number | null;
        const numVal = Number(val) || 0;
        await redis.set(key, numVal + 1);
      }
    }
    
    console.log("Quotas updated successfully");


    // --- FIX END ---
    
    // console.log("Quota increased successfully");

    // revalidatePath("/dashboard");
    revalidatePath("/dashboard", "layout"); 

    //  revalidateTag("dashboard-posts"); 
    // Pass the cache profile string used when creating the cache above
    // revalidateTag("dashboard-posts", "dashboard-posts-key");
    
    // // 2. Update the Sidebar Quota (Usage Limits)
    // revalidateTag("user-quota");
    return { success: true };

  } catch (error: any) {
    console.error("Scheduling Error:", error);
    return { error: error.message || "Failed to schedule task" };
  }
}