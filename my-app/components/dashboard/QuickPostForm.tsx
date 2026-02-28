// // // "use client";

// // // import React, { useState, useRef, useEffect, useCallback } from "react";
// // // import {
// // //   X,
// // //   Twitter,
// // //   Linkedin,
// // //   Calendar as CalendarIcon,
// // //   ChevronDown,
// // //   Image as ImageIcon,
// // //   Smile,
// // //   Loader2,
// // //   Clock,
// // //   Send,
// // //   Plus,
// // //   Lock,
// // //   AlertTriangle,
// // //   Zap,
// // //   // Instagram,
// // // } from "lucide-react";
// // // // Add this to your imports
// // // import { useUploadThing } from "@/lib/uploadthings";
// // // import {
// // //   format,
// // //   addMinutes,
// // //   addDays,
// // //   nextMonday,
// // //   isBefore,
// // //   isValid,
// // // } from "date-fns";
// // // import { scheduleTask } from "@/app/actions/task-actions";
// // // import Link from "next/link";

// // // // --- Configuration ---
// // // const TOP_EMOJIS = [
// // //   "😀",
// // //   "🔥",
// // //   "🚀",
// // //   "💡",
// // //   "✨",
// // //   "🎉",
// // //   "👍",
// // //   "❤️",
// // //   "😂",
// // //   "🤔",
// // //   "👀",
// // //   "📈",
// // //   "📅",
// // //   "✅",
// // //   "❌",
// // //   "👋",
// // //   "🙏",
// // //   "💯",
// // // ];

// // // interface QuickPostProps {
// // //   isXConnected: boolean;
// // //   isLinkedinConnected: boolean;
// // //   // isInstagramConnected: boolean;
// // //   userImage?: string | null;
// // //   usageCount: number;
// // //   isPro: boolean;
// // // }

// // // const getLocalISOString = (date: Date) => {
// // //   const offset = date.getTimezoneOffset() * 60000;
// // //   const localDate = new Date(date.getTime() - offset);
// // //   return localDate.toISOString().slice(0, 16);
// // // };

// // // export default function QuickPostForm({
// // //   isXConnected,
// // //   isLinkedinConnected,
// // //   // isInstagramConnected,
// // //   userImage,
// // //   usageCount,
// // //   isPro,
// // // }: QuickPostProps) {
// // //   // --- State ---
// // //   const [content, setContent] = useState("");
// // //   const [isPending, setIsPending] = useState(false);
// // //   const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

// // //   // Media
// // //   const [mediaFiles, setMediaFiles] = useState<File[]>([]);
// // //   const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
// // //   const [isDragging, setIsDragging] = useState(false);

// // //   // Scheduling
// // //   const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
// // //   const [isScheduleOpen, setIsScheduleOpen] = useState(false);
// // //   const [showEmojiPicker, setShowEmojiPicker] = useState(false);

// // //   // Validation
// // //   const [validationError, setValidationError] = useState<string | null>(null);
// // //   const [shake, setShake] = useState(false);

// // //   // --- Refs ---
// // //   const scheduleMenuRef = useRef<HTMLDivElement>(null);
// // //   const emojiMenuRef = useRef<HTMLDivElement>(null);
// // //   const textareaRef = useRef<HTMLTextAreaElement>(null);
// // //   const fileInputRef = useRef<HTMLInputElement>(null);
// // //   const dateInputRef = useRef<HTMLInputElement>(null);

// // //   // upload images
// // //   const { startUpload } = useUploadThing("imageUploader");

// // //   // --- Effects ---
// // //   useEffect(() => {
// // //     if (textareaRef.current) {
// // //       textareaRef.current.style.height = "auto";
// // //       textareaRef.current.style.height =
// // //         textareaRef.current.scrollHeight + "px";
// // //     }
// // //   }, [content]);

// // //   useEffect(() => {
// // //     function handleClickOutside(event: MouseEvent) {
// // //       if (
// // //         scheduleMenuRef.current &&
// // //         !scheduleMenuRef.current.contains(event.target as Node)
// // //       ) {
// // //         setIsScheduleOpen(false);
// // //       }
// // //       if (
// // //         emojiMenuRef.current &&
// // //         !emojiMenuRef.current.contains(event.target as Node)
// // //       ) {
// // //         setShowEmojiPicker(false);
// // //       }
// // //     }
// // //     document.addEventListener("mousedown", handleClickOutside);
// // //     return () => document.removeEventListener("mousedown", handleClickOutside);
// // //   }, []);

// // //   // --- Logic ---
// // //   const triggerError = (msg: string) => {
// // //     setValidationError(msg);
// // //     setShake(true);
// // //     setTimeout(() => setShake(false), 500);
// // //   };

// // //   const togglePlatform = (platform: string, isConnected: boolean) => {
// // //     if (!isConnected) return;
// // //     setSelectedPlatforms((prev) =>
// // //       prev.includes(platform)
// // //         ? prev.filter((p) => p !== platform)
// // //         : [...prev, platform],
// // //     );
// // //     setValidationError(null);
// // //   };

// // //   const insertEmoji = (emoji: string) => {
// // //     setContent((prev) => prev + emoji);
// // //     setShowEmojiPicker(false);
// // //     textareaRef.current?.focus();
// // //   };

// // //   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     if (e.target.files && e.target.files.length > 0) {
// // //       processFiles(Array.from(e.target.files));
// // //       e.target.value = "";
// // //     }
// // //   };

// // //   const processFiles = (files: File[]) => {
// // //     const images = files.filter((f) => f.type.startsWith("image/"));
// // //     if (images.length + mediaFiles.length > 4) {
// // //       triggerError("Maximum 4 images allowed");
// // //       return;
// // //     }
// // //     const newPreviews = images.map((file) => URL.createObjectURL(file));
// // //     setMediaFiles((prev) => [...prev, ...images]);
// // //     setMediaPreviews((prev) => [...prev, ...newPreviews]);
// // //     setValidationError(null);
// // //   };

// // //   const removeMedia = (index: number) => {
// // //     URL.revokeObjectURL(mediaPreviews[index]);
// // //     setMediaFiles((prev) => prev.filter((_, i) => i !== index));
// // //     setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
// // //   };

// // //   const onDragOver = useCallback((e: React.DragEvent) => {
// // //     e.preventDefault();
// // //     setIsDragging(true);
// // //   }, []);
// // //   const onDragLeave = useCallback((e: React.DragEvent) => {
// // //     e.preventDefault();
// // //     setIsDragging(false);
// // //   }, []);
// // //   const onDrop = useCallback(
// // //     (e: React.DragEvent) => {
// // //       e.preventDefault();
// // //       setIsDragging(false);
// // //       if (e.dataTransfer.files && e.dataTransfer.files.length > 0)
// // //         processFiles(Array.from(e.dataTransfer.files));
// // //     },
// // //     [mediaFiles],
// // //   );

// // //   const handleTimeAdd = (minutes: number) => {
// // //     setScheduledDate(addMinutes(new Date(), minutes));
// // //     setIsScheduleOpen(false);
// // //     setValidationError(null);
// // //   };

// // //   const handleDaySet = (type: "tomorrow" | "monday") => {
// // //     const now = new Date();
// // //     let date = now;
// // //     if (type === "tomorrow") {
// // //       date = addDays(now, 1);
// // //       date.setHours(9, 0, 0, 0);
// // //     }
// // //     if (type === "monday") {
// // //       date = nextMonday(now);
// // //       date.setHours(9, 0, 0, 0);
// // //     }
// // //     setScheduledDate(date);
// // //     setIsScheduleOpen(false);
// // //     setValidationError(null);
// // //   };

// // //   const openNativePicker = () => {
// // //     try {
// // //       const input = dateInputRef.current;
// // //       if (input) {
// // //         if (typeof (input as any).showPicker === "function") {
// // //           (input as any).showPicker();
// // //         } else {
// // //           input.click();
// // //         }
// // //       }
// // //     } catch (err) {
// // //       console.error("Picker error", err);
// // //     }
// // //   };

// // //   const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     if (!e.target.value) return;
// // //     const date = new Date(e.target.value);
// // //     if (isBefore(date, new Date())) {
// // //       triggerError("Cannot schedule in the past");
// // //       return;
// // //     }
// // //     setScheduledDate(date);
// // //     setValidationError(null);
// // //   };

// // //   const FREE_LIMIT = 10;
// // //   const isLimitReached = !isPro && usageCount >= FREE_LIMIT;

// // //   const handleSubmit = async () => {
// // //     if (!content.trim() && mediaFiles.length === 0) {
// // //       triggerError("Post cannot be empty");
// // //       textareaRef.current?.focus();
// // //       return;
// // //     }
// // //     // if (!isXConnected && !isLinkedinConnected && !isInstagramConnected) {
// // //     if (!isXConnected && !isLinkedinConnected) {
// // //       triggerError("Connect an account first");
// // //       return;
// // //     }
// // //     if (selectedPlatforms.length === 0) {
// // //       triggerError("Select a platform below");
// // //       return;
// // //     }

// // //     setIsPending(true);

// // //     try {
// // //       let uploadedUrls: string[] = [];
// // //       if (mediaFiles.length > 0) {
// // //         // This uploads to the cloud and returns an array of results containing URLs
// // //         const uploadRes = await startUpload(mediaFiles);

// // //         if (!uploadRes) {
// // //           throw new Error("Image upload failed");
// // //         }

// // //         uploadedUrls = uploadRes.map((res) => res.url);
// // //         // console.log("uploadedUrl:")
// // //       }

// // //       const formData = new FormData();
// // //       formData.append("content", content);
// // //       selectedPlatforms.forEach((p) => formData.append(p, "on"));

// // //       if (uploadedUrls.length > 0) {
// // //         // We can stringify the array to pass it easily in FormData
// // //         formData.append("mediaUrls", JSON.stringify(uploadedUrls));
// // //       }

// // //       let finalDate: Date = scheduledDate ? scheduledDate : new Date();
// // //       formData.set("scheduledAt", finalDate.toISOString());

// // //       await scheduleTask(formData);
// // //       await new Promise((r) => setTimeout(r, 800));
// // //       setContent("");
// // //       setSelectedPlatforms([]);
// // //       setMediaFiles([]);
// // //       setMediaPreviews([]);
// // //       setScheduledDate(null);
// // //       setValidationError(null);
// // //     } catch (error) {
// // //       console.error("Failed to post", error);
// // //       triggerError("Failed. Please try again.");
// // //     } finally {
// // //       setIsPending(false);
// // //     }
// // //   };

// // //   return (
// // //     <div
// // //       className={`
// // //         relative w-full bg-zinc-950 border transition-all duration-300 rounded-3xl overflow-visible shadow-xl shadow-black/20
// // //         ${isDragging ? "border-blue-500 bg-zinc-900/50" : "border-white/10 hover:border-white/20"}
// // //       `}
// // //       onDragOver={onDragOver}
// // //       onDragLeave={onDragLeave}
// // //       onDrop={onDrop}
// // //     >
// // //       {/* Drag Overlay */}
// // //       {isDragging && (
// // //         <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm rounded-3xl pointer-events-none">
// // //           <div className="text-blue-400 font-bold text-xl flex flex-col items-center animate-bounce">
// // //             <ImageIcon className="w-10 h-10 mb-2" />
// // //             Drop images here
// // //           </div>
// // //         </div>
// // //       )}

// // //       <div className="p-4 md:p-6">
// // //         <div className="flex gap-3 md:gap-4">
// // //           {/* Avatar - Hidden on very small screens to save space */}
// // //           <div className="flex-shrink-0 pt-1 hidden sm:block">
// // //             {userImage ? (
// // //               <img
// // //                 src={userImage}
// // //                 className="w-10 h-10 rounded-full border border-white/10 shadow-sm object-cover"
// // //                 alt="User"
// // //               />
// // //             ) : (
// // //               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
// // //                 ME
// // //               </div>
// // //             )}
// // //           </div>

