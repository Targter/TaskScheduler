import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs";
import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/crypto";
import { NextResponse } from "next/server";

async function handler(req: Request) {
  const { taskId } = await req.json();

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      user: { include: { platformAccounts: true } },
      executions: true,
    },
  });

  if (!task) return new NextResponse("Task not found", { status: 404 });

  // 1. Get WhatsApp Account
  const waAccount = task.user.platformAccounts.find((acc) => acc.platform === "WHATSAPP");
  if (!waAccount) return new NextResponse("No WhatsApp connected", { status: 200 });

  const execution = task.executions.find(e => e.platform === "WHATSAPP");
  if (!execution) return new NextResponse("No execution found", { status: 200 });

  // 2. Mark Running
  await prisma.taskExecution.update({
    where: { id: execution.id },
    data: { status: "RUNNING", startedAt: new Date() }
  });

  try {
    const accessToken = decrypt(waAccount.encryptedAccessToken);
    const phoneNumberId = waAccount.externalId;

    // HARDCODED DESTINATION FOR MVP
    // In V2, you should add a 'destination' field to your Task model.
    // For now, replace this with your own test number or a dynamic one.
    const destinationNumber = "917973446163"; 

    // 3. Send Message
    const response = await fetch(`https://graph.facebook.com/v18.0/${phoneNumberId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: destinationNumber, 
        type: "text",
        text: { body: task.content },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || "WhatsApp API Error");
    }

    // 4. Success
    await prisma.taskExecution.update({
        where: { id: execution.id },
        data: { status: "SUCCESS", finishedAt: new Date() }
    });
    
    // Check if all executions are done to update parent task... (omitted for brevity)

    return new NextResponse("WhatsApp Sent", { status: 200 });

  } catch (error: any) {
    console.error("WhatsApp Failed:", error);
    await prisma.taskExecution.update({
        where: { id: execution.id },
        data: { status: "FAILED", error: error.message }
    });
    return new NextResponse("Failed", { status: 500 });
  }
}

export const POST = verifySignatureAppRouter(handler);