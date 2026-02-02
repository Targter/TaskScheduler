import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/db";
import {
  Twitter,
  Linkedin,
  MessageCircle,
  CheckCircle2,
  ArrowRight,
  Lock,
  Globe,
  Plus,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

// --- CONFIG ---
const AVAILABLE_PLATFORMS = [
  {
    id: "TWITTER",
    name: "X (Twitter)",
    description: "Official API integration for tweets and threads.",
    icon: Twitter,
    color: "bg-white/5 text-white border-white/10",
    connectUrl: "/api/oauth/twitter",
    status: "LIVE",
  },
  {
    id: "LINKEDIN",
    name: "LinkedIn",
    description: "Post to personal profiles and company pages.",
    icon: Linkedin,
    color: "bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/20",
    connectUrl: "/dashboard/connections",
    status: "LIVE",
  },
  // {
  //   id: "WHATSAPP",
  //   name: "WhatsApp",
  //   description: "Broadcast to Channels and contact lists.",
  //   icon: MessageCircle,
  //   color: "bg-[#25D366]/10 text-[#25D366] border-[#25D366]/20",
  //   connectUrl: "#",
  //   status: "BETA",
  // },
];

const COMING_SOON = [
  { name: "Instagram", icon: Instagram },
  { name: "WhatsApp", icon: MessageCircle },
  { name: "Facebook", icon: Facebook },
  { name: "TikTok", icon: Globe },
];

export default async function ConnectionsPage() {
  const user = await requireUser();

  // 1. Fetch connected accounts (Including ID for deletion)
  const connections = await prisma.platformAccount.findMany({
    where: { userId: user.id },
    select: { id: true, platform: true },
  });

  const getConnection = (platformId: string) =>
    connections.find((c) => c.platform === platformId);

  // 2. SERVER ACTION: Disconnect Logic
  async function disconnectPlatform(formData: FormData) {
    "use server";
    const accountId = formData.get("accountId") as string;

    if (!accountId) return;

    await prisma.platformAccount.delete({
      where: { id: accountId },
    });

    revalidatePath("/dashboard/connections");
  }

  return (
    <div className="max-w-6xl mx-auto  p-2">
      {/* --- HEADER --- */}
      <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
        <h1 className="text-xl font-bold text-white tracking-tight">
          Integrations
        </h1>
        <p className="text-xs text-zinc-500 max-w-xl">
          Authorized connections for automated delivery.
        </p>
      </div>

      {/* --- AVAILABLE APPS --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {AVAILABLE_PLATFORMS.map((platform) => {
          const connection = getConnection(platform.id);
          const isConnected = !!connection;

          return (
            <div
              key={platform.id}
              className={`flex flex-col justify-between p-4 rounded-xl border transition-all duration-200 ${
                isConnected
                  ? "bg-zinc-900/40 border-emerald-500/20 shadow-[0_0_20px_-12px_rgba(16,185,129,0.2)]"
                  : "bg-zinc-900/20 border-white/5"
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <div className={`p-2 rounded-lg border ${platform.color}`}>
                    <platform.icon className="w-4 h-4" />
                  </div>
                  {isConnected ? (
                    <span className="flex items-center gap-1 text-[9px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded uppercase tracking-wider border border-emerald-500/10">
                      Connected
                    </span>
                  ) : (
                    platform.status === "BETA" && (
                      <span className="text-[9px] font-bold bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded uppercase tracking-wider">
                        Beta
                      </span>
                    )
                  )}
                </div>

                <h3 className="text-sm font-bold text-white mb-1">
                  {platform.name}
                </h3>
                <p className="text-[11px] text-zinc-500 leading-normal mb-4 italic">
                  {isConnected
                    ? `Your ${platform.name} account is linked and ready.`
                    : platform.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                {isConnected ? (
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-500/80 font-medium">
                    <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
                    Active
                  </div>
                ) : (
                  <span className="text-[10px] text-zinc-600 font-medium uppercase tracking-tighter">
                    Idle
                  </span>
                )}

                {isConnected ? (
                  /* DISCONNECT FORM ACTION */
                  <form action={disconnectPlatform}>
                    <input
                      type="hidden"
                      name="accountId"
                      value={connection.id}
                    />
                    <button
                      type="submit"
                      className="group flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 opacity-50 group-hover:opacity-100" />
                      Disconnect
                    </button>
                  </form>
                ) : (
                  <Link
                    href={platform.connectUrl}
                    className="flex items-center gap-1 px-3 py-1.5 bg-white text-black text-[10px] font-bold rounded-md hover:bg-zinc-200 transition-all"
                  >
                    Connect <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- ROADMAP SECTION --- */}
      <div className="pt-4">
        <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-3">
          Pipeline Roadmap
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {COMING_SOON.map((platform) => (
            <div
              key={platform.name}
              className="flex items-center gap-3 p-3 rounded-xl border border-white/5 bg-zinc-900/10 grayscale opacity-40 hover:opacity-100 transition-all cursor-default"
            >
              <div className="p-1.5 bg-zinc-800 rounded-md">
                <platform.icon className="w-3.5 h-3.5 text-zinc-400" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-400">
                  {platform.name}
                </span>
                <span className="text-[9px] text-zinc-600 flex items-center gap-1 uppercase tracking-tighter">
                  <Lock className="w-2 h-2" /> Pending
                </span>
              </div>
            </div>
          ))}

          <div className="flex items-center justify-center p-3 rounded-xl border border-dashed border-zinc-800 hover:border-zinc-700 hover:bg-white/[0.02] transition-all cursor-pointer group">
            <span className="text-[10px] font-bold text-zinc-600 group-hover:text-zinc-400 flex items-center gap-1">
              <Plus className="w-3 h-3" /> Request
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Instagram(props: any) {
  return <Globe {...props} />;
}
function Facebook(props: any) {
  return <Globe {...props} />;
}