// // //           <div className="flex-1 min-w-0">
// // //             {/* Input Area */}
// // //             <textarea
// // //               ref={textareaRef}
// // //               value={content}
// // //               onChange={(e) => {
// // //                 setContent(e.target.value);
// // //                 if (validationError) setValidationError(null);
// // //               }}
// // //               disabled={isPending}
// // //               placeholder="What's new?"
// // //               // text-base prevents iOS zoom on focus
// // //               className="w-full bg-transparent border-none text-base md:text-lg text-white placeholder:text-zinc-600 p-0 resize-none min-h-[80px] leading-relaxed focus:ring-0 scrollbar-hide outline-0"
// // //             />

// // //             {/* Media Previews */}
// // //             {mediaPreviews.length > 0 && (
// // //               <div className="flex flex-wrap gap-2 mt-3 animate-in fade-in slide-in-from-top-2">
// // //                 {mediaPreviews.map((src, idx) => (
// // //                   <div
// // //                     key={idx}
// // //                     className="relative group w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-white/10"
// // //                   >
// // //                     <img
// // //                       src={src}
// // //                       alt="Preview"
// // //                       className="w-full h-full object-cover"
// // //                     />
// // //                     <button
// // //                       onClick={() => removeMedia(idx)}
// // //                       className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-red-500"
// // //                     >
// // //                       <X className="w-3 h-3" />
// // //                     </button>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             )}

// // //             <div className="h-px w-full bg-white/5 my-4" />

// // //             {/* --- CONTROLS BAR (Responsive) --- */}
// // //             {/* Flex-col on mobile to stack rows, Flex-row on Desktop to align */}
// // //             <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
// // //               {/* TOP ROW (Mobile): Platforms & Tools */}
// // //               <div className="flex flex-col gap-3">
// // //                 {/* Platforms - Wrap on small screens */}
// // //                 <div className="flex items-center flex-wrap gap-2">
// // //                   <PlatformToggle
// // //                     icon={<Twitter className="w-3.5 h-3.5" />}
// // //                     label="X"
// // //                     isConnected={isXConnected}
// // //                     isActive={selectedPlatforms.includes("TWITTER")}
// // //                     onClick={() => togglePlatform("TWITTER", isXConnected)}
// // //                     activeColor="bg-white text-black border-white"
// // //                   />
// // //                   <PlatformToggle
// // //                     icon={<Linkedin className="w-3.5 h-3.5" />}
// // //                     label="LinkedIn"
// // //                     isConnected={isLinkedinConnected}
// // //                     isActive={selectedPlatforms.includes("LINKEDIN")}
// // //                     onClick={() =>
// // //                       togglePlatform("LINKEDIN", isLinkedinConnected)
// // //                     }
// // //                     activeColor="bg-[#0A66C2] text-white border-[#0A66C2]"
// // //                   />

// // //                   {/* <PlatformToggle
// // //                     icon={<Instagram className="w-3.5 h-3.5" />}
// // //                     label="Instagram"
// // //                     isConnected={isInstagramConnected}
// // //                     isActive={selectedPlatforms.includes("INSTAGRAM")}
// // //                     onClick={() =>
// // //                       togglePlatform("INSTAGRAM", isInstagramConnected)
// // //                     }
// // //                     activeColor="bg-[#0A66C2] text-white border-[#0A66C2]"
// // //                   /> */}

// // //                   {(!isXConnected || !isLinkedinConnected) && (
// // //                     <Link
// // //                       href="/dashboard/connections"
// // //                       className="ml-1 text-[10px] text-zinc-500 hover:text-blue-400 flex items-center gap-1 group whitespace-nowrap"
// // //                     >
// // //                       <Plus className="w-3 h-3" />
// // //                       <span className="underline decoration-zinc-700 underline-offset-2 group-hover:decoration-blue-400">
// // //                         Connect
// // //                       </span>
// // //                     </Link>
// // //                   )}
// // //                 </div>

// // //                 {/* Media & Emoji & Error */}
// // //                 <div className="flex items-center gap-2 relative">
// // //                   <input
// // //                     type="file"
// // //                     ref={fileInputRef}
// // //                     className="hidden"
// // //                     accept="image/*"
// // //                     multiple
// // //                     onChange={handleFileSelect}
// // //                   />
// // //                   <ToolButton
// // //                     icon={<ImageIcon className="w-4 h-4" />}
// // //                     label="Media"
// // //                     onClick={() => fileInputRef.current?.click()}
// // //                   />

// // //                   <div ref={emojiMenuRef} className="relative">
// // //                     <ToolButton
// // //                       icon={<Smile className="w-4 h-4" />}
// // //                       label="Emoji"
// // //                       onClick={() => setShowEmojiPicker(!showEmojiPicker)}
// // //                     />
// // //                     {showEmojiPicker && (
// // //                       <div className="absolute bottom-full left-0 mb-2 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-3 z-50 w-64 max-w-[90vw] ring-1 ring-white/10 animate-in fade-in zoom-in-95">
// // //                         <div className="grid grid-cols-6 gap-2">
// // //                           {TOP_EMOJIS.map((emoji) => (
// // //                             <button
// // //                               key={emoji}
// // //                               onClick={() => insertEmoji(emoji)}
// // //                               className="hover:bg-zinc-800 p-1.5 rounded-lg text-lg transition-colors"
// // //                             >
// // //                               {emoji}
// // //                             </button>
// // //                           ))}
// // //                         </div>
// // //                       </div>
// // //                     )}
// // //                   </div>

// // //                   {validationError && (
// // //                     <div
// // //                       className={`flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full animate-in fade-in slide-in-from-left-2 ${shake ? "animate-shake" : ""}`}
// // //                     >
// // //                       <AlertTriangle className="w-3 h-3 text-red-400" />
// // //                       <span className="text-xs text-red-300 font-medium truncate max-w-[150px]">
// // //                         {validationError}
// // //                       </span>
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               </div>

// // //               {/* BOTTOM ROW (Mobile): Schedule & Submit */}
// // //               <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
// // //                 {/* SCHEDULE DROPDOWN */}

// // //                 {/*  */}
// // //                 {isLimitReached ? (
// // //                   <Link
// // //                     href="/dashboard/settings"
// // //                     className="
// // //                       flex-1 sm:flex-none relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm
// // //                       bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:scale-[1.02] transition-transform
// // //                     "
// // //                   >
// // //                     <Lock className="w-3.5 h-3.5" />
// // //                     <span>Upgrade Plan</span>
// // //                   </Link>
// // //                 ) : (
// // //                   <>
// // //                     <div className="relative" ref={scheduleMenuRef}>
// // //                       {scheduledDate ? (
// // //                         // ACTIVE DATE
// // //                         <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-2 rounded-xl text-xs font-bold animate-in zoom-in cursor-default">
// // //                           <div className="flex flex-col leading-none">
// // //                             <span className="text-[9px] opacity-70 uppercase tracking-wider mb-0.5">
// // //                               Scheduled
// // //                             </span>
// // //                             <span className="whitespace-nowrap">
// // //                               {format(scheduledDate, "MMM d • h:mm a")}
// // //                             </span>
// // //                           </div>
// // //                           <button
// // //                             onClick={(e) => {
// // //                               e.stopPropagation();
// // //                               setScheduledDate(null);
// // //                             }}
// // //                             className="p-1 hover:bg-emerald-500/20 rounded-full transition-colors"
// // //                           >
// // //                             <X className="w-3 h-3" />
// // //                           </button>
// // //                         </div>
// // //                       ) : (
// // //                         // DEFAULT TRIGGER
// // //                         <button
// // //                           type="button"
// // //                           onClick={() => setIsScheduleOpen(!isScheduleOpen)}
// // //                           className={`
// // //                           flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap
// // //                           ${isScheduleOpen ? "bg-zinc-800 text-white border-zinc-700" : "bg-zinc-900/50 text-zinc-400 border-white/5 hover:bg-zinc-800 hover:text-white"}
// // //                         `}
// // //                         >
// // //                           <CalendarIcon className="w-4 h-4" />
// // //                           <span>Schedule</span>
// // //                           <ChevronDown
// // //                             className={`w-3 h-3 transition-transform ${isScheduleOpen ? "rotate-180" : ""}`}
// // //                           />
// // //                         </button>
// // //                       )}

// // //                       {/* POPOVER MENU */}
// // //                       {isScheduleOpen && (
// // //                         <div className="absolute bottom-full right-0 sm:right-0 left-0 sm:left-auto mb-2 w-full sm:w-72 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden ring-1 ring-white/10 animate-in fade-in zoom-in-95 origin-bottom-right">
// // //                           <div className="px-3 py-2 bg-zinc-900/50 border-b border-white/5 flex justify-between items-center">
// // //                             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
// // //                               Instant Schedule
// // //                             </span>
// // //                             <Zap className="w-3 h-3 text-zinc-600" />
// // //                           </div>

// // //                           <div className="p-2 space-y-2">
// // //                             <div className="grid grid-cols-3 gap-1">
// // //                               <QuickTimeBtn
// // //                                 label="+10m"
// // //                                 onClick={() => handleTimeAdd(10)}
// // //                               />
// // //                               <QuickTimeBtn
// // //                                 label="+30m"
// // //                                 onClick={() => handleTimeAdd(30)}
// // //                               />
// // //                               <QuickTimeBtn
// // //                                 label="+1h"
// // //                                 onClick={() => handleTimeAdd(60)}
// // //                               />
// // //                             </div>
// // //                             <div className="grid grid-cols-3 gap-1">
// // //                               <QuickTimeBtn
// // //                                 label="+3h"
// // //                                 onClick={() => handleTimeAdd(180)}
// // //                               />
// // //                               <QuickTimeBtn
// // //                                 label="+6h"
// // //                                 onClick={() => handleTimeAdd(360)}
// // //                               />
// // //                               <QuickTimeBtn
// // //                                 label="Tmrw 9am"
// // //                                 onClick={() => handleDaySet("tomorrow")}
// // //                               />
// // //                             </div>
// // //                           </div>

// // //                           <div className="h-px bg-white/5 mx-2" />

// // //                           <div className="p-2 relative">
// // //                             <div
// // //                               onClick={openNativePicker}
// // //                               className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-zinc-900 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer group border border-white/5"
// // //                             >
// // //                               <span>
// // //                                 {scheduledDate && isValid(scheduledDate)
// // //                                   ? format(scheduledDate, "MMM d, h:mm a")
// // //                                   : "Custom Date & Time..."}
// // //                               </span>
// // //                               <Plus className="w-3 h-3 opacity-50" />
// // //                             </div>
// // //                             <input
// // //                               type="datetime-local"
// // //                               ref={dateInputRef}
// // //                               min={getLocalISOString(new Date())}
// // //                               className="absolute bottom-0 left-0 w-full h-full opacity-0 z-[-1]"
// // //                               onChange={handleCustomDateChange}
// // //                             />
// // //                           </div>
// // //                         </div>
// // //                       )}
// // //                     </div>

// // //                     {/* SUBMIT BUTTON */}
// // //                     <button
// // //                       onClick={handleSubmit}
// // //                       disabled={isPending}
// // //                       className={`
// // //                     flex-1 sm:flex-none relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg whitespace-nowrap
// // //                     ${isPending ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-white text-black hover:bg-zinc-200 hover:scale-[1.02] shadow-white/10"}
// // //                   `}
// // //                     >
// // //                       {isPending ? (
// // //                         <Loader2 className="w-4 h-4 animate-spin" />
// // //                       ) : (
// // //                         <>
// // //                           {scheduledDate ? "Schedule" : "Post Now"}
// // //                           {scheduledDate ? (
// // //                             <Clock className="w-3.5 h-3.5" />
// // //                           ) : (
// // //                             <Send className="w-3.5 h-3.5" />
// // //                           )}
// // //                         </>
// // //                       )}
// // //                     </button>
// // //                   </>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //       <style jsx global>{`
// // //         @keyframes shake {
// // //           0%,
// // //           100% {
// // //             transform: translateX(0);
// // //           }
// // //           25% {
// // //             transform: translateX(-4px);
// // //           }
// // //           75% {
// // //             transform: translateX(4px);
// // //           }
// // //         }
// // //         .animate-shake {
// // //           animation: shake 0.4s ease-in-out;
// // //         }
// // //       `}</style>
// // //     </div>
// // //   );
// // // }

