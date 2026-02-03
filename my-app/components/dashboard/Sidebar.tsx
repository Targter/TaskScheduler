// // "use client";

// // import Link from "next/link";
// // import { usePathname } from "next/navigation";
// // import {
// //   LayoutDashboard,
// //   CalendarClock,
// //   BarChart3,
// //   Settings,
// //   LogOut,
// //   ChevronDown,
// //   ChevronRight,
// //   Twitter,
// //   Linkedin,
// //   Network,
// //   Command,
// //   Zap,
// // } from "lucide-react";
// // import { signOut } from "next-auth/react";
// // import { useState } from "react";

// // export default function Sidebar({ user }: { user: any }) {
// //   const pathname = usePathname();
// //   const [isScheduleOpen, setIsScheduleOpen] = useState(true);

// //   return (
// //     <aside className="w-60 bg-[#09090b] border-r border-white/5 flex flex-col hidden md:flex h-screen fixed left-0 top-0 z-50">
// //       {/* --- BRAND --- */}
// //       <div className="h-14 flex items-center px-5 mb-4">
// //         <div className="flex items-center gap-2.5">
// //           <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center text-black shadow-sm">
// //             <Command className="w-4 h-4 stroke-[2.5px]" />
// //           </div>
// //           <span className="font-bold text-white text-sm tracking-tight uppercase tracking-[0.1em]">
// //             Schedulr
// //           </span>
// //         </div>
// //       </div>

// //       {/* --- NAVIGATION --- */}
// //       <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
// //         <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">
// //           Main
// //         </p>

// //         <NavItem
// //           href="/dashboard"
// //           icon={LayoutDashboard}
// //           label="Overview"
// //           active={pathname === "/dashboard"}
// //         />
// //         <NavItem
// //           href="/dashboard/connections"
// //           icon={Network}
// //           label="Connections"
// //           active={pathname === "/dashboard/connections"}
// //         />

// //         <div className="py-3">
// //           <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">
// //             Automation
// //           </p>
// //           <button
// //             onClick={() => setIsScheduleOpen(!isScheduleOpen)}
// //             className="w-full flex items-center justify-between px-3 py-1.5 text-[13px] font-medium text-zinc-400 hover:text-zinc-200 transition-colors group"
// //           >
// //             <div className="flex items-center gap-2.5">
// //               <CalendarClock className="w-4 h-4" />
// //               <span>Schedules</span>
// //             </div>
// //             {isScheduleOpen ? (
// //               <ChevronDown className="w-3 h-3 text-zinc-600" />
// //             ) : (
// //               <ChevronRight className="w-3 h-3 text-zinc-600" />
// //             )}
// //           </button>

// //           {isScheduleOpen && (
// //             <div className="ml-3.5 pl-4 border-l border-white/5 space-y-0.5 mt-1">
// //               <SubItem
// //                 href="/dashboard/schedule/twitter"
// //                 icon={Twitter}
// //                 label="X (Twitter)"
// //                 active={pathname.includes("/schedule/twitter")}
// //               />
// //               <SubItem
// //                 href="/dashboard/schedule/linkedin"
// //                 icon={Linkedin}
// //                 label="LinkedIn"
// //                 active={pathname.includes("/schedule/linkedin")}
// //               />
// //             </div>
// //           )}
// //         </div>

// //         <div className="pt-2">
// //           <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">
// //             Insight
// //           </p>
// //           <NavItem
// //             href="/dashboard/analytics"
// //             icon={BarChart3}
// //             label="Analytics"
// //             active={pathname === "/dashboard/analytics"}
// //           />
// //           <NavItem
// //             href="/dashboard/settings"
// //             icon={Settings}
// //             label="Settings"
// //             active={pathname === "/dashboard/settings"}
// //           />
// //         </div>
// //       </nav>

// //       {/* --- PLAN LIMIT CARD --- */}
// //       <div className="px-3 mb-4">
// //         <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-3 relative overflow-hidden group">
// //           <div className="flex items-center justify-between mb-2">
// //             <div className="flex items-center gap-1.5">
// //               <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500/20" />
// //               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
// //                 Free Plan
// //               </span>
// //             </div>
// //             <span className="text-[10px] font-mono text-zinc-500">4/10</span>
// //           </div>

