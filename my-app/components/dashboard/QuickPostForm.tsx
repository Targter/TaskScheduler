"use client";

import { useState, useRef, useEffect } from "react";
import {
  Twitter,
  Linkedin,
  Calendar,
  Clock,
  Send,
  Loader2,
  X,
  ChevronDown,
  Zap,
  Globe,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { format, addHours, addDays, nextMonday } from "date-fns";
import { scheduleTask } from "@/app/actions/task-actions";
// import { useRef } from "react";
// import useRef

interface QuickPostProps {
  isXConnected: boolean;
  isLinkedinConnected: boolean;
  userImage?: string | null;
}

export default function QuickPost({
  isXConnected,
  isLinkedinConnected,
  userImage,
}: QuickPostProps) {
  // State
  const [content, setContent] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Refs
  const scheduleMenuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Click Outside Listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        scheduleMenuRef.current &&
        !scheduleMenuRef.current.contains(event.target as Node)
      ) {
        setIsScheduleOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Platform Toggle Logic
  const togglePlatform = (platform: string) => {
    const isConnected =
      platform === "TWITTER" ? isXConnected : isLinkedinConnected;
    if (!isConnected) return; // Optional: Show toast error here

    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
  };

  // Quick Schedule Helpers
  const handleSmartSchedule = (type: "1hr" | "tomorrow" | "monday") => {
    const now = new Date();
    let date = now;

    if (type === "1hr") date = addHours(now, 1);
    if (type === "tomorrow") {
      date = addDays(now, 1);
      date.setHours(9, 0, 0, 0); // 9 AM
    }
    if (type === "monday") {
      date = nextMonday(now);
      date.setHours(9, 0, 0, 0);
    }

    // setScheduledDate(date);
    // setIsScheduleOpen(false);
    setScheduledDate(date);
    setIsScheduleOpen(false);
  };

  // Submit Handler
  async function handleSubmit() {
    if (!content.trim() || selectedPlatforms.length === 0) return;

    setIsPending(true);
    const formData = new FormData();
    formData.append("content", content);
    selectedPlatforms.forEach((p) => formData.append(p, "on"));

    const finalDate = scheduledDate || addHours(new Date(), 0); // Default to now (queued immediately)
    formData.set("scheduledAt", finalDate.toISOString());

    // --- CALL SERVER ACTION HERE ---
    await scheduleTask(formData);
    
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 1000));

    // Reset
    setContent("");
    setSelectedPlatforms([]);
    setScheduledDate(null);
    setIsPending(false);
  }

  return (
    <div
      className={`
        relative group rounded-3xl border transition-all duration-300 overflow-visible
        ${
          isFocused
            ? "bg-zinc-900 border-blue-500/30 shadow-2xl shadow-blue-900/10"
            : "bg-zinc-950 border-white/10 hover:border-white/20"
        }
      `}
    >
      <div className="p-6">
        <div className="flex gap-5">
          {/* Avatar Column */}
          <div className="pt-1 flex-shrink-0">
            {userImage ? (
              <img
                src={userImage}
                className="w-11 h-11 rounded-full border border-white/10 shadow-sm"
                alt="User"
              />
            ) : (
              <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                U
              </div>
            )}
          </div>

          {/* Editor Column */}
          <div className="flex-1 min-w-0">
            {/* 1. Editor */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="What is happening?"
                className="w-full bg-transparent border-none text-lg text-white placeholder:text-zinc-600 focus:ring-0 resize-none min-h-[100px] leading-relaxed p-0 scrollbar-hide"
              />

              {/* Character Count (Optional) */}
              {content.length > 0 && (
                <div className="absolute bottom-2 right-0 text-xs text-zinc-600 font-medium animate-in fade-in">
                  {content.length} chars
                </div>
              )}
            </div>

            {/* Divider */}
            <div
              className={`h-px w-full my-4 transition-colors duration-300 ${isFocused ? "bg-white/10" : "bg-white/5"}`}
            />

            {/* 2. Command Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Left: Platforms & Schedule Badge */}
              <div className="flex items-center flex-wrap gap-2">
                {/* Platform Pills */}
                <PlatformPill
                  icon={<Twitter className="w-3.5 h-3.5" />}
                  label="X"
                  active={selectedPlatforms.includes("TWITTER")}
                  connected={isXConnected}
                  onClick={() => togglePlatform("TWITTER")}
                  activeColor="bg-white text-black border-white"
                />
                <PlatformPill
                  icon={<Linkedin className="w-3.5 h-3.5" />}
                  label="LinkedIn"
                  active={selectedPlatforms.includes("LINKEDIN")}
                  connected={isLinkedinConnected}
                  onClick={() => togglePlatform("LINKEDIN")}
                  activeColor="bg-[#0A66C2] text-white border-[#0A66C2]"
                />

                <div className="w-px h-5 bg-white/10 mx-1" />

                {/* THE SCHEDULING USP */}
                {/* THE SCHEDULING USP */}
                <div className="relative" ref={scheduleMenuRef}>
                  {scheduledDate ? (
                    // State: Scheduled (Green Badge)
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold animate-in zoom-in cursor-default">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{format(scheduledDate, "MMM d • h:mm a")}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setScheduledDate(null);
                        }}
                        className="hover:text-white transition-colors p-0.5 rounded-full hover:bg-emerald-500/20"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    // State: Default (Trigger)
                    <button
                      type="button"
                      onClick={() => setIsScheduleOpen(!isScheduleOpen)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${isScheduleOpen ? "bg-zinc-800 text-white border-zinc-700" : "bg-transparent text-zinc-500 border-transparent hover:bg-zinc-900 hover:text-zinc-300"}`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>Post Now</span>
                      <ChevronDown className="w-3 h-3 opacity-50" />
                    </button>
                  )}

                  {/* The "Smart Schedule" Popover */}
                  {isScheduleOpen && (
                    <div className="absolute top-full mt-2 right-0 w-72 bg-[#09090b] border border-zinc-800 rounded-xl shadow-2xl shadow-black/50 z-50 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right ring-1 ring-white/5">
                      {/* Header */}
                      <div className="px-4 py-2.5 border-b border-white/5 bg-zinc-900/50 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                          Best Times
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-zinc-600">
                          <Globe className="w-3 h-3" /> UTC
                        </div>
                      </div>

                      {/* Smart Options */}
                      <div className="p-1.5 space-y-0.5">
                        <ScheduleOption
                          onClick={() => handleSmartSchedule("1hr")}
                          icon={<Zap className="w-3.5 h-3.5 text-amber-400" />}
                          label="In 1 Hour"
                          sub="High Engagement"
                        />
                        <ScheduleOption
                          onClick={() => handleSmartSchedule("tomorrow")}
                          icon={
                            <Calendar className="w-3.5 h-3.5 text-blue-400" />
                          }
                          label="Tomorrow Morning"
                          sub="9:00 AM"
                        />
                        <ScheduleOption
                          onClick={() => handleSmartSchedule("monday")}
                          icon={
                            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                          }
                          label="Next Monday"
                          sub="Start of week"
                        />
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-white/5 mx-2 my-1" />

                      {/* Custom Picker */}
                      <div className="p-1.5">
                        <div
                          className="relative flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium text-zinc-400 hover:bg-zinc-900 hover:text-white transition-colors cursor-pointer group"
                          onClick={() => inputRef.current?.showPicker()}
                        >
                          <span className="group-hover:translate-x-0.5 transition-transform">
                            Custom Date & Time...
                          </span>
                          <ChevronRight className="w-3 h-3 opacity-50 group-hover:opacity-100" />

                          <input
                            ref={inputRef}
                            type="datetime-local"
                            className="absolute bottom-0 right-0 w-1 h-1 opacity-0 z-0 pointer-events-none"
                            onChange={(e) => {
                              if (e.target.value) {
                                setScheduledDate(new Date(e.target.value));
                                setIsScheduleOpen(false);
                              }
                            }}
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: The Main Action */}
              <div className="flex items-center">
                <button
                  onClick={handleSubmit}
                  disabled={
                    isPending ||
                    !content.trim() ||
                    selectedPlatforms.length === 0
                  }
                  className={`
                    group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${
                      scheduledDate
                        ? "bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_20px_rgba(16,185,129,0.3)] cursor-pointer"
                        : "bg-white hover:bg-zinc-200 text-black shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                    }
                  `}
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : scheduledDate ? (
                    <>
                      <Calendar className="w-4 h-4" />
                      <span>Schedule</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Post Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Micro Components ---

function PlatformPill({
  icon,
  label,
  active,
  connected,
  onClick,
  activeColor,
}: any) {
  if (!connected) {
    return (
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-zinc-900/50 text-zinc-600 opacity-50 cursor-not-allowed"
        title="Not Connected"
      >
        {icon}
        <span className="text-xs font-medium">{label}</span>
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200
                ${
                  active
                    ? `${activeColor} shadow-md scale-105`
                    : "border-white/10 bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                }
            `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function ScheduleOption({ onClick, icon, label, sub }: any) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-zinc-800 group transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="bg-zinc-900 border border-zinc-800 p-1.5 rounded-md group-hover:border-zinc-700 transition-colors">
          {icon}
        </div>
        <div className="text-left">
          <p className="text-xs font-medium text-zinc-200 group-hover:text-white">
            {label}
          </p>
          <p className="text-[10px] text-zinc-500">{sub}</p>
        </div>
      </div>
    </button>
  );
}
