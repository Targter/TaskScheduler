"use client";

import dynamic from "next/dynamic";

// Components
const QuickPost = dynamic(() => import("./QuickPostForm"), { ssr: false });
const ConnectionStatus = dynamic(() => import("./Connections"));
const RecentActivity = dynamic(() => import("./RecentActivity"));

interface DashboardViewerProps {
  user: any;
  postsCount: number;
  upcomingPosts: any[];
  isXConnected: boolean;
  isLinkedinConnected: boolean;
}

export default function DashboardViewer({
  user,
  postsCount,
  upcomingPosts,
  isXConnected,
  isLinkedinConnected,
}: DashboardViewerProps) {
  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* 1. Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
        <p className="text-zinc-400 text-sm">
          Create, schedule, and manage your content pipeline.
        </p>
      </div>

      {/* 2. THE MAIN GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* --- LEFT COLUMN (Composer) --- */}
        <div className="lg:col-span-2 space-y-8">
          {/* A. The Composer */}
          <section>
            <QuickPost
              isXConnected={isXConnected}
              isLinkedinConnected={isLinkedinConnected}
              userImage={user?.image}
            />
          </section>

          {/* B. The Queue (Timeline) */}
          <section>
            <div className="flex items-center justify-between mb-4 px-1">
              <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-wider">
                Queue Timeline ({postsCount})
              </h2>
            </div>
            <RecentActivity posts={upcomingPosts} />
          </section>
        </div>

        {/* --- RIGHT COLUMN (Status & Stats) --- */}
        <div className="lg:col-span-1 space-y-6">
          {/* C. Connected Accounts Panel */}
          <ConnectionStatus isX={isXConnected} isLi={isLinkedinConnected} />

          {/* D. Mini Analytics / Tips */}
          <div className="bg-zinc-900/30 border border-white/5 rounded-2xl p-6">
            <h4 className="text-white font-medium mb-2">Pro Tip</h4>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Posts with images get 3x more engagement on X. Media uploads
              coming soon!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
