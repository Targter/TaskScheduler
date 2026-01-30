import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex h-full items-center justify-center p-20 text-zinc-500">
      <Loader2 className="w-8 h-8 animate-spin" />
    </div>
  );
}