// // // // --- Sub Components ---
// // // function ToolButton({
// // //   icon,
// // //   label,
// // //   onClick,
// // // }: {
// // //   icon: any;
// // //   label: string;
// // //   onClick: () => void;
// // // }) {
// // //   return (
// // //     <button
// // //       onClick={onClick}
// // //       className="flex items-center gap-1.5 p-2 rounded-lg text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
// // //       title={label}
// // //     >
// // //       {icon}
// // //     </button>
// // //   );
// // // }

// // // function QuickTimeBtn({
// // //   label,
// // //   onClick,
// // // }: {
// // //   label: string;
// // //   onClick: () => void;
// // // }) {
// // //   return (
// // //     <button
// // //       onClick={onClick}
// // //       className="px-2 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-medium rounded-lg border border-white/5 transition-all active:scale-95"
// // //     >
// // //       {label}
// // //     </button>
// // //   );
// // // }

// // // function PlatformToggle({
// // //   icon,
// // //   label,
// // //   isConnected,
// // //   isActive,
// // //   onClick,
// // //   activeColor,
// // // }: any) {
// // //   if (!isConnected) {
// // //     return (
// // //       <div className="relative group">
// // //         <button
// // //           disabled
// // //           className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-zinc-900/30 opacity-40 grayscale cursor-not-allowed"
// // //         >
// // //           {icon}
// // //           <span className="text-[10px] font-bold">{label}</span>
// // //           <Lock className="w-3 h-3 ml-1 opacity-50" />
// // //         </button>
// // //       </div>
// // //     );
// // //   }
// // //   return (
// // //     <button
// // //       onClick={onClick}
// // //       className={`
// // //         flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all duration-200
// // //         ${isActive ? `${activeColor} shadow-md` : "border-white/10 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white"}
// // //       `}
// // //     >
// // //       {icon}
// // //       <span>{label}</span>
// // //     </button>
// // //   );
// // // }

// // "use client";

// // import React, { useState, useRef, useEffect, useCallback } from "react";
// // import {
// //   X,
// //   Twitter,
// //   Linkedin,
// //   Calendar as CalendarIcon,
// //   ChevronDown,
// //   Image as ImageIcon,
// //   Smile,
// //   Loader2,
// //   Clock,
// //   Send,
// //   Plus,
// //   Lock,
// //   AlertTriangle,
// //   Zap,
// //   Sparkles, // Added for AI button
// //   // Instagram,
// // } from "lucide-react";
// // // Add this to your imports
// // import { useUploadThing } from "@/lib/uploadthings";
// // import {
// //   format,
// //   addMinutes,
// //   addDays,
// //   nextMonday,
// //   isBefore,
// //   isValid,
// // } from "date-fns";
// // import { scheduleTask } from "@/app/actions/task-actions";
// // import Link from "next/link";
// // import { generatePostContent } from "@/app/actions/ai-actions";

// // // --- Configuration ---
// // const TOP_EMOJIS = [
// //   "😀",
// //   "🔥",
// //   "🚀",
// //   "💡",
// //   "✨",
// //   "🎉",
// //   "👍",
// //   "❤️",
// //   "😂",
// //   "🤔",
// //   "👀",
// //   "📈",
// //   "📅",
// //   "✅",
// //   "❌",
// //   "👋",
// //   "🙏",
// //   "💯",
// // ];

// // interface QuickPostProps {
// //   isXConnected: boolean;
// //   isLinkedinConnected: boolean;
// //   // isInstagramConnected: boolean;
// //   userImage?: string | null;
// //   usageCount: number;
// //   isPro: boolean;
// // }

// // const getLocalISOString = (date: Date) => {
// //   const offset = date.getTimezoneOffset() * 60000;
// //   const localDate = new Date(date.getTime() - offset);
// //   return localDate.toISOString().slice(0, 16);
// // };

// // export default function QuickPostForm({
// //   isXConnected,
// //   isLinkedinConnected,
// //   // isInstagramConnected,
// //   userImage,
// //   usageCount,
// //   isPro,
// // }: QuickPostProps) {
// //   // --- State ---
// //   const [content, setContent] = useState("");
// //   const [isPending, setIsPending] = useState(false);
// //   const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

// //   // Media
// //   const [mediaFiles, setMediaFiles] = useState<File[]>([]);
// //   const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
// //   const [isDragging, setIsDragging] = useState(false);

// //   // Scheduling
// //   const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
// //   const [isScheduleOpen, setIsScheduleOpen] = useState(false);
// //   const [showEmojiPicker, setShowEmojiPicker] = useState(false);

// //   const [isGeneratingAI, setIsGeneratingAI] = useState(false); // New AI Loading State

// //   // Validation
// //   const [validationError, setValidationError] = useState<string | null>(null);
// //   const [shake, setShake] = useState(false);

// //   // --- Refs ---
// //   const scheduleMenuRef = useRef<HTMLDivElement>(null);
// //   const emojiMenuRef = useRef<HTMLDivElement>(null);
// //   const textareaRef = useRef<HTMLTextAreaElement>(null);
// //   const fileInputRef = useRef<HTMLInputElement>(null);
// //   const dateInputRef = useRef<HTMLInputElement>(null);

// //   // upload images
// //   const { startUpload } = useUploadThing("imageUploader");

// //   // --- Effects ---
// //   useEffect(() => {
// //     if (textareaRef.current) {
// //       textareaRef.current.style.height = "auto";
// //       textareaRef.current.style.height =
// //         textareaRef.current.scrollHeight + "px";
// //     }
// //   }, [content]);

// //   useEffect(() => {
// //     function handleClickOutside(event: MouseEvent) {
// //       if (
// //         scheduleMenuRef.current &&
// //         !scheduleMenuRef.current.contains(event.target as Node)
// //       ) {
// //         setIsScheduleOpen(false);
// //       }
// //       if (
// //         emojiMenuRef.current &&
// //         !emojiMenuRef.current.contains(event.target as Node)
// //       ) {
// //         setShowEmojiPicker(false);
// //       }
// //     }
// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => document.removeEventListener("mousedown", handleClickOutside);
// //   }, []);

// //   // --- Logic ---
// //   const triggerError = (msg: string) => {
// //     setValidationError(msg);
// //     setShake(true);
// //     setTimeout(() => setShake(false), 500);
// //   };

// //   const togglePlatform = (platform: string, isConnected: boolean) => {
// //     if (!isConnected) return;
// //     setSelectedPlatforms((prev) =>
// //       prev.includes(platform)
// //         ? prev.filter((p) => p !== platform)
// //         : [...prev, platform],
// //     );
// //     setValidationError(null);
// //   };

// //   const insertEmoji = (emoji: string) => {
// //     setContent((prev) => prev + emoji);
// //     setShowEmojiPicker(false);
// //     textareaRef.current?.focus();
// //   };

// //   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (e.target.files && e.target.files.length > 0) {
// //       processFiles(Array.from(e.target.files));
// //       e.target.value = "";
// //     }
// //   };

// //   const processFiles = (files: File[]) => {
// //     const images = files.filter((f) => f.type.startsWith("image/"));
// //     if (images.length + mediaFiles.length > 4) {
// //       triggerError("Maximum 4 images allowed");
// //       return;
// //     }
// //     const newPreviews = images.map((file) => URL.createObjectURL(file));
// //     setMediaFiles((prev) => [...prev, ...images]);
// //     setMediaPreviews((prev) => [...prev, ...newPreviews]);
// //     setValidationError(null);
// //   };

// //   const removeMedia = (index: number) => {
// //     URL.revokeObjectURL(mediaPreviews[index]);
// //     setMediaFiles((prev) => prev.filter((_, i) => i !== index));
// //     setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
// //   };

// //   const onDragOver = useCallback((e: React.DragEvent) => {
// //     e.preventDefault();
// //     setIsDragging(true);
// //   }, []);
// //   const onDragLeave = useCallback((e: React.DragEvent) => {
// //     e.preventDefault();
// //     setIsDragging(false);
// //   }, []);
// //   const onDrop = useCallback(
// //     (e: React.DragEvent) => {
// //       e.preventDefault();
// //       setIsDragging(false);
// //       if (e.dataTransfer.files && e.dataTransfer.files.length > 0)
// //         processFiles(Array.from(e.dataTransfer.files));
// //     },
// //     [mediaFiles],
// //   );

// //   const handleTimeAdd = (minutes: number) => {
// //     setScheduledDate(addMinutes(new Date(), minutes));
// //     setIsScheduleOpen(false);
// //     setValidationError(null);
// //   };

// //   const handleDaySet = (type: "tomorrow" | "monday") => {
// //     const now = new Date();
// //     let date = now;
// //     if (type === "tomorrow") {
// //       date = addDays(now, 1);
// //       date.setHours(9, 0, 0, 0);
// //     }
// //     if (type === "monday") {
// //       date = nextMonday(now);
// //       date.setHours(9, 0, 0, 0);
// //     }
// //     setScheduledDate(date);
// //     setIsScheduleOpen(false);
// //     setValidationError(null);
// //   };

// //   const openNativePicker = () => {
// //     try {
// //       const input = dateInputRef.current;
// //       if (input) {
// //         if (typeof (input as any).showPicker === "function") {
// //           (input as any).showPicker();
// //         } else {
// //           input.click();
// //         }
// //       }
// //     } catch (err) {
// //       console.error("Picker error", err);
// //     }
// //   };

// //   const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //     if (!e.target.value) return;
// //     const date = new Date(e.target.value);
// //     if (isBefore(date, new Date())) {
// //       triggerError("Cannot schedule in the past");
// //       return;
// //     }
// //     setScheduledDate(date);
// //     setValidationError(null);
// //   };

// //   const FREE_LIMIT = 10;
// //   const isLimitReached = !isPro && usageCount >= FREE_LIMIT;

// //   // --- Derived State for UI ---
// //   const charCount = content.length;
// //   const isXSelected = selectedPlatforms.includes("TWITTER");
// //   // Limit is red if X is selected and content exceeds 280
// //   const isXLimitExceeded = isXSelected && charCount > 280;

// //   const handleSubmit = async () => {
// //     if (!content.trim() && mediaFiles.length === 0) {
// //       triggerError("Post cannot be empty");
// //       textareaRef.current?.focus();
// //       return;
// //     }
// //     // if (!isXConnected && !isLinkedinConnected && !isInstagramConnected) {
// //     if (!isXConnected && !isLinkedinConnected) {
// //       triggerError("Connect an account first");
// //       return;
// //     }
// //     if (selectedPlatforms.length === 0) {
// //       triggerError("Select a platform below");
// //       return;
// //     }

// //     // --- Constraints Validation ---

// //     // X (Twitter) Validation
// //     if (selectedPlatforms.includes("TWITTER")) {
// //       if (content.length > 280) {
// //         triggerError("X content exceeds 280 characters");
// //         return;
// //       }
// //       if (mediaFiles.length > 0) {
// //         triggerError("Media not allowed when X is selected");
// //         return;
// //       }
// //     }

// //     // LinkedIn Validation
// //     if (selectedPlatforms.includes("LINKEDIN")) {
// //       const MAX_SIZE = 5 * 1024 * 1024; // 5MB
// //       const hasLargeFile = mediaFiles.some((file) => file.size > MAX_SIZE);
// //       if (hasLargeFile) {
// //         triggerError("LinkedIn media must be < 5MB");
// //         return;
// //       }
// //     }

// //     setIsPending(true);

// //     try {
// //       let uploadedUrls: string[] = [];
// //       if (mediaFiles.length > 0) {
// //         // This uploads to the cloud and returns an array of results containing URLs
// //         const uploadRes = await startUpload(mediaFiles);

// //         if (!uploadRes) {
// //           throw new Error("Image upload failed");
// //         }

// //         uploadedUrls = uploadRes.map((res) => res.url);
// //         // console.log("uploadedUrl:")
// //       }

// //       const formData = new FormData();
// //       formData.append("content", content);
// //       selectedPlatforms.forEach((p) => formData.append(p, "on"));

// //       if (uploadedUrls.length > 0) {
// //         // We can stringify the array to pass it easily in FormData
// //         formData.append("mediaUrls", JSON.stringify(uploadedUrls));
// //       }