// //           <p className="text-[11px] text-zinc-500 leading-snug mb-3">
// //             You've used 4 of your 10 monthly messages.
// //           </p>

// //           {/* Progress Bar */}
// //           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-3">
// //             <div className="h-full bg-yellow-500/50 w-[40%] rounded-full" />
// //           </div>

// //           <Link
// //             href="/dashboard/settings"
// //             className="block w-full py-1.5 text-center text-[10px] font-bold text-white bg-white/5 border border-white/5 rounded-md hover:bg-white/10 transition-all uppercase tracking-wider"
// //           >
// //             Upgrade Plan
// //           </Link>
// //         </div>
// //       </div>

// //       {/* --- USER FOOTER --- */}
// //       <div className="p-3 border-t border-white/5">
// //         <div className="flex items-center gap-3 p-2 rounded-xl transition-colors group">
// //           {user?.image ? (
// //             <img
// //               src={user.image}
// //               alt=""
// //               className="w-8 h-8 rounded-full border border-white/10 grayscale group-hover:grayscale-0 transition-all"
// //             />
// //           ) : (
// //             <div className="w-8 h-8 bg-zinc-800 rounded-full border border-white/5" />
// //           )}
// //           <div className="flex-1 min-w-0">
// //             <p className="text-[12px] font-bold text-zinc-200 truncate tracking-tight leading-none mb-1">
// //               {user?.name || "User"}
// //             </p>
// //             <p className="text-[10px] text-zinc-500 truncate lowercase font-medium opacity-60">
// //               Admin Mode
// //             </p>
// //           </div>
// //           <button
// //             onClick={() => signOut({ callbackUrl: "/login" })}
// //             className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors"
// //             title="Sign Out"
// //           >
// //             <LogOut className="w-3.5 h-3.5" />
// //           </button>
// //         </div>
// //       </div>
// //     </aside>
// //   );
// // }

// // // Sub-components NavItem and SubItem remain the same as previous response...
// // function NavItem({ href, icon: Icon, label, active }: any) {
// //   return (
// //     <Link
// //       href={href}
// //       className={`flex items-center gap-2.5 px-3 py-1.5 text-[13px] font-medium rounded-md transition-all relative ${
// //         active
// //           ? "text-white bg-white/5"
// //           : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
// //       }`}
// //     >
// //       {active && (
// //         <div className="absolute left-0 w-[2px] h-4 bg-blue-500 rounded-full" />
// //       )}
// //       <Icon
// //         className={`w-4 h-4 ${active ? "text-blue-400" : "text-zinc-500"}`}
// //       />
// //       {label}
// //     </Link>
// //   );
// // }

