"use server";

import { authOptions } from "@/lib/auth"; // OR "@/auth" depending on your file structure
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { Client } from "@upstash/qstash";

// Initialize QStash
const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export async function scheduleTask(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const content = formData.get("content") as string;
  const dateStr = formData.get("scheduledAt") as string;
  
  // Extract platforms manually from formData
  const platforms: string[] = [];
  // We check if the key exists in the formData
  if (formData.get("TWITTER")) platforms.push("TWITTER");
  if (formData.get("LINKEDIN")) platforms.push("LINKEDIN");

  if (!content) return { error: "Content is required" };
  if (platforms.length === 0) return { error: "Select a platform" };

  const scheduledAt = new Date(dateStr);
  console.log("actiosn:",scheduledAt)
  const unixTimestamp = Math.floor(scheduledAt.getTime() / 1000);
  console.log("unix:",unixTimestamp)
  try {
    // 1. Save to Database
    const task = await prisma.task.create({
      data: {
        userId: session.user.id,
        content: content,
        scheduledAt: scheduledAt,
        status: "PENDING",
        mediaUrls: [], // Images coming in V2
        executions: {
          create: platforms.map((p) => ({
            platform: p as any, // 'TWITTER' | 'LINKEDIN'
            status: "PENDING",
          })),
        },
      },
    });

    // 2. Schedule with QStash
    // Calculate delay in seconds
    // const now = new Date();
    // const delayInSeconds = Math.ceil((scheduledAt.getTime() - now.getTime()) / 1000);
    
    // // Safety check: If date is in past, QStash treats 0 delay as "immediate"
    // const finalDelay = delayInSeconds > 0 ? delayInSeconds : 0;

    // Determine the URL (Localhost vs Production)
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    
    // We send the Task ID to our worker
    await qstash.publishJSON({
      url: `${baseUrl}/api/workers/twitter`, 
      body: { taskId: task.id },
      delay: unixTimestamp,
      retries: 3, // Retry 3 times if Twitter API fails
    });

    revalidatePath("/dashboard");
    return { success: true };

  } catch (error) {
    console.error("Scheduling Error:", error);
    return { error: "Failed to schedule task" };
  }
}