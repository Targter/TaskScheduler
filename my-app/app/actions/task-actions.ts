"use server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Client } from "@upstash/qstash";
import { getServerSession } from "next-auth";

// Initialize Queue Client
const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
});

export async function scheduleTask(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");

  const content = formData.get("content") as string;
  const dateStr = formData.get("scheduledAt") as string;
  const scheduledAt = new Date(dateStr);

  // 1. Create Task in DB (Status: PENDING)
  const task = await prisma.task.create({
    data: {
      userId: session.user.id,
      content: content,
      scheduledAt: scheduledAt,
      status: "PENDING",
      // ... executions creation logic from before ...
      executions: {
        create: {
            platform: "TWITTER",
            status: "PENDING"
        }
      }
    },
  });

  // 2. DISPATCH TO QUEUE (The Magic)
  // Calculate delay in seconds
  const now = new Date();
  const delayInSeconds = Math.floor((scheduledAt.getTime() - now.getTime()) / 1000);

  // We assume your app is deployed at your domain. 
  // For Localhost testing, we need a tunnel (I'll explain below).
  const appUrl = process.env.NEXTAUTH_URL; 

  try {
    await qstash.publishJSON({
      url: `${appUrl}/api/workers/twitter`, // The Worker Endpoint
      body: { taskId: task.id },             // Payload
      delay: delayInSeconds > 0 ? delayInSeconds : 0, // Wait until scheduled time
      retries: 3,                            // Auto-retry on failure
    });
  } catch (error) {
    console.error("Queue Error:", error);
    // Optional: Delete task if queue fails, or mark as failed
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}