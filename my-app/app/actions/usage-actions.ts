"use server";

// // import { redis } from "@/lib/redis";
// import { authOptions } from "@/lib/auth";
// import { redis } from "@/lib/redis";
// import { getServerSession } from "next-auth";

// export type Platform = "TWITTER" | "LINKEDIN";

// export async function getUsageCountByPlatform() {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     return {
//       twitter: 0,
//       linkedin: 0,
//     };
//   }

//   const userId = session.user.id;

//   // Redis keys (per platform quota)
//   const twitterKey = `user:${userId}:quota:TWITTER`;
//   const linkedinKey = `user:${userId}:quota:LINKEDIN`;

//   const [twitterUsage, linkedinUsage] = await Promise.all([
//     redis.get<number>(twitterKey),
//     redis.get<number>(linkedinKey),
//   ]);

//   return {
//     twitter: Number(twitterUsage ?? 0),
//     linkedin: Number(linkedinUsage ?? 0),
//   };
// }


// lib/data-fetching.ts (Create this file or put inside layout)
// import { unstable_cache } from "next/cache";
import { redis } from "@/lib/redis";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { unstable_cache } from "next/cache";


export const getUsageCountByPlatform = async ()=> {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return {
        twitter: 0,
        linkedin: 0,
        };
    }

  const userId = session.user.id;
    const twitterKey = `user:${userId}:quota:TWITTER`;
    const linkedinKey = `user:${userId}:quota:LINKEDIN`;

    const [twitter, linkedin] = await Promise.all([
      redis.get<number>(twitterKey),
      redis.get<number>(linkedinKey),
    ]);

    return {
      twitter: twitter ?? 0,
      linkedin: linkedin ?? 0,
    };
  } 




// 1. Fetch Posts (Recent Activity) - Tagged
export const getCachedDashboardPosts = unstable_cache(
  async (userId: string) => {
    return await Promise.all([
      // Pending Count
      prisma.task.count({ where: { userId, status: "PENDING" } }),
      // Completed Count
      prisma.task.count({ where: { userId, status: "COMPLETED" } }),
      // Recent Posts List
      prisma.task.findMany({
        where: { userId, status: "PENDING" },
        orderBy: { scheduledAt: "asc" },
        take: 3,
        include: { executions: { select: { platform: true } } },
      }),
    ]);
  },
  ['dashboard-posts-key'], // Internal Cache ID
  { tags: ['dashboard-posts'] } // 👈 THE IMPORTANT TAG
  
);