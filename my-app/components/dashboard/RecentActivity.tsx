import {
  CalendarClock,
  Twitter,
  Linkedin,
  MessageCircle,
  AlertCircle,
} from "lucide-react";

// Helper to render the correct icon based on data
// Note: You might need to adjust logic based on how you store execution data
const PlatformIcon = ({ platform }: { platform: string }) => {
  switch (platform) {
    case "TWITTER":
      return <Twitter className="w-4 h-4 text-white" />;
    case "LINKEDIN":
      return <Linkedin className="w-4 h-4 text-white" />;
    case "WHATSAPP":
      return <MessageCircle className="w-4 h-4 text-white" />;
    default:
      return <div className="w-2 h-2 bg-zinc-500 rounded-full" />;
  }
};

const PlatformBadge = ({ platform }: { platform: string }) => {
  const styles =
    {
      TWITTER: "bg-black border-zinc-800 text-white",
      LINKEDIN: "bg-[#0A66C2] border-transparent text-white",
      WHATSAPP: "bg-[#25D366] border-transparent text-white",
      DEFAULT: "bg-zinc-800 text-zinc-400",
    }[platform] || "bg-zinc-800 text-zinc-400";

  return (
    <div
      className={`flex items-center justify-center w-8 h-8 rounded-lg border ${styles}`}
    >
      <PlatformIcon platform={platform} />
    </div>
  );
};

export default function RecentActivity({ posts }: { posts: any[] }) {
  if (posts.length === 0) {
    return (
      <div className="bg-zinc-900/30 border border-white/5 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-zinc-900 rounded-full flex items-center justify-center mb-3">
          <CalendarClock className="w-5 h-5 text-zinc-600" />
        </div>
        <p className="text-zinc-400 font-medium">No posts in queue</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <div
          key={post.id}
          className="group relative bg-zinc-900/50 hover:bg-zinc-900 border border-white/5 hover:border-white/10 p-4 rounded-2xl transition-all flex items-start gap-4 overflow-hidden"
        >
          {/* 1. VISIBLE PLATFORM ICON */}
          {/* We assume the post has 'executions' or a 'platform' field. 
              If not, we show a generic icon, but ideally you fetch this from DB */}
          <PlatformBadge
            platform={post.executions?.[0]?.platform || "TWITTER"}
          />

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-1">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                {new Date(post.scheduledAt).toLocaleDateString()}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {post.status}
              </span>
            </div>

            <p className="text-zinc-200 text-sm leading-relaxed line-clamp-2">
              {post.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
