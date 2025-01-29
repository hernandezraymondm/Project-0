import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verify } from "jsonwebtoken";
import { UserStats } from "../components/user-stats";
import { Setup2FA } from "@/components/setup-2fa";
import { RecentActivity } from "@/components/recent-activity";
import { SecurityOverview } from "@/components/security-overview";
import { QuickActions } from "@/components/quick-actions";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("session")?.value;
  if (!token) {
    redirect("/login");
  }
  try {
    verify(token, process.env.JWT_SECRET!);
  } catch {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-space-800 to-black p-6 pt-24">
      {/* Header */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Dashboard
          </h1>
        </div>
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8 content-start">
            <div className="flex flex-col md:col-span-1">
              <UserStats />
            </div>
            <div className="flex flex-col md:col-span-1">
              <SecurityOverview />
            </div>
            <div className="flex flex-col md:col-span-2">
              <RecentActivity />
            </div>
          </div>
          {/* Right Column */}
          <div className="lg:col-span-1 grid grid-cols-1 gap-8 content-start">
            <div className="flex flex-col">
              <Setup2FA />
            </div>
            <div className="flex flex-col">
              <QuickActions />
            </div>
          </div>
        </div>
      </div>
      {/* Floating stars animation */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-[1px] h-[1px] bg-white rounded-full animate-star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${Math.random() * 5 + 5}s`,
              animationDelay: `${Math.random() * 2}s`,
              opacity: `${Math.random() * 0.5 + 0.2}`, // Random opacity for subtlety
            }}
          ></div>
        ))}
      </div>
    </div>
  );
}