// //       let finalDate: Date = scheduledDate ? scheduledDate : new Date();
// //       formData.set("scheduledAt", finalDate.toISOString());

// //       await scheduleTask(formData);
// //       await new Promise((r) => setTimeout(r, 800));
// //       setContent("");
// //       setSelectedPlatforms([]);
// //       setMediaFiles([]);
// //       setMediaPreviews([]);
// //       setScheduledDate(null);
// //       setValidationError(null);
// //     } catch (error) {
// //       console.error("Failed to post", error);
// //       triggerError("Failed. Please try again.");
// //     } finally {
// //       setIsPending(false);
// //     }
// //   };

// //   const handleAIGenerate = async () => {
// //     if (!content.trim()) {
// //       triggerError("Write a draft first");
// //       textareaRef.current?.focus();
// //       return;
// //     }

// //     setIsGeneratingAI(true);
// //     setValidationError(null);

// //     try {
// //       // Determine Platform priority
// //       // If X is selected (even if LinkedIn is too), we prioritize X constraints (280 chars)
// //       // otherwise we use LinkedIn constraints, or General if nothing selected.
// //       let platform: "TWITTER" | "LINKEDIN" | "GENERAL" = "GENERAL";
// //       if (selectedPlatforms.includes("TWITTER")) {
// //         platform = "TWITTER";
// //       } else if (selectedPlatforms.includes("LINKEDIN")) {
// //         platform = "LINKEDIN";
// //       }

// //       const improvedContent = await generatePostContent(content, platform);

// //       if (improvedContent) {
// //         setContent(improvedContent);
// //       }
// //     } catch (error) {
// //       console.error(error);
// //       triggerError("AI generation failed");
// //     } finally {
// //       setIsGeneratingAI(false);
// //     }
// //   };

// //   return (
// //     <div
// //       className={`
// //         relative w-full bg-zinc-950 border transition-all duration-300 rounded-3xl overflow-visible shadow-xl shadow-black/20
// //         ${isDragging ? "border-blue-500 bg-zinc-900/50" : "border-white/10 hover:border-white/20"}
// //       `}
// //       onDragOver={onDragOver}
// //       onDragLeave={onDragLeave}
// //       onDrop={onDrop}
// //     >
// //       {/* Drag Overlay */}
// //       {isDragging && (
// //         <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm rounded-3xl pointer-events-none">
// //           <div className="text-blue-400 font-bold text-xl flex flex-col items-center animate-bounce">
// //             <ImageIcon className="w-10 h-10 mb-2" />
// //             Drop images here
// //           </div>
// //         </div>
// //       )}

// //       <div className="p-4 md:p-6">
// //         <div className="flex gap-3 md:gap-4">
// //           {/* Avatar - Hidden on very small screens to save space */}
// //           <div className="flex-shrink-0 pt-1 hidden sm:block">
// //             {userImage ? (
// //               <img
// //                 src={userImage}
// //                 className="w-10 h-10 rounded-full border border-white/10 shadow-sm object-cover"
// //                 alt="User"
// //               />
// //             ) : (
// //               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
// //                 ME
// //               </div>
// //             )}
// //           </div>

// //           <div className="flex-1 min-w-0">
// //             {/* Input Area */}
// //             <textarea
// //               ref={textareaRef}
// //               value={content}
// //               onChange={(e) => {
// //                 setContent(e.target.value);
// //                 if (validationError) setValidationError(null);
// //               }}
// //               disabled={isPending}
// //               placeholder="What's new?"
// //               // text-base prevents iOS zoom on focus
// //               className="w-full bg-transparent border-none text-base md:text-lg text-white placeholder:text-zinc-600 p-0 resize-none min-h-[80px] leading-relaxed focus:ring-0 scrollbar-hide outline-0"
// //             />

// //             {/* Content Length Indicator */}
// //             <div className="flex justify-end mt-1 px-1">
// //               <span
// //                 className={`text-[10px] font-bold transition-colors ${
// //                   isXLimitExceeded ? "text-red-500" : "text-zinc-600"
// //                 }`}
// //               >
// //                 {charCount}
// //                 {isXSelected && <span className="opacity-50"> / 280</span>}
// //               </span>
// //             </div>

// //             {/* Media Previews */}
// //             {mediaPreviews.length > 0 && (
// //               <div className="flex flex-wrap gap-2 mt-3 animate-in fade-in slide-in-from-top-2">
// //                 {mediaPreviews.map((src, idx) => (
// //                   <div
// //                     key={idx}
// //                     className="relative group w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-white/10"
// //                   >
// //                     <img
// //                       src={src}
// //                       alt="Preview"
// //                       className="w-full h-full object-cover"
// //                     />
// //                     <button
// //                       onClick={() => removeMedia(idx)}
// //                       className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-red-500"
// //                     >
// //                       <X className="w-3 h-3" />
// //                     </button>
// //                   </div>
// //                 ))}
// //               </div>
// //             )}

// //             <div className="h-px w-full bg-white/5 my-4" />

// //             {/* --- CONTROLS BAR (Responsive) --- */}
// //             {/* Flex-col on mobile to stack rows, Flex-row on Desktop to align */}
// //             <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
// //               {/* TOP ROW (Mobile): Platforms & Tools */}
// //               <div className="flex flex-col gap-3">
// //                 {/* Platforms - Wrap on small screens */}
// //                 <div className="flex items-center flex-wrap gap-2">
// //                   <PlatformToggle
// //                     icon={<Twitter className="w-3.5 h-3.5" />}
// //                     label="X"
// //                     isConnected={isXConnected}
// //                     isActive={selectedPlatforms.includes("TWITTER")}
// //                     onClick={() => togglePlatform("TWITTER", isXConnected)}
// //                     activeColor="bg-white text-black border-white"
// //                   />
// //                   <PlatformToggle
// //                     icon={<Linkedin className="w-3.5 h-3.5" />}
// //                     label="LinkedIn"
// //                     isConnected={isLinkedinConnected}
// //                     isActive={selectedPlatforms.includes("LINKEDIN")}
// //                     onClick={() =>
// //                       togglePlatform("LINKEDIN", isLinkedinConnected)
// //                     }
// //                     activeColor="bg-[#0A66C2] text-white border-[#0A66C2]"
// //                   />

// //                   {/* <PlatformToggle
// //                     icon={<Instagram className="w-3.5 h-3.5" />}
// //                     label="Instagram"
// //                     isConnected={isInstagramConnected}
// //                     isActive={selectedPlatforms.includes("INSTAGRAM")}
// //                     onClick={() =>
// //                       togglePlatform("INSTAGRAM", isInstagramConnected)
// //                     }
// //                     activeColor="bg-[#0A66C2] text-white border-[#0A66C2]"
// //                   /> */}

// //                   {(!isXConnected || !isLinkedinConnected) && (
// //                     <Link
// //                       href="/dashboard/connections"
// //                       className="ml-1 text-[10px] text-zinc-500 hover:text-blue-400 flex items-center gap-1 group whitespace-nowrap"
// //                     >
// //                       <Plus className="w-3 h-3" />
// //                       <span className="underline decoration-zinc-700 underline-offset-2 group-hover:decoration-blue-400">
// //                         Connect
// //                       </span>
// //                     </Link>
// //                   )}
// //                 </div>

// //                 {/* Media & Emoji & Error */}
// //                 <div className="flex items-center gap-2 relative">
// //                   <input
// //                     type="file"
// //                     ref={fileInputRef}
// //                     className="hidden"
// //                     accept="image/*"
// //                     multiple
// //                     onChange={handleFileSelect}
// //                   />
// //                   <ToolButton
// //                     icon={<ImageIcon className="w-4 h-4" />}
// //                     label="Media"
// //                     onClick={() => fileInputRef.current?.click()}
// //                   />

// //                   <div ref={emojiMenuRef} className="relative">
// //                     <ToolButton
// //                       icon={<Smile className="w-4 h-4" />}
// //                       label="Emoji"
// //                       onClick={() => setShowEmojiPicker(!showEmojiPicker)}
// //                     />
// //                     {showEmojiPicker && (
// //                       <div className="absolute bottom-full left-0 mb-2 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-3 z-50 w-64 max-w-[90vw] ring-1 ring-white/10 animate-in fade-in zoom-in-95">
// //                         <div className="grid grid-cols-6 gap-2">
// //                           {TOP_EMOJIS.map((emoji) => (
// //                             <button
// //                               key={emoji}
// //                               onClick={() => insertEmoji(emoji)}
// //                               className="hover:bg-zinc-800 p-1.5 rounded-lg text-lg transition-colors"
// //                             >
// //                               {emoji}
// //                             </button>
// //                           ))}
// //                         </div>
// //                       </div>
// //                     )}
// //                   </div>

// //                   {/* AI Button - Placeholder */}
// //                   {/* <ToolButton
// //                     icon={<Sparkles className="w-4 h-4" />}
// //                     label="AI Generate"
// //                     onClick={() => {}}
// //                   /> */}
// //                   <button
// //                     onClick={handleAIGenerate}
// //                     disabled={isGeneratingAI || !content.trim()}
// //                     className={`
// //                       flex items-center gap-1.5 p-2 rounded-lg transition-colors
// //                       ${
// //                         isGeneratingAI
// //                           ? "text-purple-400 bg-purple-500/10 cursor-not-allowed"
// //                           : "text-zinc-400 hover:text-purple-400 hover:bg-purple-400/10"
// //                       }
// //                     `}
// //                     title="AI Generate"
// //                   >
// //                     {isGeneratingAI ? (
// //                       <Loader2 className="w-4 h-4 animate-spin" />
// //                     ) : (
// //                       <Sparkles className="w-4 h-4" />
// //                     )}
// //                   </button>

// //                   {validationError && (
// //                     <div
// //                       className={`flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full animate-in fade-in slide-in-from-left-2 ${shake ? "animate-shake" : ""}`}
// //                     >
// //                       <AlertTriangle className="w-3 h-3 text-red-400" />
// //                       <span className="text-xs text-red-300 font-medium truncate max-w-[150px]">
// //                         {validationError}
// //                       </span>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>

// //               {/* BOTTOM ROW (Mobile): Schedule & Submit */}
// //               <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
// //                 {/* SCHEDULE DROPDOWN */}

// //                 {/*  */}
// //                 {isLimitReached ? (
// //                   <Link
// //                     href="/dashboard/settings"
// //                     className="
// //                       flex-1 sm:flex-none relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm
// //                       bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:scale-[1.02] transition-transform
// //                     "
// //                   >
// //                     <Lock className="w-3.5 h-3.5" />
// //                     <span>Upgrade Plan</span>
// //                   </Link>
// //                 ) : (
// //                   <>
// //                     <div className="relative" ref={scheduleMenuRef}>
// //                       {scheduledDate ? (
// //                         // ACTIVE DATE
// //                         <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-2 rounded-xl text-xs font-bold animate-in zoom-in cursor-default">
// //                           <div className="flex flex-col leading-none">
// //                             <span className="text-[9px] opacity-70 uppercase tracking-wider mb-0.5">
// //                               Scheduled
// //                             </span>
// //                             <span className="whitespace-nowrap">
// //                               {format(scheduledDate, "MMM d • h:mm a")}
// //                             </span>
// //                           </div>
// //                           <button
// //                             onClick={(e) => {
// //                               e.stopPropagation();
// //                               setScheduledDate(null);
// //                             }}
// //                             className="p-1 hover:bg-emerald-500/20 rounded-full transition-colors"
// //                           >
// //                             <X className="w-3 h-3" />
// //                           </button>
// //                         </div>
// //                       ) : (
// //                         // DEFAULT TRIGGER
// //                         <button
// //                           type="button"
// //                           onClick={() => setIsScheduleOpen(!isScheduleOpen)}
// //                           className={`
// //                           flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap
// //                           ${isScheduleOpen ? "bg-zinc-800 text-white border-zinc-700" : "bg-zinc-900/50 text-zinc-400 border-white/5 hover:bg-zinc-800 hover:text-white"}
// //                         `}
// //                         >
// //                           <CalendarIcon className="w-4 h-4" />
// //                           <span>Schedule</span>
// //                           <ChevronDown
// //                             className={`w-3 h-3 transition-transform ${isScheduleOpen ? "rotate-180" : ""}`}
// //                           />
// //                         </button>
// //                       )}

