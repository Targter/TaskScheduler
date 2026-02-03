"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/session"; // Or your equivalent auth check

export async function disconnectPlatform(formData: FormData) {
  const user = await requireUser();
  const accountId = formData.get("accountId") as string;

  if (!accountId) return;

  // Security: Ensure the user owns this connection before deleting
  const connection = await prisma.platformAccount.findFirst({
    where: {
      id: accountId,
      userId: user.id, // Critical security check
    },
  });

  if (!connection) {
    throw new Error("Unauthorized or connection not found");
  }

  await prisma.platformAccount.delete({
    where: { id: accountId },
  });

  // Revalidate both the connections page AND the main dashboard (so the sidebar updates)
  revalidatePath("/dashboard/connections");
  revalidatePath("/dashboard"); 
}