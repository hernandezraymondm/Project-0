import FloatingIconCard from "@/components/floating-icon-card";
import {
  UsersRound,
  ShoppingCart,
  BarChartIcon as ChartSpline,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import { MdTimeline } from "react-icons/md";
import { Overview } from "@/components/dashboard/overview";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Setup2FA } from "@/components/dashboard/setup-2fa";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { UserStats } from "../components/user-stats";
import { SecurityOverview } from "../components/security-overview";
import { DateTimeDisplay } from "@/components/date-time-display";
import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex justify-center items-center gap-2">
          <span className="rounded-full bg-card p-3">
            <MdTimeline className="h-6 w-6" />
          </span>
          <h2 className="text-3xl tracking-tight">Overview</h2>
        </div>
        <DateTimeDisplay showSeconds />
        <Button>
          <FaGithub className="mr-2 h-4 w-4" />
          <p className="hidden sm:inline">Star on GitHub</p>
        </Button>
      </div>
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-5 pt-4">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-5">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5">
            <FloatingIconCard
              icon={UsersRound}
              title="Clients"
              value="512"
              change="12%"
              changeType="increase"
              iconColor="text-white"
              iconBgColor="bg-emerald-400"
            />
            <FloatingIconCard
              icon={ShoppingCart}
              title="Sales"
              value="$7,770"
              change="12%"
              changeType="decrease"
              iconColor="text-white"
              iconBgColor="bg-sky-400"
            />
            <FloatingIconCard
              icon={ChartSpline}
              title="Performance"
              value="256"
              change="Overflow"
              changeType="overflow"
              iconColor="text-white"
              iconBgColor="bg-purple-400"
            />
            <FloatingIconCard
              icon={TriangleAlert}
              title="Alerts"
              value="24"
              change="Last 24 Hours"
              changeType="neutral"
              iconColor="text-white"
              iconBgColor="bg-amber-400"
            />
          </div>
          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-5">
            <Card className="col-span-full lg:col-span-4">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">Overview</h3>
                <Overview />
              </div>
            </Card>
            <Card className="col-span-full lg:col-span-3">
              <div className="p-6">
                <h3 className="text-lg font-medium mb-4">
                  Recent Transactions
                </h3>
                <RecentTransactions />
              </div>
            </Card>
          </div>
          {/* Additional Components */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            <UserStats />
            <div className="xl:col-span-2">
              <SecurityOverview />
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div
          className="grid grid-cols-1 xl:grid-cols-3 2xl:grid-cols-1 
        lg:col-span-3 2xl:col-span-1 
        gap-5"
        >
          <Setup2FA />
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