// //                       {/* POPOVER MENU */}
// //                       {isScheduleOpen && (
// //                         <div className="absolute bottom-full right-0 sm:right-0 left-0 sm:left-auto mb-2 w-full sm:w-72 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden ring-1 ring-white/10 animate-in fade-in zoom-in-95 origin-bottom-right">
// //                           <div className="px-3 py-2 bg-zinc-900/50 border-b border-white/5 flex justify-between items-center">
// //                             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
// //                               Instant Schedule
// //                             </span>
// //                             <Zap className="w-3 h-3 text-zinc-600" />
// //                           </div>

// //                           <div className="p-2 space-y-2">
// //                             <div className="grid grid-cols-3 gap-1">
// //                               <QuickTimeBtn
// //                                 label="+10m"
// //                                 onClick={() => handleTimeAdd(10)}
// //                               />
// //                               <QuickTimeBtn
// //                                 label="+30m"
// //                                 onClick={() => handleTimeAdd(30)}
// //                               />
// //                               <QuickTimeBtn
// //                                 label="+1h"
// //                                 onClick={() => handleTimeAdd(60)}
// //                               />
// //                             </div>
// //                             <div className="grid grid-cols-3 gap-1">
// //                               <QuickTimeBtn
// //                                 label="+3h"
// //                                 onClick={() => handleTimeAdd(180)}
// //                               />
// //                               <QuickTimeBtn
// //                                 label="+6h"
// //                                 onClick={() => handleTimeAdd(360)}
// //                               />
// //                               <QuickTimeBtn
// //                                 label="Tmrw 9am"
// //                                 onClick={() => handleDaySet("tomorrow")}
// //                               />
// //                             </div>
// //                           </div>

// //                           <div className="h-px bg-white/5 mx-2" />

// //                           <div className="p-2 relative">
// //                             <div
// //                               onClick={openNativePicker}
// //                               className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-zinc-900 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer group border border-white/5"
// //                             >
// //                               <span>
// //                                 {scheduledDate && isValid(scheduledDate)
// //                                   ? format(scheduledDate, "MMM d, h:mm a")
// //                                   : "Custom Date & Time..."}
// //                               </span>
// //                               <Plus className="w-3 h-3 opacity-50" />
// //                             </div>
// //                             <input
// //                               type="datetime-local"
// //                               ref={dateInputRef}
// //                               min={getLocalISOString(new Date())}
// //                               className="absolute bottom-0 left-0 w-full h-full opacity-0 z-[-1]"
// //                               onChange={handleCustomDateChange}
// //                             />
// //                           </div>
// //                         </div>
// //                       )}
// //                     </div>

// //                     {/* SUBMIT BUTTON */}
// //                     <button
// //                       onClick={handleSubmit}
// //                       disabled={isPending}
// //                       className={`
// //                     flex-1 sm:flex-none relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg whitespace-nowrap
// //                     ${isPending ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-white text-black hover:bg-zinc-200 hover:scale-[1.02] shadow-white/10"}
// //                   `}
// //                     >
// //                       {isPending ? (
// //                         <Loader2 className="w-4 h-4 animate-spin" />
// //                       ) : (
// //                         <>
// //                           {scheduledDate ? "Schedule" : "Post Now"}
// //                           {scheduledDate ? (
// //                             <Clock className="w-3.5 h-3.5" />
// //                           ) : (
// //                             <Send className="w-3.5 h-3.5" />
// //                           )}
// //                         </>
// //                       )}
// //                     </button>
// //                   </>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //       <style jsx global>{`
// //         @keyframes shake {
// //           0%,
// //           100% {
// //             transform: translateX(0);
// //           }
// //           25% {
// //             transform: translateX(-4px);
// //           }
// //           75% {
// //             transform: translateX(4px);
// //           }
// //         }
// //         .animate-shake {
// //           animation: shake 0.4s ease-in-out;
// //         }
// //       `}</style>
// //     </div>
// //   );
// // }

// // // --- Sub Components ---
// // function ToolButton({
// //   icon,
// //   label,
// //   onClick,
// // }: {
// //   icon: any;
// //   label: string;
// //   onClick: () => void;
// // }) {
// //   return (
// //     <button
// //       onClick={onClick}
// //       className="flex items-center gap-1.5 p-2 rounded-lg text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
// //       title={label}
// //     >
// //       {icon}
// //     </button>
// //   );
// // }

// // function QuickTimeBtn({
// //   label,
// //   onClick,
// // }: {
// //   label: string;
// //   onClick: () => void;
// // }) {
// //   return (
// //     <button
// //       onClick={onClick}
// //       className="px-2 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-medium rounded-lg border border-white/5 transition-all active:scale-95"
// //     >
// //       {label}
// //     </button>
// //   );
// // }

// // function PlatformToggle({
// //   icon,
// //   label,
// //   isConnected,
// //   isActive,
// //   onClick,
// //   activeColor,
// // }: any) {
// //   if (!isConnected) {
// //     return (
// //       <div className="relative group">
// //         <button
// //           disabled
// //           className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-zinc-900/30 opacity-40 grayscale cursor-not-allowed"
// //         >
// //           {icon}
// //           <span className="text-[10px] font-bold">{label}</span>
// //           <Lock className="w-3 h-3 ml-1 opacity-50" />
// //         </button>
// //       </div>
// //     );
// //   }
// //   return (
// //     <button
// //       onClick={onClick}
// //       className={`
// //         flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all duration-200
// //         ${isActive ? `${activeColor} shadow-md` : "border-white/10 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white"}
// //       `}
// //     >
// //       {icon}
// //       <span>{label}</span>
// //     </button>
// //   );
// // }

// "use client";

// import React, { useState, useRef, useEffect, useCallback } from "react";
// import {
//   X,
//   Twitter,
//   Linkedin,
//   Calendar as CalendarIcon,
//   ChevronDown,
//   Image as ImageIcon,
//   Smile,
//   Loader2,
//   Clock,
//   Send,
//   Plus,
//   Lock,
//   AlertTriangle,
//   Zap,
//   Sparkles,
// } from "lucide-react";
// import { useUploadThing } from "@/lib/uploadthings";
// import {
//   format,
//   addMinutes,
//   addDays,
//   nextMonday,
//   isBefore,
//   isValid,
// } from "date-fns";
// import { scheduleTask } from "@/app/actions/task-actions";
// import { generatePostContent } from "@/app/actions/ai-actions";
// import Link from "next/link";

// // --- Configuration ---
// const TOP_EMOJIS = [
//   "😀", "🔥", "🚀", "💡", "✨", "🎉", "👍", "❤️", "😂",
//   "🤔", "👀", "📈", "📅", "✅", "❌", "👋", "🙏", "💯",
// ];

// interface QuickPostProps {
//   isXConnected: boolean;
//   isLinkedinConnected: boolean;
//   userImage?: string | null;
//   usageCount: number;
//   isPro: boolean;
// }

// const getLocalISOString = (date: Date) => {
//   const offset = date.getTimezoneOffset() * 60000;
//   const localDate = new Date(date.getTime() - offset);
//   return localDate.toISOString().slice(0, 16);
// };

// export default function QuickPostForm({
//   isXConnected,
//   isLinkedinConnected,
//   userImage,
//   usageCount,
//   isPro,
// }: QuickPostProps) {
//   // --- State ---
//   const [content, setContent] = useState("");
//   const [isPending, setIsPending] = useState(false);
//   const [isGeneratingAI, setIsGeneratingAI] = useState(false);
//   const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

//   // Media
//   const [mediaFiles, setMediaFiles] = useState<File[]>([]);
//   const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
//   const [isDragging, setIsDragging] = useState(false);

//   // Scheduling
//   const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
//   const [isScheduleOpen, setIsScheduleOpen] = useState(false);
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);

//   // Validation
//   const [validationError, setValidationError] = useState<string | null>(null);
//   const [shake, setShake] = useState(false);

//   // --- Refs ---
//   const scheduleMenuRef = useRef<HTMLDivElement>(null);
//   const emojiMenuRef = useRef<HTMLDivElement>(null);
//   const textareaRef = useRef<HTMLTextAreaElement>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const dateInputRef = useRef<HTMLInputElement>(null);

//   // upload images
//   const { startUpload } = useUploadThing("imageUploader");

//   // --- Effects ---
//   useEffect(() => {
//     if (textareaRef.current) {
//       textareaRef.current.style.height = "auto";
//       textareaRef.current.style.height =
//         textareaRef.current.scrollHeight + "px";
//     }
//   }, [content]);

//   useEffect(() => {
//     function handleClickOutside(event: MouseEvent) {
//       if (
//         scheduleMenuRef.current &&
//         !scheduleMenuRef.current.contains(event.target as Node)
//       ) {
//         setIsScheduleOpen(false);
//       }
//       if (
//         emojiMenuRef.current &&
//         !emojiMenuRef.current.contains(event.target as Node)
//       ) {
//         setShowEmojiPicker(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // --- Logic ---
//   const triggerError = (msg: string) => {
//     setValidationError(msg);
//     setShake(true);
//     setTimeout(() => setShake(false), 500);
//   };

//   const togglePlatform = (platform: string, isConnected: boolean) => {
//     if (!isConnected) return;
//     setSelectedPlatforms((prev) =>
//       prev.includes(platform)
//         ? prev.filter((p) => p !== platform)
//         : [...prev, platform],
//     );
//     setValidationError(null);
//   };

//   const insertEmoji = (emoji: string) => {
//     setContent((prev) => prev + emoji);
//     setShowEmojiPicker(false);
//     textareaRef.current?.focus();
//   };

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       processFiles(Array.from(e.target.files));
//       e.target.value = "";
//     }
//   };

//   const processFiles = (files: File[]) => {
//     const images = files.filter((f) => f.type.startsWith("image/"));
//     if (images.length + mediaFiles.length > 4) {
//       triggerError("Maximum 4 images allowed");
//       return;
//     }
//     const newPreviews = images.map((file) => URL.createObjectURL(file));
//     setMediaFiles((prev) => [...prev, ...images]);
//     setMediaPreviews((prev) => [...prev, ...newPreviews]);
//     setValidationError(null);
//   };

//   const removeMedia = (index: number) => {
//     URL.revokeObjectURL(mediaPreviews[index]);
//     setMediaFiles((prev) => prev.filter((_, i) => i !== index));
//     setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
//   };

//   const onDragOver = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(true);
//   }, []);
//   const onDragLeave = useCallback((e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//   }, []);
//   const onDrop = useCallback(
//     (e: React.DragEvent) => {
//       e.preventDefault();
//       setIsDragging(false);
//       if (e.dataTransfer.files && e.dataTransfer.files.length > 0)
//         processFiles(Array.from(e.dataTransfer.files));
//     },
//     [mediaFiles],
//   );

//   const handleTimeAdd = (minutes: number) => {
//     setScheduledDate(addMinutes(new Date(), minutes));
//     setIsScheduleOpen(false);
//     setValidationError(null);
//   };

//   const handleDaySet = (type: "tomorrow" | "monday") => {
//     const now = new Date();
//     let date = now;
//     if (type === "tomorrow") {
//       date = addDays(now, 1);
//       date.setHours(9, 0, 0, 0);
//     }
//     if (type === "monday") {
//       date = nextMonday(now);
//       date.setHours(9, 0, 0, 0);
//     }
//     setScheduledDate(date);
//     setIsScheduleOpen(false);
//     setValidationError(null);
//   };

//   const openNativePicker = () => {
//     try {
//       const input = dateInputRef.current;
//       if (input) {
//         if (typeof (input as any).showPicker === "function") {
//           (input as any).showPicker();
//         } else {
//           input.click();
//         }
//       }
//     } catch (err) {
//       console.error("Picker error", err);
//     }
//   };

//   const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (!e.target.value) return;
//     const date = new Date(e.target.value);
//     if (isBefore(date, new Date())) {
//       triggerError("Cannot schedule in the past");
//       return;
//     }
//     setScheduledDate(date);
//     setValidationError(null);
//   };

