// // this is server comp
// // all necessary data fetch from the server only.
// // result not api call direct connection
// // hence the client will not interfere with the data.

// import DashboardPage from "@/components/dashboard/DashBoardViewer";
// import { authOptions } from "@/lib/auth";
// import { getServerSession } from "next-auth";
// import { redirect } from "next/navigation";
// import { prisma } from "@/lib/db";

// // server comp can we await..
// export default async function Dashboard() {
//   const session = await getServerSession(authOptions);

//   if (!session?.user?.id) {
//     redirect("/login");
//   }

//   // we are doing server side rendering this all the server comp: nto effected from the client side. .
//   const [postsCount, upcomingPosts, connectedAccounts] = await Promise.all([
//     // post count
//     prisma.task.count({
//       where: {
//         userId: session.user.id,
//       },
//     }),
//     // next 3 schedule post
//     prisma.task.findMany({
//       where: {
//         userId: session.user.id,
//         status: "PENDING",
//       },
//       orderBy: {
//         scheduledAt: "asc",
//       },
//       take: 3,
//     }),

//     prisma.platformAccount.findMany({
//       where: {
//         userId: session.user.id,
//       },
//       select: {
//         platform: true,
//       },
//     }),
//   ]);

//   // Check specific connections
//   const isXConnected = connectedAccounts.some((a) => a.platform === "TWITTER");
//   const isLinkedinConnected = connectedAccounts.some(
//     (a) => a.platform === "LINKEDIN",
//   );
//   // console.log("user:", session.user);

//   return (
//     <DashboardPage
//       user={session.user}
//       postsCount={postsCount}
//       upcomingPosts={upcomingPosts}
//       isXConnected={isXConnected}
//       isLinkedinConnected={isLinkedinConnected}
//     />
//   );
// }

import DashboardPage from "@/components/dashboard/DashBoardViewer";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }
  // const redisKey = `user:${session.user.id}:post`;
  const redisKey = `user:cmku0afme0000c8oayci13wfd:post`;

  const [
    usageCountRaw,
    postsCount,
    sentCount,
    upcomingPosts,
    connectedAccounts,
  ] = await Promise.all([
    // Total Scheduled/Pending

    // redis.get<number>(redisKey),
    redis.get(redisKey),
    prisma.task.count({
      where: { userId: session.user.id, status: "PENDING" },
    }),
    // Total Successful
    prisma.task.count({
      where: { userId: session.user.id, status: "COMPLETED" },
    }),
    // Queue
    prisma.task.findMany({
      where: { userId: session.user.id, status: "PENDING" },
      orderBy: { scheduledAt: "asc" },
      take: 5,
      include: { executions: { select: { platform: true } } }, // Critical for icons
    }),
    // Connections
    prisma.platformAccount.findMany({
      where: { userId: session.user.id },
      select: { platform: true },
    }),
  ]);

  const isXConnected = connectedAccounts.some((a) => a.platform === "TWITTER");
  const isLinkedinConnected = connectedAccounts.some(
    (a) => a.platform === "LINKEDIN",
  );
  // const isInstagramConnected = connectedAccounts.some(
  //   (a) => a.platform === "INSTAGRAM",
  // );
  // const isWhatsAppConnected = connectedAccounts.some(
  //   (a) => a.platform === "WHATSAPP",
  // );
  const usageCount = Number(usageCountRaw ?? 0);

  console.log("usageCountRaw page.tsx", usageCountRaw);
  console.log("usagecount:", usageCount);
  return (
    <DashboardPage
      user={session.user}
      postsCount={postsCount}
      sentCount={sentCount}
      upcomingPosts={upcomingPosts}
      isXConnected={isXConnected}
      // isInstagramConnected={isInstagramConnected}
      isLinkedinConnected={isLinkedinConnected}
      // isWhatsAppConnected={isWhatsAppConnected}
      usageCount={usageCount || 0}
      isPro={false}
    />
  );
}
