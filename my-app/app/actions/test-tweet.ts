"use server";

import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import { decrypt } from "@/lib/crypto";

export async function sendTestTweet() {
  const user = await requireUser();

  // FIX: Use findFirst instead of findUnique
  // We want to find the Twitter account linked to THIS user.
  const account = await prisma.platformAccount.findFirst({
    where: {
      userId: user.id,   // <--- Filter by User
      platform: "TWITTER" // <--- Filter by Platform
    }
  });

  if (!account) {
    return { success: false, error: "No Twitter account connected" };
  }

  // 2. Decrypt the Token
  const accessToken = decrypt(account.encryptedAccessToken);
console.log("accessToken:",accessToken)
  // 3. Call Twitter API
  try {
    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: `Hello World! Testing my Schedulr app via API. Time: ${new Date().toLocaleTimeString()}`,
      }),
    });
    console.log("response:",response)
    const data = await response.json();

    if (!response.ok) {
      console.error("Twitter Error:", data);
      return { success: false, error: data.detail || "Failed to post to Twitter" };
    }

    return { success: true, data };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Network error" };
  }
}