//   // --- AI GENERATION LOGIC ---
//   const handleAIGenerate = async () => {
//     if (!content.trim()) {
//       triggerError("Write a draft first");
//       textareaRef.current?.focus();
//       return;
//     }

//     setIsGeneratingAI(true);
//     setValidationError(null);

//     try {
//       let platform: "TWITTER" | "LINKEDIN" | "GENERAL" = "GENERAL";
//       if (selectedPlatforms.includes("TWITTER")) {
//         platform = "TWITTER";
//       } else if (selectedPlatforms.includes("LINKEDIN")) {
//         platform = "LINKEDIN";
//       }

//       // Safe Server Action Call
//       const result = await generatePostContent(content, platform);

//       if (result.success && result.data) {
//         setContent(result.data);
//       } else {
//         triggerError(result.error || "AI generation failed");
//       }
//     } catch (error) {
//       console.error("Client AI Error:", error);
//       triggerError("AI service unavailable");
//     } finally {
//       setIsGeneratingAI(false);
//     }
//   };

//   const FREE_LIMIT = 10;
//   const isLimitReached = !isPro && usageCount >= FREE_LIMIT;
//   const charCount = content.length;
//   const isXSelected = selectedPlatforms.includes("TWITTER");
//   const isXLimitExceeded = isXSelected && charCount > 280;

//   const handleSubmit = async () => {
//     // 1. Basic Validation
//     if (!content.trim() && mediaFiles.length === 0) {
//       triggerError("Post cannot be empty");
//       textareaRef.current?.focus();
//       return;
//     }
//     if (!isXConnected && !isLinkedinConnected) {
//       triggerError("Connect an account first");
//       return;
//     }
//     if (selectedPlatforms.length === 0) {
//       triggerError("Select a platform below");
//       return;
//     }

//     // 2. Constraints Validation
//     if (selectedPlatforms.includes("TWITTER")) {
//       if (content.length > 280) {
//         triggerError("X content exceeds 280 characters");
//         return;
//       }
//       if (mediaFiles.length > 0) {
//         triggerError("Media not allowed when X is selected");
//         return;
//       }
//     }

//     if (selectedPlatforms.includes("LINKEDIN")) {
//       const MAX_SIZE = 5 * 1024 * 1024; // 5MB
//       const hasLargeFile = mediaFiles.some((file) => file.size > MAX_SIZE);
//       if (hasLargeFile) {
//         triggerError("LinkedIn media must be < 5MB");
//         return;
//       }
//     }

//     setIsPending(true);

//     try {
//       let uploadedUrls: string[] = [];

//       // 3. Upload Logic - STRICTLY GUARDED
//       // Only attempt upload if there are actual files.
//       // This prevents calling /api/uploadthing on text-only posts.
//       if (mediaFiles.length > 0) {
//         try {
//           const uploadRes = await startUpload(mediaFiles);

//           if (!uploadRes) {
//             throw new Error("Upload failed");
//           }

//           uploadedUrls = uploadRes.map((res) => res.url);
//         } catch (uploadErr) {
//           console.error("Image upload failed", uploadErr);
//           triggerError("Failed to upload images");
//           setIsPending(false); // Stop execution here if upload fails
//           return;
//         }
//       }

//       const formData = new FormData();
//       formData.append("content", content);
//       selectedPlatforms.forEach((p) => formData.append(p, "on"));

//       if (uploadedUrls.length > 0) {
//         formData.append("mediaUrls", JSON.stringify(uploadedUrls));
//       }

//       let finalDate: Date = scheduledDate ? scheduledDate : new Date();
//       formData.set("scheduledAt", finalDate.toISOString());

//       await scheduleTask(formData);

//       // Artificial delay for UX
//       await new Promise((r) => setTimeout(r, 800));

//       // Cleanup
//       setContent("");
//       setSelectedPlatforms([]);
//       setMediaFiles([]);
//       setMediaPreviews([]);
//       setScheduledDate(null);
//       setValidationError(null);
//     } catch (error) {
//       console.error("Failed to post", error);
//       triggerError("Failed. Please try again.");
//     } finally {
//       setIsPending(false);
//     }
//   };

//   return (
//     <div
//       className={`
//         relative w-full bg-zinc-950 border transition-all duration-300 rounded-3xl overflow-visible shadow-xl shadow-black/20
//         ${isDragging ? "border-blue-500 bg-zinc-900/50" : "border-white/10 hover:border-white/20"}
//       `}
//       onDragOver={onDragOver}
//       onDragLeave={onDragLeave}
//       onDrop={onDrop}
//     >
//       {/* Drag Overlay */}
//       {isDragging && (
//         <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm rounded-3xl pointer-events-none">
//           <div className="text-blue-400 font-bold text-xl flex flex-col items-center animate-bounce">
//             <ImageIcon className="w-10 h-10 mb-2" />
//             Drop images here
//           </div>
//         </div>
//       )}

//       <div className="p-4 md:p-6">
//         <div className="flex gap-3 md:gap-4">
//           <div className="flex-shrink-0 pt-1 hidden sm:block">
//             {userImage ? (
//               <img
//                 src={userImage}
//                 className="w-10 h-10 rounded-full border border-white/10 shadow-sm object-cover"
//                 alt="User"
//               />
//             ) : (
//               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
//                 ME
//               </div>
//             )}
//           </div>

//           <div className="flex-1 min-w-0">
//             {/* Input Area */}
//             <textarea
//               ref={textareaRef}
//               value={content}
//               onChange={(e) => {
//                 setContent(e.target.value);
//                 if (validationError) setValidationError(null);
//               }}
//               disabled={isPending || isGeneratingAI}
//               placeholder="What's new?"
//               className="w-full bg-transparent border-none text-base md:text-lg text-white placeholder:text-zinc-600 p-0 resize-none min-h-[80px] leading-relaxed focus:ring-0 scrollbar-hide outline-0"
//             />

//             {/* Content Length Indicator */}
//             <div className="flex justify-end mt-1 px-1">
//               <span
//                 className={`text-[10px] font-bold transition-colors ${
//                   isXLimitExceeded ? "text-red-500" : "text-zinc-600"
//                 }`}
//               >
//                 {charCount}
//                 {isXSelected && <span className="opacity-50"> / 280</span>}
//               </span>
//             </div>

//             {/* Media Previews */}
//             {mediaPreviews.length > 0 && (
//               <div className="flex flex-wrap gap-2 mt-3 animate-in fade-in slide-in-from-top-2">
//                 {mediaPreviews.map((src, idx) => (
//                   <div
//                     key={idx}
//                     className="relative group w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-white/10"
//                   >
//                     <img
//                       src={src}
//                       alt="Preview"
//                       className="w-full h-full object-cover"
//                     />
//                     <button
//                       onClick={() => removeMedia(idx)}
//                       className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-red-500"
//                     >
//                       <X className="w-3 h-3" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}

//             <div className="h-px w-full bg-white/5 my-4" />

//             {/* --- CONTROLS BAR --- */}
//             <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//               <div className="flex flex-col gap-3">
//                 <div className="flex items-center flex-wrap gap-2">
//                   <PlatformToggle
//                     icon={<Twitter className="w-3.5 h-3.5" />}
//                     label="X"
//                     isConnected={isXConnected}
//                     isActive={selectedPlatforms.includes("TWITTER")}
//                     onClick={() => togglePlatform("TWITTER", isXConnected)}
//                     activeColor="bg-white text-black border-white"
//                   />
//                   <PlatformToggle
//                     icon={<Linkedin className="w-3.5 h-3.5" />}
//                     label="LinkedIn"
//                     isConnected={isLinkedinConnected}
//                     isActive={selectedPlatforms.includes("LINKEDIN")}
//                     onClick={() => togglePlatform("LINKEDIN", isLinkedinConnected)}
//                     activeColor="bg-[#0A66C2] text-white border-[#0A66C2]"
//                   />

//                   {(!isXConnected || !isLinkedinConnected) && (
//                     <Link
//                       href="/dashboard/connections"
//                       className="ml-1 text-[10px] text-zinc-500 hover:text-blue-400 flex items-center gap-1 group whitespace-nowrap"
//                     >
//                       <Plus className="w-3 h-3" />
//                       <span className="underline decoration-zinc-700 underline-offset-2 group-hover:decoration-blue-400">
//                         Connect
//                       </span>
//                     </Link>
//                   )}
//                 </div>

//                 <div className="flex items-center gap-2 relative">
//                   <input
//                     type="file"
//                     ref={fileInputRef}
//                     className="hidden"
//                     accept="image/*"
//                     multiple
//                     onChange={handleFileSelect}
//                   />
//                   <ToolButton
//                     icon={<ImageIcon className="w-4 h-4" />}
//                     label="Media"
//                     onClick={() => fileInputRef.current?.click()}
//                   />

//                   <div ref={emojiMenuRef} className="relative">
//                     <ToolButton
//                       icon={<Smile className="w-4 h-4" />}
//                       label="Emoji"
//                       onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                     />
//                     {showEmojiPicker && (
//                       <div className="absolute bottom-full left-0 mb-2 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-3 z-50 w-64 max-w-[90vw] ring-1 ring-white/10 animate-in fade-in zoom-in-95">
//                         <div className="grid grid-cols-6 gap-2">
//                           {TOP_EMOJIS.map((emoji) => (
//                             <button
//                               key={emoji}
//                               onClick={() => insertEmoji(emoji)}
//                               className="hover:bg-zinc-800 p-1.5 rounded-lg text-lg transition-colors"
//                             >
//                               {emoji}
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                   </div>

//                   {/* AI Button - Functional */}
//                   <button
//                     onClick={handleAIGenerate}
//                     disabled={isGeneratingAI || !content.trim()}
//                     className={`
//                       flex items-center gap-1.5 p-2 rounded-lg transition-colors
//                       ${isGeneratingAI
//                         ? "text-purple-400 bg-purple-500/10 cursor-not-allowed"
//                         : "text-zinc-400 hover:text-purple-400 hover:bg-purple-400/10"
//                       }
//                     `}
//                     title="AI Generate"
//                   >
//                      {isGeneratingAI ? (
//                        <Loader2 className="w-4 h-4 animate-spin" />
//                      ) : (
//                        <Sparkles className="w-4 h-4" />
//                      )}
//                   </button>

//                   {validationError && (
//                     <div
//                       className={`flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full animate-in fade-in slide-in-from-left-2 ${shake ? "animate-shake" : ""}`}
//                     >
//                       <AlertTriangle className="w-3 h-3 text-red-400" />
//                       <span className="text-xs text-red-300 font-medium truncate max-w-[150px]">
//                         {validationError}
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* BOTTOM ROW */}
//               <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
//                 {isLimitReached ? (
//                   <Link
//                     href="/dashboard/settings"
//                     className="
//                       flex-1 sm:flex-none relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm
//                       bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:scale-[1.02] transition-transform
//                     "
//                   >
//                     <Lock className="w-3.5 h-3.5" />
//                     <span>Upgrade Plan</span>
//                   </Link>
//                 ) : (
//                   <>
//                     <div className="relative" ref={scheduleMenuRef}>
//                       {scheduledDate ? (
//                         <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-2 rounded-xl text-xs font-bold animate-in zoom-in cursor-default">
//                           <div className="flex flex-col leading-none">
//                             <span className="text-[9px] opacity-70 uppercase tracking-wider mb-0.5">
//                               Scheduled
//                             </span>
//                             <span className="whitespace-nowrap">
//                               {format(scheduledDate, "MMM d • h:mm a")}
//                             </span>
//                           </div>
//                           <button
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               setScheduledDate(null);
//                             }}
//                             className="p-1 hover:bg-emerald-500/20 rounded-full transition-colors"
//                           >
//                             <X className="w-3 h-3" />
//                           </button>
//                         </div>
//                       ) : (
//                         <button
//                           type="button"
//                           onClick={() => setIsScheduleOpen(!isScheduleOpen)}
//                           className={`
//                           flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap
//                           ${isScheduleOpen ? "bg-zinc-800 text-white border-zinc-700" : "bg-zinc-900/50 text-zinc-400 border-white/5 hover:bg-zinc-800 hover:text-white"}
//                         `}
//                         >
//                           <CalendarIcon className="w-4 h-4" />
//                           <span>Schedule</span>
//                           <ChevronDown
//                             className={`w-3 h-3 transition-transform ${isScheduleOpen ? "rotate-180" : ""}`}
//                           />
//                         </button>
//                       )}

