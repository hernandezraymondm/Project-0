import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verify } from "jsonwebtoken";
import { UserStats } from "../components/user-stats";
import { Setup2FA } from "@/components/setup-2fa";
import { RecentActivity } from "@/components/recent-activity";
import { QuickActions } from "@/components/quick-actions";
import { SecurityOverview } from "../components/security-overview";
import { NotificationsPanel } from "../components/notification-panel";
import { SalesAnalytics } from "@/components/sales-analytics";

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
    <div className="min-h-screen bg-background p-6 pt-20">
      {/* Dashboard Content */}
      <div className="container mx-auto px-4 relative z-10">
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Left Column */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-5 content-start">
            {/* Top Row */}
            <div className="md:col-span-2">
              <NotificationsPanel />
            </div>

            {/* Middle Row */}
            <div className="md:col-span-1">
              <UserStats />
            </div>
            <div className="md:col-span-1">
              <SecurityOverview />
            </div>

            {/* Additional Sections */}
            <div className="md:col-span-2">
              <SalesAnalytics />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 grid grid-cols-1 gap-5 content-start">
            <Setup2FA />
            <QuickActions />
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
