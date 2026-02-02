"use client";

import {
  Twitter,
  Linkedin,
  // Instagram,
  // MessageCircle,
  Plus,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Settings,
} from "lucide-react";
import Link from "next/link";

interface ConnectionStatusProps {
  isX: boolean;
  isLi: boolean;
  // isIns: boolean;
  // isWhatsApp: boolean;
}

export default function ConnectionStatus({
  isX,
  isLi,
  // isIns,
  // isWhatsApp,
}: ConnectionStatusProps) {
  // Calculate total connected for status message
  const connectedCount = [isX, isLi].filter(Boolean).length;
  const totalAccounts = 2;
  const isAllConnected = connectedCount === totalAccounts;

  return (
    <div className="w-full bg-zinc-900/40 border border-zinc-800 rounded-2xl p-5 sticky top-6 backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
          Network Status
        </h3>
        <Link
          href="/dashboard/connections"
          className="group flex items-center gap-1.5 text-[10px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <span>Manage</span>
          <Settings
            size={10}
            className="group-hover:rotate-45 transition-transform duration-300"
          />
        </Link>
      </div>

      {/* List */}
      <div className="space-y-3">
        {/* X / Twitter */}
        <AccountRow
          platform="X (Twitter)"
          isConnected={isX}
          icon={<Twitter size={14} />}
          themeColor="text-white" // Twitter rebranding to X (Black/White)
          bgTint="bg-black border-zinc-700"
          connectLink="/api/oauth/twitter"
        />

        {/* LinkedIn */}
        <AccountRow
          platform="LinkedIn"
          isConnected={isLi}
          icon={<Linkedin size={14} />}
          themeColor="text-white"
          bgTint="bg-[#0077b5] border-transparent"
          connectLink="/api/oauth/linkedin"
        />
        {/* <AccountRow
          platform="WhatsApp"
          isConnected={isWhatsApp}
          icon={<MessageCircle size={14} />}
          themeColor="text-white"
          bgTint="bg-[#0077b5] border-transparent"
          connectLink="/api/oauth/whatsapp"
        />
        <AccountRow
          platform="Instagram"
          isConnected={isIns}
          icon={<Instagram size={14} />}
          themeColor="text-white"
          bgTint="bg-[#0077b5] border-transparent"
          connectLink="/api/oauth/instagram"
        /> */}
      </div>

      {/* Footer / Global Status */}
      <div className="mt-5 pt-4 border-t border-zinc-800/50">
        {!isAllConnected ? (
          <Link
            href="/dashboard/connections"
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-zinc-800 bg-zinc-900/50 text-zinc-400 text-xs font-medium hover:bg-zinc-800 hover:text-zinc-200 hover:border-zinc-700 transition-all group"
          >
            <div className="p-0.5 bg-zinc-800 rounded group-hover:bg-zinc-700 transition-colors">
              <Plus size={12} />
            </div>
            Connect missing accounts
          </Link>
        ) : (
          <div className="flex items-center justify-center gap-2 text-xs text-emerald-500/80 font-medium py-1 animate-in fade-in duration-500">
            <CheckCircle2 size={12} />
            <span>All systems operational</span>
          </div>
        )}
      </div>
    </div>
  );
}

// --- Sub Component ---

interface AccountRowProps {
  platform: string;
  isConnected: boolean;
  icon: React.ReactNode;
  themeColor: string;
  bgTint: string;
  connectLink: string;
}

function AccountRow({
  platform,
  isConnected,
  icon,
  themeColor,
  bgTint,
  connectLink,
}: AccountRowProps) {
  return (
    <div className="group relative flex items-center justify-between p-3 rounded-xl bg-zinc-950/50 border border-zinc-800/80 hover:border-zinc-700 transition-all duration-300">
      <div className="flex items-center gap-3">
        {/* Icon Box */}
        <div
          className={`
            w-9 h-9 flex items-center justify-center rounded-lg border transition-all duration-300 shadow-sm
            ${isConnected ? `${bgTint} ${themeColor}` : "bg-zinc-900 border-zinc-800 text-zinc-600 grayscale opacity-70"}
          `}
        >
          {icon}
        </div>

        {/* Text Info */}
        <div className="flex flex-col justify-center">
          <span
            className={`text-sm font-semibold transition-colors ${isConnected ? "text-zinc-200" : "text-zinc-500"}`}
          >
            {platform}
          </span>
          <div className="flex items-center gap-1.5 h-4">
            {isConnected ? (
              <>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
                <span className="text-[10px] text-zinc-500 font-medium">
                  Connected
                </span>
              </>
            ) : (
              <div className="flex items-center gap-1 text-amber-500/80">
                <AlertCircle size={10} />
                <span className="text-[10px] font-medium">Disconnected</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pl-2">
        {isConnected ? (
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <Link
              href="/dashboard/connections"
              className="flex items-center justify-center w-7 h-7 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 transition-colors"
              title="Manage Settings"
            >
              <ExternalLink size={14} />
            </Link>
          </div>
        ) : (
          /* Using standard <a> for external OAuth redirects to ensure clean state */
          <a
            href={connectLink}
            className="flex items-center gap-1 px-3 py-1.5 bg-white text-black text-[10px] font-bold rounded-lg hover:bg-zinc-200 hover:scale-[1.02] shadow-lg shadow-white/5 transition-all"
            aria-label={`Connect to ${platform}`}
          >
            Connect
          </a>
        )}
      </div>
    </div>
  );
}