//                       {isScheduleOpen && (
//                         <div className="absolute bottom-full right-0 sm:right-0 left-0 sm:left-auto mb-2 w-full sm:w-72 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden ring-1 ring-white/10 animate-in fade-in zoom-in-95 origin-bottom-right">
//                           <div className="px-3 py-2 bg-zinc-900/50 border-b border-white/5 flex justify-between items-center">
//                             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
//                               Instant Schedule
//                             </span>
//                             <Zap className="w-3 h-3 text-zinc-600" />
//                           </div>

//                           <div className="p-2 space-y-2">
//                             <div className="grid grid-cols-3 gap-1">
//                               <QuickTimeBtn label="+10m" onClick={() => handleTimeAdd(10)} />
//                               <QuickTimeBtn label="+30m" onClick={() => handleTimeAdd(30)} />
//                               <QuickTimeBtn label="+1h" onClick={() => handleTimeAdd(60)} />
//                             </div>
//                             <div className="grid grid-cols-3 gap-1">
//                               <QuickTimeBtn label="+3h" onClick={() => handleTimeAdd(180)} />
//                               <QuickTimeBtn label="+6h" onClick={() => handleTimeAdd(360)} />
//                               <QuickTimeBtn label="Tmrw 9am" onClick={() => handleDaySet("tomorrow")} />
//                             </div>
//                           </div>
//                           <div className="h-px bg-white/5 mx-2" />
//                           <div className="p-2 relative">
//                             <div
//                               onClick={openNativePicker}
//                               className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-zinc-900 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer group border border-white/5"
//                             >
//                               <span>
//                                 {scheduledDate && isValid(scheduledDate)
//                                   ? format(scheduledDate, "MMM d, h:mm a")
//                                   : "Custom Date & Time..."}
//                               </span>
//                               <Plus className="w-3 h-3 opacity-50" />
//                             </div>
//                             <input
//                               type="datetime-local"
//                               ref={dateInputRef}
//                               min={getLocalISOString(new Date())}
//                               className="absolute bottom-0 left-0 w-full h-full opacity-0 z-[-1]"
//                               onChange={handleCustomDateChange}
//                             />
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     <button
//                       onClick={handleSubmit}
//                       disabled={isPending}
//                       className={`
//                     flex-1 sm:flex-none relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg whitespace-nowrap
//                     ${isPending ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-white text-black hover:bg-zinc-200 hover:scale-[1.02] shadow-white/10"}
//                   `}
//                     >
//                       {isPending ? (
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                       ) : (
//                         <>
//                           {scheduledDate ? "Schedule" : "Post Now"}
//                           {scheduledDate ? (
//                             <Clock className="w-3.5 h-3.5" />
//                           ) : (
//                             <Send className="w-3.5 h-3.5" />
//                           )}
//                         </>
//                       )}
//                     </button>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//       <style jsx global>{`
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           25% { transform: translateX(-4px); }
//           75% { transform: translateX(4px); }
//         }
//         .animate-shake { animation: shake 0.4s ease-in-out; }
//       `}</style>
//     </div>
//   );
// }

// // --- Sub Components ---
// function ToolButton({ icon, label, onClick }: { icon: any; label: string; onClick: () => void }) {
//   return (
//     <button
//       onClick={onClick}
//       className="flex items-center gap-1.5 p-2 rounded-lg text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
//       title={label}
//     >
//       {icon}
//     </button>
//   );
// }

// function QuickTimeBtn({ label, onClick }: { label: string; onClick: () => void }) {
//   return (
//     <button
//       onClick={onClick}
//       className="px-2 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-medium rounded-lg border border-white/5 transition-all active:scale-95"
//     >
//       {label}
//     </button>
//   );
// }

// function PlatformToggle({ icon, label, isConnected, isActive, onClick, activeColor }: any) {
//   if (!isConnected) {
//     return (
//       <div className="relative group">
//         <button
//           disabled
//           className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-zinc-900/30 opacity-40 grayscale cursor-not-allowed"
//         >
//           {icon}
//           <span className="text-[10px] font-bold">{label}</span>
//           <Lock className="w-3 h-3 ml-1 opacity-50" />
//         </button>
//       </div>
//     );
//   }
//   return (
//     <button
//       onClick={onClick}
//       className={`
//         flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all duration-200
//         ${isActive ? `${activeColor} shadow-md` : "border-white/10 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white"}
//       `}
//     >
//       {icon}
//       <span>{label}</span>
//     </button>
//   );
// }

"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Twitter,
  Linkedin,
  Calendar as CalendarIcon,
  ChevronDown,
  Image as ImageIcon,
  Smile,
  Loader2,
  Clock,
  Send,
  Plus,
  Lock,
  AlertTriangle,
  Zap,
  Sparkles,
} from "lucide-react";
import { useUploadThing } from "@/lib/uploadthings";
import {
  format,
  addMinutes,
  addDays,
  nextMonday,
  isBefore,
  isValid,
} from "date-fns";
import { scheduleTask } from "@/app/actions/task-actions";
import { generatePostContent } from "@/app/actions/ai-actions";
import Link from "next/link";
// import { redis } from "@/lib/redis";
import { getUsageCountByPlatform } from "@/app/actions/usage-actions";
// --- Configuration ---
const TOP_EMOJIS = [
  "😀",
  "🔥",
  "🚀",
  "💡",
  "✨",
  "🎉",
  "👍",
  "❤️",
  "😂",
  "🤔",
  "👀",
  "📈",
  "📅",
  "✅",
  "❌",
  "👋",
  "🙏",
  "💯",
];

interface QuickPostProps {
  isXConnected: boolean;
  isLinkedinConnected: boolean;
  userImage?: string | null;
  // usageCount: number;
  isPro: boolean;
  userId: string;
}
// instead of this call usage actions
// async function ab(session: any) {
//   const twitterKey = `user:${session.user.id}:quota:TWITTER`;
//   const linkedinKey = `user:${session.user.id}:quota:LINKEDIN`;

//   const [twitterUsage, linkedinUsage] = await Promise.all([
//     redis.get<number>(twitterKey),
//     redis.get<number>(linkedinKey),
//   ]);

//   const usageCount = {
//     twitter: twitterUsage ?? 0,
//     linkedin: linkedinUsage ?? 0,
//   };
// }
const getLocalISOString = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() - offset);
  return localDate.toISOString().slice(0, 16);
};

const LIMITS = {
  TWITTER: 10,
  LINKEDIN: 60,
};

