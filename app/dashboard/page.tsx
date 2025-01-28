import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verify } from "jsonwebtoken";
import { UserStats } from "./user-stats";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-space-800 to-black p-6">
      {/* Header */}
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Dashboard
          </h1>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* User Stats */}
          <div className="md:col-span-2 lg:col-span-1">
            <UserStats />
          </div>

          {/* Security Overview */}
          <div className="md:col-span-2 lg:col-span-1">
            <SecurityOverview />
          </div>

          {/* Quick Actions */}
          <div className="md:col-span-2 lg:col-span-1">
            <QuickActions />
          </div>

          {/* Recent Activity */}
          <div className="md:col-span-2 lg:col-span-2">
            <RecentActivity />
          </div>

          {/* 2FA Setup */}
          <div className="md:col-span-2 lg:col-span-1">
            <Setup2FA />
          </div>
        </div>
      </div>
    </div>
  );
}
