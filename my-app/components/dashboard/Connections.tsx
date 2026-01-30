"use client";

import {
  Twitter,
  Linkedin,
  Plus,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

interface Props {
  isX: boolean;
  isLi: boolean;
}

export default function ConnectionStatus({ isX, isLi }: Props) {
  return (
    <div className="bg-zinc-900/50 border border-white/5 rounded-2xl p-6 sticky top-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-zinc-400 font-bold text-sm uppercase tracking-wider">
          Accounts
        </h3>
        <Link
          href="/dashboard/connections"
          className="text-xs text-blue-400 hover:text-blue-300 font-medium"
        >
          Manage
        </Link>
      </div>

      <div className="space-y-3">
        {/* X / Twitter */}
        <AccountRow
          platform="X (Twitter)"
          isConnected={isX}
          icon={<Twitter className="w-4 h-4 text-white" />}
          bgColor="bg-black"
          connectLink="/api/oauth/twitter"
        />

        {/* LinkedIn */}
        <AccountRow
          platform="LinkedIn"
          isConnected={isLi}
          icon={<Linkedin className="w-4 h-4 text-white" />}
          bgColor="bg-[#0A66C2]"
          connectLink="/dashboard/connections" // Fallback until we build Li OAuth
        />

        {/* Placeholder for future expansion */}
        <button
          disabled
          className="w-full mt-4 flex items-center justify-center gap-2 p-3 rounded-xl border border-dashed border-zinc-700 text-zinc-600 text-sm hover:border-zinc-500 hover:text-zinc-400 transition"
        >
          <Plus className="w-4 h-4" />
          Connect New Account
        </button>
      </div>
    </div>
  );
}

function AccountRow({
  platform,
  isConnected,
  icon,
  bgColor,
  connectLink,
}: any) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${isConnected ? bgColor : "bg-zinc-800 grayscale opacity-50"}`}
        >
          {icon}
        </div>
        <div>
          <p
            className={`text-sm font-medium ${isConnected ? "text-white" : "text-zinc-500"}`}
          >
            {platform}
          </p>
          <p className="text-[10px] text-zinc-600">
            {isConnected ? "Active" : "Disconnected"}
          </p>
        </div>
      </div>

      {isConnected ? (
        <CheckCircle2 className="w-4 h-4 text-green-500" />
      ) : (
        <a
          href={connectLink}
          className="p-1.5 bg-white text-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
          title="Connect"
        >
          <Plus className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}