export default function QuickPostForm({
  isXConnected,
  isLinkedinConnected,
  userImage,
  // usageCount,
  isPro,
  userId,
}: QuickPostProps) {
  // --- State ---
  const [content, setContent] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);

  // Media
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  // Scheduling
  const [scheduledDate, setScheduledDate] = useState<Date | null>(null);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  // Validation
  const [validationError, setValidationError] = useState<string | null>(null);
  const [shake, setShake] = useState(false);

  // --- Refs ---
  const scheduleMenuRef = useRef<HTMLDivElement>(null);
  const emojiMenuRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  // upload images
  // Note: This hook may perform a lightweight GET request on mount to verify config.
  // The heavy POST upload is strictly prevented below if no files are selected.
  const { startUpload } = useUploadThing("imageUploader");

  // --- Effects ---
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [content]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        scheduleMenuRef.current &&
        !scheduleMenuRef.current.contains(event.target as Node)
      ) {
        setIsScheduleOpen(false);
      }
      if (
        emojiMenuRef.current &&
        !emojiMenuRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- Logic ---
  const triggerError = (msg: string) => {
    setValidationError(msg);
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const togglePlatform = (platform: string, isConnected: boolean) => {
    if (!isConnected) return;
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform],
    );
    setValidationError(null);
  };

  const insertEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const processFiles = (files: File[]) => {
    const images = files.filter((f) => f.type.startsWith("image/"));
    if (images.length + mediaFiles.length > 4) {
      triggerError("Maximum 4 images allowed");
      return;
    }
    const newPreviews = images.map((file) => URL.createObjectURL(file));
    setMediaFiles((prev) => [...prev, ...images]);
    setMediaPreviews((prev) => [...prev, ...newPreviews]);
    setValidationError(null);
  };

  const removeMedia = (index: number) => {
    URL.revokeObjectURL(mediaPreviews[index]);
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);
  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);
  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0)
        processFiles(Array.from(e.dataTransfer.files));
    },
    [mediaFiles],
  );

  const handleTimeAdd = (minutes: number) => {
    setScheduledDate(addMinutes(new Date(), minutes));
    setIsScheduleOpen(false);
    setValidationError(null);
  };

  const handleDaySet = (type: "tomorrow" | "monday") => {
    const now = new Date();
    let date = now;
    if (type === "tomorrow") {
      date = addDays(now, 1);
      date.setHours(9, 0, 0, 0);
    }
    if (type === "monday") {
      date = nextMonday(now);
      date.setHours(9, 0, 0, 0);
    }
    setScheduledDate(date);
    setIsScheduleOpen(false);
    setValidationError(null);
  };

  const openNativePicker = () => {
    try {
      const input = dateInputRef.current;
      if (input) {
        if (typeof (input as any).showPicker === "function") {
          (input as any).showPicker();
        } else {
          input.click();
        }
      }
    } catch (err) {
      console.error("Picker error", err);
    }
  };

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.value) return;
    const date = new Date(e.target.value);
    if (isBefore(date, new Date())) {
      triggerError("Cannot schedule in the past");
      return;
    }
    setScheduledDate(date);
    setValidationError(null);
  };

  // --- AI GENERATION LOGIC ---
  const handleAIGenerate = async () => {
    if (!content.trim()) {
      triggerError("Write a draft first");
      textareaRef.current?.focus();
      return;
    }

    setIsGeneratingAI(true);
    setValidationError(null);

    try {
      let platform: "TWITTER" | "LINKEDIN" | "GENERAL" = "GENERAL";
      if (selectedPlatforms.includes("TWITTER")) {
        alert("X Not Available right now");
        platform = "TWITTER";
      } else if (selectedPlatforms.includes("LINKEDIN")) {
        platform = "LINKEDIN";
      }

      // Safe Server Action Call
      const result = await generatePostContent(content, platform);

      if (result.success && result.data) {
        setContent(result.data);
      } else {
        triggerError(result.error || "AI generation failed");
      }
    } catch (error) {
      console.error("Client AI Error:", error);
      triggerError("AI service unavailable");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const FREE_LIMIT = 10;
  // const isLimitReached = !isPro && usageCount >= FREE_LIMIT;
  const isLimitReached = false;
  const charCount = content.length;
  const isXSelected = selectedPlatforms.includes("TWITTER");
  const isXLimitExceeded = isXSelected && charCount > 280;

  const handleSubmit = async () => {
    // 1. Basic Validation
    if (!content.trim() && mediaFiles.length === 0) {
      triggerError("Post cannot be empty");
      textareaRef.current?.focus();
      return;
    }
    if (!isXConnected && !isLinkedinConnected) {
      triggerError("Connect an account first");
      return;
    }
    if (selectedPlatforms.length === 0) {
      triggerError("Select a platform below");
      return;
    }

    // 2. Constraints Validation
    if (selectedPlatforms.includes("TWITTER")) {
      if (content.length > 280) {
        triggerError("X content exceeds 280 characters");
        return;
      }
      if (mediaFiles.length > 0) {
        triggerError("Media not allowed when X is selected");
        return;
      }
    }

    if (selectedPlatforms.includes("LINKEDIN")) {
      const MAX_SIZE = 5 * 1024 * 1024; // 5MB
      const hasLargeFile = mediaFiles.some((file) => file.size > MAX_SIZE);
      if (hasLargeFile) {
        triggerError("LinkedIn media must be < 5MB");
        return;
      }
    }

    setIsPending(true);

    try {
      const usageStats = await getUsageCountByPlatform();

      if (selectedPlatforms.includes("TWITTER")) {
        if (usageStats.twitter >= LIMITS.TWITTER) {
          triggerError(
            `X Limit Reached (${LIMITS.TWITTER}/${LIMITS.TWITTER}). Upgrade Plan.`,
          );
          setIsPending(false);
          return;
        }
      }

      if (selectedPlatforms.includes("LINKEDIN")) {
        if (usageStats.linkedin >= LIMITS.LINKEDIN) {
          triggerError(
            `LinkedIn Limit Reached (${LIMITS.LINKEDIN}/${LIMITS.LINKEDIN}). Upgrade Plan.`,
          );
          setIsPending(false);
          return;
        }
      }

      let uploadedUrls: string[] = [];

      // 3. Upload Logic - STRICTLY GUARDED
      // Only attempt upload if there are actual files.
      // This prevents calling /api/uploadthing on text-only posts.
      if (mediaFiles.length > 0) {
        try {
          const uploadRes = await startUpload(mediaFiles);

          if (!uploadRes) {
            throw new Error("Upload failed");
          }

          uploadedUrls = uploadRes.map((res) => res.url);
        } catch (uploadErr) {
          console.error("Image upload failed", uploadErr);
          triggerError("Failed to upload images");
          setIsPending(false); // Stop execution here if upload fails
          return;
        }
      }

      const formData = new FormData();
      formData.append("content", content);
      selectedPlatforms.forEach((p) => formData.append(p, "on"));

      if (uploadedUrls.length > 0) {
        formData.append("mediaUrls", JSON.stringify(uploadedUrls));
      }

      let finalDate: Date = scheduledDate ? scheduledDate : new Date();
      formData.set("scheduledAt", finalDate.toISOString());

      await scheduleTask(formData);

      // Artificial delay for UX
      await new Promise((r) => setTimeout(r, 800));

      // Cleanup
      setContent("");
      setSelectedPlatforms([]);
      setMediaFiles([]);
      setMediaPreviews([]);
      setScheduledDate(null);
      setValidationError(null);
    } catch (error) {
      console.error("Failed to post", error);
      triggerError("Failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div
      className={`
        relative w-full bg-zinc-950 border transition-all duration-300 rounded-3xl overflow-visible shadow-xl shadow-black/20
        ${isDragging ? "border-blue-500 bg-zinc-900/50" : "border-white/10 hover:border-white/20"}
      `}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {/* Drag Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm rounded-3xl pointer-events-none">
          <div className="text-blue-400 font-bold text-xl flex flex-col items-center animate-bounce">
            <ImageIcon className="w-10 h-10 mb-2" />
            Drop images here
          </div>
        </div>
      )}

      <div className="p-4 md:p-6">
        <div className="flex gap-3 md:gap-4">
          <div className="flex-shrink-0 pt-1 hidden sm:block">
            {userImage ? (
              <img
                src={userImage}
                className="w-10 h-10 rounded-full border border-white/10 shadow-sm object-cover"
                alt="User"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                ME
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            {/* Input Area */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (validationError) setValidationError(null);
              }}
              disabled={isPending || isGeneratingAI}
              placeholder="What's new?"
              className="w-full bg-transparent border-none text-base md:text-lg text-white placeholder:text-zinc-600 p-0 resize-none min-h-[80px] leading-relaxed focus:ring-0 scrollbar-hide outline-0"
            />

            {/* Content Length Indicator */}
            <div className="flex justify-end mt-1 px-1">
              <span
                className={`text-[10px] font-bold transition-colors ${
                  isXLimitExceeded ? "text-red-500" : "text-zinc-600"
                }`}
              >
                {charCount}
                {isXSelected && <span className="opacity-50"> / 280</span>}
              </span>
            </div>

            {/* Media Previews */}
            {mediaPreviews.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 animate-in fade-in slide-in-from-top-2">
                {mediaPreviews.map((src, idx) => (
                  <div
                    key={idx}
                    className="relative group w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-white/10"
                  >
                    <img
                      src={src}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeMedia(idx)}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="h-px w-full bg-white/5 my-4" />

            {/* --- CONTROLS BAR --- */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3">
                <div className="flex items-center flex-wrap gap-2">
                  {/* <PlatformToggle
                    icon={<Twitter className="w-3.5 h-3.5" />}
                    label="X"
                    disabled={true}
                    isConnected={isXConnected}
                    isActive={selectedPlatforms.includes("TWITTER")}
                    // onClick={() => togglePlatform("TWITTER", isXConnected)}
                    activeColor="bg-white text-black border-white"
                  /> */}
                  <PlatformToggle
                    icon={<Linkedin className="w-3.5 h-3.5" />}
                    label="LinkedIn"
                    isConnected={isLinkedinConnected}
                    isActive={selectedPlatforms.includes("LINKEDIN")}
                    onClick={() =>
                      togglePlatform("LINKEDIN", isLinkedinConnected)
                    }
                    activeColor="bg-[#0A66C2] text-white border-[#0A66C2]"
                  />

                  {(!isXConnected || !isLinkedinConnected) && (
                    <Link
                      href="/dashboard/connections"
                      className="ml-1 text-[10px] text-zinc-500 hover:text-blue-400 flex items-center gap-1 group whitespace-nowrap"
                      prefetch={false}
                    >
                      <Plus className="w-3 h-3" />
                      <span className="underline decoration-zinc-700 underline-offset-2 group-hover:decoration-blue-400">
                        Connect
                      </span>
                    </Link>
                  )}
                </div>

                <div className="flex items-center gap-2 relative">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                  />
                  <ToolButton
                    icon={<ImageIcon className="w-4 h-4" />}
                    label="Media"
                    onClick={() => fileInputRef.current?.click()}
                  />

                  <div ref={emojiMenuRef} className="relative">
                    <ToolButton
                      icon={<Smile className="w-4 h-4" />}
                      label="Emoji"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    />
                    {showEmojiPicker && (
                      <div className="absolute bottom-full left-0 mb-2 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl p-3 z-50 w-64 max-w-[90vw] ring-1 ring-white/10 animate-in fade-in zoom-in-95">
                        <div className="grid grid-cols-6 gap-2">
                          {TOP_EMOJIS.map((emoji) => (
                            <button
                              key={emoji}
                              onClick={() => insertEmoji(emoji)}
                              className="hover:bg-zinc-800 p-1.5 rounded-lg text-lg transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Button - Functional */}
                  <button
                    onClick={handleAIGenerate}
                    disabled={isGeneratingAI || !content.trim()}
                    className={`
                      flex items-center gap-1.5 p-2 rounded-lg transition-colors
                      ${
                        isGeneratingAI
                          ? "text-purple-400 bg-purple-500/10 cursor-not-allowed"
                          : "text-zinc-400 hover:text-purple-400 hover:bg-purple-400/10"
                      }
                    `}
                    title="AI Generate"
                  >
                    {isGeneratingAI ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                  </button>

                  {validationError && (
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full animate-in fade-in slide-in-from-left-2 ${shake ? "animate-shake" : ""}`}
                    >
                      <AlertTriangle className="w-3 h-3 text-red-400" />
                      <span className="text-xs text-red-300 font-medium truncate max-w-[150px]">
                        {validationError}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* BOTTOM ROW */}
              <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
                {isLimitReached ? (
                  <Link
                    href="/dashboard/settings"
                    className="
                      flex-1 sm:flex-none relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm 
                      bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg hover:scale-[1.02] transition-transform
                    "
                    prefetch={false}
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Upgrade Plan</span>
                  </Link>
                ) : (
                  <>
                    <div className="relative" ref={scheduleMenuRef}>
                      {scheduledDate ? (
                        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-2 rounded-xl text-xs font-bold animate-in zoom-in cursor-default">
                          <div className="flex flex-col leading-none">
                            <span className="text-[9px] opacity-70 uppercase tracking-wider mb-0.5">
                              Scheduled
                            </span>
                            <span className="whitespace-nowrap">
                              {format(scheduledDate, "MMM d • h:mm a")}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setScheduledDate(null);
                            }}
                            className="p-1 hover:bg-emerald-500/20 rounded-full transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsScheduleOpen(!isScheduleOpen)}
                          className={`
                          flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all whitespace-nowrap
                          ${isScheduleOpen ? "bg-zinc-800 text-white border-zinc-700" : "bg-zinc-900/50 text-zinc-400 border-white/5 hover:bg-zinc-800 hover:text-white"}
                        `}
                        >
                          <CalendarIcon className="w-4 h-4" />
                          <span>Schedule</span>
                          <ChevronDown
                            className={`w-3 h-3 transition-transform ${isScheduleOpen ? "rotate-180" : ""}`}
                          />
                        </button>
                      )}

                      {isScheduleOpen && (
                        <div className="absolute bottom-full right-0 sm:right-0 left-0 sm:left-auto mb-2 w-full sm:w-72 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden ring-1 ring-white/10 animate-in fade-in zoom-in-95 origin-bottom-right">
                          <div className="px-3 py-2 bg-zinc-900/50 border-b border-white/5 flex justify-between items-center">
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                              Instant Schedule
                            </span>
                            <Zap className="w-3 h-3 text-zinc-600" />
                          </div>

                          <div className="p-2 space-y-2">
                            <div className="grid grid-cols-3 gap-1">
                              <QuickTimeBtn
                                label="+10m"
                                onClick={() => handleTimeAdd(10)}
                              />
                              <QuickTimeBtn
                                label="+30m"
                                onClick={() => handleTimeAdd(30)}
                              />
                              <QuickTimeBtn
                                label="+1h"
                                onClick={() => handleTimeAdd(60)}
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-1">
                              <QuickTimeBtn
                                label="+3h"
                                onClick={() => handleTimeAdd(180)}
                              />
                              <QuickTimeBtn
                                label="+6h"
                                onClick={() => handleTimeAdd(360)}
                              />
                              <QuickTimeBtn
                                label="Tmrw 9am"
                                onClick={() => handleDaySet("tomorrow")}
                              />
                            </div>
                          </div>
                          <div className="h-px bg-white/5 mx-2" />
                          <div className="p-2 relative">
                            <div
                              onClick={openNativePicker}
                              className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-zinc-900 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer group border border-white/5"
                            >
                              <span>
                                {scheduledDate && isValid(scheduledDate)
                                  ? format(scheduledDate, "MMM d, h:mm a")
                                  : "Custom Date & Time..."}
                              </span>
                              <Plus className="w-3 h-3 opacity-50" />
                            </div>
                            <input
                              type="datetime-local"
                              ref={dateInputRef}
                              min={getLocalISOString(new Date())}
                              className="absolute bottom-0 left-0 w-full h-full opacity-0 z-[-1]"
                              onChange={handleCustomDateChange}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isPending}
                      className={`
                    flex-1 sm:flex-none relative flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 shadow-lg whitespace-nowrap
                    ${isPending ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" : "bg-white text-black hover:bg-zinc-200 hover:scale-[1.02] shadow-white/10"}
                  `}
                    >
                      {isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          {scheduledDate ? "Schedule" : "Post Now"}
                          {scheduledDate ? (
                            <Clock className="w-3.5 h-3.5" />
                          ) : (
                            <Send className="w-3.5 h-3.5" />
                          )}
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}

// --- Sub Components ---
function ToolButton({
  icon,
  label,
  onClick,
}: {
  icon: any;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 p-2 rounded-lg text-zinc-400 hover:text-blue-400 hover:bg-blue-400/10 transition-colors"
      title={label}
    >
      {icon}
    </button>
  );
}

function QuickTimeBtn({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-2 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-medium rounded-lg border border-white/5 transition-all active:scale-95"
    >
      {label}
    </button>
  );
}

function PlatformToggle({
  icon,
  label,
  isConnected,
  isActive,
  onClick,
  activeColor,
}: any) {
  if (!isConnected) {
    return (
      <div className="relative group">
        <button
          disabled
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-zinc-900/30 opacity-40 grayscale cursor-not-allowed"
        >
          {icon}
          <span className="text-[10px] font-bold">{label}</span>
          <Lock className="w-3 h-3 ml-1 opacity-50" />
        </button>
      </div>
    );
  }
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all duration-200
        ${isActive ? `${activeColor} shadow-md` : "border-white/10 bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 hover:text-white"}
      `}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}
