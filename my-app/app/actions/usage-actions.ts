"use server";

import { redis } from "@/lib/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

export type Platform = "TWITTER" | "LINKEDIN";

export async function getUsageCountByPlatform() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return {
      twitter: 0,
      linkedin: 0,
    };
  }

  const userId = session.user.id;

  // Redis keys (per platform quota)
  const twitterKey = `user:${userId}:quota:TWITTER`;
  const linkedinKey = `user:${userId}:quota:LINKEDIN`;

  const [twitterUsage, linkedinUsage] = await Promise.all([
    redis.get<number>(twitterKey),
    redis.get<number>(linkedinKey),
  ]);

  return {
    twitter: Number(twitterUsage ?? 0),
    linkedin: Number(linkedinUsage ?? 0),
  };
}
