import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Twitter, CheckCircle2 } from "lucide-react";
// Import the button
import TestTweetButton from "./TestButton";

export default async function ConnectionsPage() {
  const session = await getServerSession(authOptions);

  const connectedAccounts = await prisma.platformAccount.findMany({
    where: { userId: session?.user?.id },
    select: { platform: true },
  });

  const isTwitterConnected = connectedAccounts.some(
    (acc) => acc.platform === "TWITTER",
  );

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Connections</h1>
      <p className="text-zinc-400 mb-8">
        Manage your social media integrations.
      </p>

      <div className="grid gap-4">
        {/* Twitter Card */}
        <div className="bg-zinc-900 border border-white/10 p-6 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black rounded-lg border border-white/10">
              <Twitter className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-white">X / Twitter</h3>
              <p className="text-sm text-zinc-400">
                Connect to schedule tweets.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            {isTwitterConnected ? (
              <>
                <div className="flex items-center gap-2 text-green-500 font-medium bg-green-500/10 px-4 py-2 rounded-lg">
                  <CheckCircle2 className="w-4 h-4" /> Connected
                </div>
                {/* here the demo tweet button...  */}
                {/* ADD THE TEST BUTTON HERE */}
                <TestTweetButton isConnected={isTwitterConnected} />
              </>
            ) : (
              <a
                href="/api/oauth/twitter"
                className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition"
              >
                Connect
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
