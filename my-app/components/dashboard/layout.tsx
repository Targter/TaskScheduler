import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Your auth config
import { redirect } from "next/navigation";
// import Sidebar from "@/components/dashboard/Sidebar";
import Sidebar from "./sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Sidebar (Desktop) */}
      <Sidebar user={session.user} />

      {/* Main Content Area */}
      <div className="md:ml-64 min-h-screen flex flex-col">
        {/* Mobile Header (Only visible on small screens) */}
        <header className="md:hidden h-16 border-b border-white/10 flex items-center justify-between px-6 bg-zinc-950 sticky top-0 z-50">
          <span className="font-bold text-white">Schedulr.</span>
          <div className="w-8 h-8 bg-zinc-800 rounded-full">
            {/* Mobile User Icon / Menu Trigger would go here */}
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
