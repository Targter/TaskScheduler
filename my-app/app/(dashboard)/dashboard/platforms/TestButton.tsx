// client comp
"use client";

import { sendTestTweet } from "@/app/actions/test-tweet";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function TestTweetButton({
  isConnected,
}: {
  isConnected: boolean;
}) {
  const [status, setStatus] = useState<
    "IDLE" | "LOADING" | "SUCCESS" | "ERROR"
  >("IDLE");
  const [msg, setMsg] = useState("");
  console.log("this test button loadded...");

  if (!isConnected) return null;

  async function handleTest() {
    setStatus("LOADING");
    const result = await sendTestTweet();

    if (result.success) {
      setStatus("SUCCESS");
      setMsg("Tweet sent! Check your profile.");
    } else {
      setStatus("ERROR");
      setMsg(result.error || "Failed");
    }

    // Reset after 3 seconds
    setTimeout(() => setStatus("IDLE"), 3000);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleTest}
        disabled={true}
        // disabled={status === "LOADING"}
        title="Test Button Disabled"
        className="px-3 py-1.5 bg-red-600 hover:bg-red-800 text-white text-xs font-bold rounded-lg flex items-center gap-2 transition cursor-pointer"
      >
        {status === "LOADING" ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : status === "SUCCESS" ? (
          <CheckCircle2 className="w-3 h-3" />
        ) : status === "ERROR" ? (
          <AlertCircle className="w-3 h-3" />
        ) : (
          <Send className="w-3 h-3" />
        )}
        {status === "SUCCESS"
          ? "Sent!"
          : status === "ERROR"
            ? "Failed"
            : "Send Test Tweet button disabled..."}
      </button>
      {status === "ERROR" && (
        <span className="text-xs text-red-400">{msg}</span>
      )}
    </div>
  );
}
