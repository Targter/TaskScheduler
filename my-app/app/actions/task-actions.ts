
"use server";
// export const runtime = "nodejs";

import { authOptions } from "@/lib/auth"; // Update path if you use "@/auth"
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Client } from "@upstash/qstash";
import { redis } from "@/lib/redis";


// Initialize QStash Client
const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export async function scheduleTask(formData: FormData) {
  // 1. Authentication Check
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

   const key = `user:${session.user.id}:post`;
  
  // Get current count (defaults to 0 if null)
  // const currentUsage = await redis.get<number>(key) || 0;
    const currentUsageRaw = await redis.get(key);
  const currentUsage = Number(currentUsageRaw ?? 0);
  const LIMIT = 10;

  if (currentUsage >= LIMIT) {
    return { error: `Free limit reached (${LIMIT}/${LIMIT}). Upgrade to post more.` };
  }

  // Above. Redis Implementation...


  // 2. Extract Data
  const content = formData.get("content") as string;
  const dateStr = formData.get("scheduledAt") as string;
  
  // Extract platforms
  const platforms: string[] = [];
  if (formData.get("TWITTER")) platforms.push("TWITTER");
  if (formData.get("LINKEDIN")) platforms.push("LINKEDIN");
  if (formData.get("INSTAGRAM")) platforms.push("INSTAGRAM");
if (formData.get("WHATSAPP")) platforms.push("WHATSAPP");
  // 3. Validation
  if (!content) return { error: "Content is required" };
  if (platforms.length === 0) return { error: "Select a platform" };

  // 4. Parse Date & Convert to Seconds (CRITICAL STEP)
  const scheduledAt = new Date(dateStr);
  
  // ERROR FIX: 
  // JavaScript .getTime() gives MILLISECONDS (e.g. 1700000000000).
  // QStash needs SECONDS (e.g. 1700000000).
  // We divide by 1000 and floor it.
  const unixTimestamp = Math.floor(scheduledAt.getTime() / 1000);

  try {
    // 5. Save to Database
    const task = await prisma.task.create({
      data: {
        userId: session.user.id,
        content: content,
        scheduledAt: scheduledAt,
        status: "PENDING",
        mediaUrls: [],
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
    // We map over platforms to schedule a job for each
    const promises = platforms.map(async (platform) => {
      // Determine the worker URL based on platform if needed
      // For now, using your existing twitter worker
      // console.log("${workerPath}",platform.toLowerCase())
      // const workerUrl = `${baseUrl}/api/workers/twitter`;

       let workerPath = "";
      if (platform === "TWITTER") {
        workerPath = "/api/workers/twitter";
      } else if (platform === "LINKEDIN") {
        workerPath = "/api/workers/linkedin"; // Make sure this file exists!
      } else if (platform === "WHATSAPP") {
        workerPath = "/api/workers/whatsapp"; // <--- ROUTES TO THE NEW WORKER
      }else {
        workerPath = "/api/workers/instagram";
        // console.warn(`Unknown platform: ${platform}`);
        // return; 
      }

      const workerUrl = `${baseUrl}${workerPath}`;

      // 
      return qstash.publishJSON({
        url: workerUrl,
        body: { taskId: task.id, platform },
        notBefore: unixTimestamp, 
        retries: 3,
      });
    });
    // increment... redis scheduling quota.. on success..
    await redis.incr(key);
    console.log("this increase:");

    await Promise.all(promises);

    revalidatePath("/dashboard");
    return { success: true };

  } catch (error: any) {
    console.error("Scheduling Error:", error);
    return { error: error.message || "Failed to schedule task" };
  }
}