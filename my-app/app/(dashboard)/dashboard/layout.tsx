import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Your auth config
import { redirect } from "next/navigation";
import { DashboardProvider } from "../provider";
import Sidebar from "@/components/dashboard/Sidebar";
// import { redis } from "@/lib/redis";
import { getUsageCountByPlatform } from "@/app/actions/usage-actions";
// import Sidebar from "../../components/Sidebar";

// export const dynamic = "force-dynamic";
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  // console.log("userSession:", session);
  if (!session) {
    redirect("/login");
  }
  //
  // const redisKey = `user:${session.user.id}:post`;
  // const usageCount = (await redis.get<number>(redisKey)) || 0;
  // console.log("usageCount:layout:", usageCount);

  // const twitterKey = `user:${session.user.id}:quota:TWITTER`;
  // const linkedinKey = `user:${session.user.id}:quota:LINKEDIN`;

  // const [twitterUsage, linkedinUsage] = await Promise.all([
  //   redis.get<number>(twitterKey),
  //   redis.get<number>(linkedinKey),
  // ]);

  // const usageCount = {
  //   twitter: twitterUsage ?? 0,
  //   linkedin: linkedinUsage ?? 0,
  // };
  const usageCount = await getUsageCountByPlatform();

  return (
    <DashboardProvider user={session.user}>
      <div className="min-h-screen bg-black">
        {/* Sidebar (Desktop) */}
        <Sidebar user={session.user} usageStats={usageCount} />

        {/* Main Content Area */}
        <div className="md:ml-64 min-h-screen flex flex-col">
          {/* Mobile Header (Only visible on small screens) */}
          <header className="md:hidden h-16 border-b border-white/10 flex items-center justify-between px-6 bg-zinc-950 sticky top-0 z-50">
            <span className="font-bold text-white">Schedulr.</span>
            <div className="w-8 h-8 bg-zinc-800 rounded-full">
              {/* Mobile User Icon / Menu Trigger would go here */}
            </div>
          </header>

          {/* Dynamic Page Content */}
          <main className="flex-1 p-6 md:p-10">{children}</main>
        </div>
      </div>
    </DashboardProvider>
  );
}