// // function SubItem({ href, icon: Icon, label, active }: any) {
// //   return (
// //     <Link
// //       href={href}
// //       className={`flex items-center gap-2 px-3 py-1 text-[12px] font-medium rounded-md transition-all ${
// //         active
// //           ? "text-zinc-100 bg-white/5"
// //           : "text-zinc-500 hover:text-zinc-300"
// //       }`}
// //     >
// //       <Icon
// //         className={`w-3.5 h-3.5 ${active ? "text-zinc-200" : "text-zinc-600"}`}
// //       />
// //       {label}
// //     </Link>
// //   );
// // }

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import {
//   LayoutDashboard,
//   CalendarClock,
//   BarChart3,
//   Settings,
//   LogOut,
//   ChevronDown,
//   ChevronRight,
//   Twitter,
//   Linkedin,
//   Network,
//   Command,
//   Zap,
// } from "lucide-react";
// import { signOut } from "next-auth/react";
// import { useState } from "react";
// // import { redis } from "@/lib/redis";

// // Add usageCount to props
// export default function Sidebar({
//   user,
//   usageStats = { twitter: 0, linkedin: 0 },
// }: {
//   user: any;
//   usageStats?: {
//     twitter: number;
//     linkedin: number;
//   };
// }) {

//   const pathname = usePathname();
//   const [isScheduleOpen, setIsScheduleOpen] = useState(true);

//   // Calculate Percentage (Cap at 100%)
//   // const redisKey = `user:${user.id}:posts`; // Ensure this matches your Server Action key exactly

//   // // 2. Debugging Logs (Check your VS Code Terminal)
//   // console.log("🔍 Checking Redis Key:", redisKey);
//   // const val = await redis.get<number>(redisKey);

//   // const limit = 10;
//   const LIMITS = {
//     TWITTER: 10,
//     LINKEDIN: 60,
//   };
//   // const percent = Math.min((usageCount / limit) * 100, 100);
//   // const isLimitReached = usageCount >= limit;

//   return (
//     <aside className="w-60 bg-[#09090b] border-r border-white/5 flex flex-col hidden md:flex h-screen fixed left-0 top-0 z-50">
//       {/* --- BRAND --- */}

//       <div className="h-14 flex items-center px-5 mb-4">
//         <div className="flex items-center gap-2.5">
//           <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center text-black shadow-sm">
//             <Command className="w-4 h-4 stroke-[2.5px]" />
//           </div>
//           <span className="font-bold text-white text-sm tracking-tight uppercase tracking-[0.1em]">
//             Schedulr
//           </span>
//         </div>
//       </div>

//       {/* --- NAVIGATION --- */}
//       <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
//         <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">
//           Main
//         </p>

//         <NavItem
//           href="/dashboard"
//           icon={LayoutDashboard}
//           label="Overview"
//           active={pathname === "/dashboard"}
//         />
//         <NavItem
//           href="/dashboard/connections"
//           icon={Network}
//           label="Connections"
//           active={pathname === "/dashboard/connections"}
//         />

//         <div className="py-3">
//           <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">
//             Automation
//           </p>
//           <button
//             onClick={() => setIsScheduleOpen(!isScheduleOpen)}
//             className="w-full flex items-center justify-between px-3 py-1.5 text-[13px] font-medium text-zinc-400 hover:text-zinc-200 transition-colors group"
//           >
//             <div className="flex items-center gap-2.5">
//               <CalendarClock className="w-4 h-4" />
//               <span>Schedules</span>
//             </div>
//             {isScheduleOpen ? (
//               <ChevronDown className="w-3 h-3 text-zinc-600" />
//             ) : (
//               <ChevronRight className="w-3 h-3 text-zinc-600" />
//             )}
//           </button>

//           {isScheduleOpen && (
//             <div className="ml-3.5 pl-4 border-l border-white/5 space-y-0.5 mt-1">
//               <SubItem
//                 href="/dashboard/schedule/twitter"
//                 icon={Twitter}
//                 label="X (Twitter)"
//                 active={pathname.includes("/schedule/twitter")}
//               />
//               <SubItem
//                 href="/dashboard/schedule/linkedin"
//                 icon={Linkedin}
//                 label="LinkedIn"
//                 active={pathname.includes("/schedule/linkedin")}
//               />
//             </div>
//           )}
//         </div>

//         <div className="pt-2">
//           <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">
//             Insight
//           </p>
//           <NavItem
//             href="/dashboard/analytics"
//             icon={BarChart3}
//             label="Analytics"
//             active={pathname === "/dashboard/analytics"}
//           />
//           <NavItem
//             href="/dashboard/settings"
//             icon={Settings}
//             label="Settings"
//             active={pathname === "/dashboard/settings"}
//           />
//         </div>
//       </nav>

//       {/* --- PLAN LIMIT CARD --- */}
//       {/* <div className="px-3 mb-4">
//         <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-3 relative overflow-hidden group">
//           <div className="flex items-center justify-between mb-2">
//             <div className="flex items-center gap-1.5">
//               <Zap
//                 className={`w-3 h-3 ${isLimitReached ? "text-red-500 fill-red-500/20" : "text-yellow-500 fill-yellow-500/20"}`}
//               />
//               <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tight">
//                 Free Plan
//               </span>
//             </div>
//             <span
//               className={`text-[10px] font-mono ${isLimitReached ? "text-red-400" : "text-zinc-500"}`}
//             >
//               {usageCount}/{limit}
//             </span>
//           </div>

//           <p className="text-[11px] text-zinc-500 leading-snug mb-3">
//             {isLimitReached
//               ? "Limit reached. Upgrade to continue."
//               : `You've used ${usageCount} of your ${limit} lifetime messages.`}
//           </p>

//           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden mb-3">
//             <div
//               className={`h-full rounded-full transition-all duration-1000 ${isLimitReached ? "bg-red-500" : "bg-yellow-500/80"}`}
//               style={{ width: `${percent}%` }}
//             />
//           </div>

//           <Link
//             href="/dashboard/settings"
//             className="block w-full py-1.5 text-center text-[10px] font-bold text-white bg-white/5 border border-white/5 rounded-md hover:bg-white/10 transition-all uppercase tracking-wider"
//           >
//             Upgrade Plan
//           </Link>
//         </div>
//       </div> */}

//       <div className="px-3 mb-4">
//         <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-3.5 relative overflow-hidden group">
//           {/* Header */}
//           <div className="flex items-center gap-2 mb-3">
//             <div className="p-1.5 bg-yellow-500/10 rounded-md">
//               <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
//             </div>
//             <div>
//               <p className="text-[11px] font-bold text-zinc-200 uppercase tracking-tight leading-none">
//                 Free Plan
//               </p>
//               <p className="text-[10px] text-zinc-500 font-medium">
//                 Monthly Quota
//               </p>
//             </div>
//           </div>

//           <div className="space-y-3 mb-3">
//             {/* Twitter Quota */}
//             <QuotaRow
//               icon={Twitter}
//               label="X (Twitter)"
//               count={usageStats.twitter}
//               limit={LIMITS.TWITTER}
//             />

//             {/* LinkedIn Quota */}
//             <QuotaRow
//               icon={Linkedin}
//               label="LinkedIn"
//               count={usageStats.linkedin}
//               limit={LIMITS.LINKEDIN}
//             />
//           </div>

//           <Link
//             href="/dashboard/settings"
//             className="flex items-center justify-center w-full py-1.5 text-[10px] font-bold text-black bg-white rounded-lg hover:bg-zinc-200 transition-colors uppercase tracking-wide shadow-lg shadow-white/5"
//             prefetch={false}
//           >
//             Upgrade Plan
//           </Link>
//         </div>
//       </div>

//       {/* --- USER FOOTER --- */}
//       <div className="p-3 border-t border-white/5">
//         <div className="flex items-center gap-3 p-2 rounded-xl transition-colors group">
//           {user?.image ? (
//             <img
//               src={user.image}
//               alt=""
//               className="w-8 h-8 rounded-full border border-white/10 grayscale group-hover:grayscale-0 transition-all"
//             />
//           ) : (
//             <div className="w-8 h-8 bg-zinc-800 rounded-full border border-white/5" />
//           )}
//           <div className="flex-1 min-w-0">
//             <p className="text-[12px] font-bold text-zinc-200 truncate tracking-tight leading-none mb-1">
//               {user?.name || "User"}
//             </p>
//             <p className="text-[10px] text-zinc-500 truncate lowercase font-medium opacity-60">
//               Admin Mode
//             </p>
//           </div>
//           <button
//             onClick={() => signOut({ callbackUrl: "/login" })}
//             className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors"
//             title="Sign Out"
//           >
//             <LogOut className="w-3.5 h-3.5" />
//           </button>
//         </div>
//       </div>
//     </aside>
//   );
// }

// function NavItem({ href, icon: Icon, label, active }: any) {
//   return (
//     <Link
//       href={href}
//       className={`flex items-center gap-2.5 px-3 py-1.5 text-[13px] font-medium rounded-md transition-all relative ${
//         active
//           ? "text-white bg-white/5"
//           : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
//       }`}
//       prefetch={false}
//     >
//       {active && (
//         <div className="absolute left-0 w-[2px] h-4 bg-blue-500 rounded-full" />
//       )}
//       <Icon
//         className={`w-4 h-4 ${active ? "text-blue-400" : "text-zinc-500"}`}
//       />
//       {label}
//     </Link>
//   );
// }

// function QuotaRow({
//   icon: Icon,
//   label,
//   count,
//   limit,
// }: {
//   icon: any;
//   label: string;
//   count: number;
//   limit: number;
// }) {
//   const percentage = Math.min((count / limit) * 100, 100);
//   const isLimitReached = count >= limit;
//   const isNearLimit = percentage > 80;

//   let progressColor = "bg-emerald-500";
//   if (isLimitReached) progressColor = "bg-red-500";
//   else if (isNearLimit) progressColor = "bg-yellow-500";

//   return (
//     <div className="group/row">
//       <div className="flex items-center justify-between mb-1.5">
//         <div className="flex items-center gap-1.5 text-zinc-400 group-hover/row:text-zinc-300 transition-colors">
//           <Icon className="w-3 h-3" />
//           <span className="text-[10px] font-medium">{label}</span>
//         </div>
//         <span
//           className={`text-[9px] font-mono font-medium ${isLimitReached ? "text-red-400" : "text-zinc-500"}`}
//         >
//           {count}/{limit}
//         </span>
//       </div>

//       {/* Progress Track */}
//       <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
//         <div
//           className={`h-full rounded-full transition-all duration-700 ease-out ${progressColor} shadow-[0_0_8px_rgba(0,0,0,0.3)]`}
//           style={{ width: `${percentage}%` }}
//         />
//       </div>
//     </div>
//   );
// }

// function SubItem({ href, icon: Icon, label, active }: any) {
//   return (
//     <Link
//       href={href}
//       className={`flex items-center gap-2 px-3 py-1 text-[12px] font-medium rounded-md transition-all ${
//         active
//           ? "text-zinc-100 bg-white/5"
//           : "text-zinc-500 hover:text-zinc-300"
//       }`}
//       prefetch={false}
//     >
//       <Icon
//         className={`w-3.5 h-3.5 ${active ? "text-zinc-200" : "text-zinc-600"}`}
//       />
//       {label}
//     </Link>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarClock,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Twitter,
  Linkedin,
  Network,
  Command,
  Zap,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

// --- CLEANED UP PROPS ---
export default function Sidebar({
  user,
  // Default to 0 if data is missing, but prefer data from props
  usageStats = { twitter: 0, linkedin: 0 },
}: {
  user: any;
  usageStats: {
    twitter: number;
    linkedin: number;
  };
}) {
  const pathname = usePathname();
  const [isScheduleOpen, setIsScheduleOpen] = useState(true);

  // --- REMOVED: useState for stats ---
  // --- REMOVED: useEffect for fetching ---

  const LIMITS = {
    TWITTER: 10,
    LINKEDIN: 60,
  };

  return (
    <aside className="w-60 bg-[#09090b] border-r border-white/5 flex flex-col hidden md:flex h-screen fixed left-0 top-0 z-50">
      {/* Brand & Nav items remain exactly the same... */}
      <div className="h-14 flex items-center px-5 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center text-black shadow-sm">
            <Command className="w-4 h-4 stroke-[2.5px]" />
          </div>
          <span className="font-bold text-white text-sm tracking-tight uppercase tracking-[0.1em]">
            Schedulr
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
        {/* ... Your NavItems Code (Keep as is) ... */}
        <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">
          Main
        </p>

        <NavItem
          href="/dashboard"
          icon={LayoutDashboard}
          label="Overview"
          active={pathname === "/dashboard"}
        />
        <NavItem
          href="/dashboard/connections"
          icon={Network}
          label="Connections"
          active={pathname === "/dashboard/connections"}
        />

        <div className="py-3">
          <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">
            Automation
          </p>
          <button
            onClick={() => setIsScheduleOpen(!isScheduleOpen)}
            className="w-full flex items-center justify-between px-3 py-1.5 text-[13px] font-medium text-zinc-400 hover:text-zinc-200 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <CalendarClock className="w-4 h-4" />
              <span>Schedules</span>
            </div>
            {isScheduleOpen ? (
              <ChevronDown className="w-3 h-3 text-zinc-600" />
            ) : (
              <ChevronRight className="w-3 h-3 text-zinc-600" />
            )}
          </button>

          {isScheduleOpen && (
            <div className="ml-3.5 pl-4 border-l border-white/5 space-y-0.5 mt-1">
              <SubItem
                href="/dashboard/schedule/twitter"
                icon={Twitter}
                label="X (Twitter)"
                active={pathname.includes("/schedule/twitter")}
              />
              <SubItem
                href="/dashboard/schedule/linkedin"
                icon={Linkedin}
                label="LinkedIn"
                active={pathname.includes("/schedule/linkedin")}
              />
            </div>
          )}
        </div>

        <div className="pt-2">
          <p className="px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">
            Insight
          </p>
          <NavItem
            href="/dashboard/analytics"
            icon={BarChart3}
            label="Analytics"
            active={pathname === "/dashboard/analytics"}
          />
          <NavItem
            href="/dashboard/settings"
            icon={Settings}
            label="Settings"
            active={pathname === "/dashboard/settings"}
          />
        </div>
      </nav>

      {/* --- PLAN LIMIT CARD --- */}
      <div className="px-3 mb-4">
        <div className="bg-zinc-900/40 border border-white/5 rounded-xl p-3.5 relative overflow-hidden group">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-yellow-500/10 rounded-md">
              <Zap className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-zinc-200 uppercase tracking-tight leading-none">
                Free Plan
              </p>
              <p className="text-[10px] text-zinc-500 font-medium">
                Monthly Quota
              </p>
            </div>
          </div>

          <div className="space-y-3 mb-3">
            {/* 
               HERE IS THE MAGIC:
               We use `usageStats.twitter` which comes directly from the Server Layout.
               No loading states, no API calls on the client.
            */}
            <QuotaRow
              icon={Twitter}
              label="X (Twitter)"
              count={usageStats.twitter}
              limit={LIMITS.TWITTER}
            />

            <QuotaRow
              icon={Linkedin}
              label="LinkedIn"
              count={usageStats.linkedin}
              limit={LIMITS.LINKEDIN}
            />
          </div>

          <Link
            href="/dashboard/settings"
            className="flex items-center justify-center w-full py-1.5 text-[10px] font-bold text-black bg-white rounded-lg hover:bg-zinc-200 transition-colors uppercase tracking-wide shadow-lg shadow-white/5"
            prefetch={false}
          >
            Upgrade Plan
          </Link>
        </div>
      </div>

      {/* --- USER FOOTER --- */}
      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-3 p-2 rounded-xl transition-colors group">
          {user?.image ? (
            <img
              src={user.image}
              alt=""
              className="w-8 h-8 rounded-full border border-white/10 grayscale group-hover:grayscale-0 transition-all"
            />
          ) : (
            <div className="w-8 h-8 bg-zinc-800 rounded-full border border-white/5" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-zinc-200 truncate tracking-tight leading-none mb-1">
              {user?.name || "User"}
            </p>
            <p className="text-[10px] text-zinc-500 truncate lowercase font-medium opacity-60">
              Admin Mode
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

// ... Keep your NavItem, QuotaRow, SubItem components as they are ...
function NavItem({ href, icon: Icon, label, active }: any) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 px-3 py-1.5 text-[13px] font-medium rounded-md transition-all relative ${
        active
          ? "text-white bg-white/5"
          : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.03]"
      }`}
      prefetch={false}
    >
      {active && (
        <div className="absolute left-0 w-[2px] h-4 bg-blue-500 rounded-full" />
      )}
      <Icon
        className={`w-4 h-4 ${active ? "text-blue-400" : "text-zinc-500"}`}
      />
      {label}
    </Link>
  );
}

function QuotaRow({
  icon: Icon,
  label,
  count,
  limit,
}: {
  icon: any;
  label: string;
  count: number;
  limit: number;
}) {
  const percentage = Math.min((count / limit) * 100, 100);
  const isLimitReached = count >= limit;
  const isNearLimit = percentage > 80;

  let progressColor = "bg-emerald-500";
  if (isLimitReached) progressColor = "bg-red-500";
  else if (isNearLimit) progressColor = "bg-yellow-500";

  return (
    <div className="group/row">
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-1.5 text-zinc-400 group-hover/row:text-zinc-300 transition-colors">
          <Icon className="w-3 h-3" />
          <span className="text-[10px] font-medium">{label}</span>
        </div>
        <span
          className={`text-[9px] font-mono font-medium ${isLimitReached ? "text-red-400" : "text-zinc-500"}`}
        >
          {count}/{limit}
        </span>
      </div>

      {/* Progress Track */}
      <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${progressColor} shadow-[0_0_8px_rgba(0,0,0,0.3)]`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function SubItem({ href, icon: Icon, label, active }: any) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 px-3 py-1 text-[12px] font-medium rounded-md transition-all ${
        active
          ? "text-zinc-100 bg-white/5"
          : "text-zinc-500 hover:text-zinc-300"
      }`}
      prefetch={false}
    >
      <Icon
        className={`w-3.5 h-3.5 ${active ? "text-zinc-200" : "text-zinc-600"}`}
      />
      {label}
    </Link>
  );
}
