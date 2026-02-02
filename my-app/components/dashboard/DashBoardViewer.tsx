"use client";

import dynamic from "next/dynamic";
import { CheckCircle2, Clock, BarChart3, Layout } from "lucide-react";

const QuickPost = dynamic(() => import("./QuickPostForm"), { ssr: false });
const ConnectionStatus = dynamic(() => import("./Connections"));
const RecentActivity = dynamic(() => import("./RecentActivity"));

export default function DashboardViewer({
  user,
  postsCount,
  sentCount,
  upcomingPosts,
  isXConnected,
  isLinkedinConnected,
  isInstagramConnected,
  isWhatsAppConnected,
  usageCount,
  isPro,
}: any) {
  const hasConnections =
    isXConnected ||
    isLinkedinConnected ||
    isInstagramConnected ||
    isWhatsAppConnected;

  return (
    <div className="max-w-6xl mx-auto  p-4 md:p-1  transition-all">
      {/* 1. HEADER AREA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Dashboard
          </h1>
          <p className="text-zinc-500 text-xs mt-1">
            Welcome back,{" "}
            <span className="text-zinc-300 font-medium">
              {user.name?.split(" ")[0]}
            </span>
            . System status is normal.
          </p>
        </div>

        <div className="flex gap-2">
          <StatPill
            icon={Clock}
            label="Queue"
            value={postsCount}
            color="text-blue-400"
          />
          <StatPill
            icon={CheckCircle2}
            label="Sent"
            value={sentCount}
            color="text-emerald-400"
          />
        </div>
      </div>

      {/* 2. GRID SYSTEM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT: Engine */}
        <div className="lg:col-span-8 space-y-6">
          <QuickPost
            isXConnected={isXConnected}
            isLinkedinConnected={isLinkedinConnected}
            isInstagramConnected={isInstagramConnected}
            userImage={user?.image}
            usageCount={usageCount}
            isPro={isPro}
          />

          <section className="bg-zinc-900/20 border border-white/5 rounded-3xl p-1">
            <div className="flex items-center justify-between p-4 pb-2">
              <h2 className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Layout className="w-3 h-3" />
                Next in Pipeline
              </h2>
            </div>
            <RecentActivity posts={upcomingPosts} />
          </section>
        </div>

        {/* RIGHT: Sidebar */}

        <div className="lg:col-span-4 space-y-4 sticky top-6">
          <ConnectionStatus
            isX={isXConnected}
            isLi={isLinkedinConnected}
            isIns={isInstagramConnected}
            isWhatsApp={isWhatsAppConnected}
          />

          <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5 relative overflow-hidden group">
            <div className="relative z-10">
              <h4 className="text-[11px] font-bold text-blue-400 mb-2 flex items-center gap-2 uppercase tracking-wider">
                <BarChart3 className="w-3.5 h-3.5" />
                Insights Engine
              </h4>
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Advanced engagement tracking for X & LinkedIn is being
                calibrated. Check back soon.
              </p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatPill({ icon: Icon, label, value, color }: any) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-1.5 bg-zinc-900/50 border border-white/5 rounded-xl">
      <div className={`p-1 rounded-md bg-zinc-950 ${color}`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xs font-bold text-white tabular-nums">
          {value}
        </span>
        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-tighter">
          {label}
        </span>
      </div>
    </div>
  );
}
