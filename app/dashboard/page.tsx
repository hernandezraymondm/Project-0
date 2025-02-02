import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import {
  BarChartIcon as ChartSpline,
  CircleAlert,
  ShoppingCart,
  UsersRound,
} from "lucide-react";
import { MdTimeline } from "react-icons/md";
import { Overview } from "@/components/dashboard/overview";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { Badge } from "@/components/ui/badge";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Setup2FA } from "@/components/dashboard/setup-2fa";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { JSX } from "react";
import { UserStats } from "../components/user-stats";
import { SecurityOverview } from "../components/security-overview";
import { DateTimeDisplay } from "@/components/date-time-display";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-0">
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
          Star on GitHub
        </Button>
      </div>
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Left Column */}
        <div className="lg:col-span-3 space-y-5">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatsCard
              title="Clients"
              value="512"
              change="12%"
              changeType="increase"
              icon={<UsersRound className="text-emerald-400" strokeWidth={3} />}
            />
            <StatsCard
              title="Sales"
              value="$7,770"
              change="12%"
              changeType="decrease"
              icon={<ShoppingCart className="text-sky-400" strokeWidth={3} />}
            />
            <StatsCard
              title="Performance"
              value="256"
              change="Overflow"
              changeType="neutral"
              icon={<ChartSpline className="text-purple-400" strokeWidth={3} />}
            />
            <StatsCard
              title="Alerts"
              value="24"
              change="Last 24 Hours"
              changeType="neutral"
              icon={<CircleAlert className="text-amber-400" strokeWidth={3} />}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <UserStats />
            <SecurityOverview />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-1 space-y-5">
          <Setup2FA />
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}

type ChangeType = "increase" | "decrease" | "neutral" | "Overflow";

function StatsCard({
  title,
  value,
  change,
  changeType,
  icon,
}: {
  title: string;
  value: string;
  change: string;
  changeType: ChangeType;
  icon: JSX.Element;
}) {
  const badgeColor = {
    increase: "bg-emerald-400",
    decrease: "bg-red-400",
    neutral: changeType === "Overflow" ? "bg-purple-400" : "bg-amber-400",
  }[changeType as "increase" | "decrease" | "neutral"];

  const changePrefix =
    changeType === "increase" ? "↑" : changeType === "decrease" ? "↓" : "";

  return (
    <Card className="p-6">
      <div className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Badge className={`${badgeColor} rounded-full`}>
          <span className="text-xs">{`${changePrefix} ${change}`}</span>
        </Badge>
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      </div>
      <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-2">
        <span className="text-2xl font-bold">{value}</span>
        {icon}
      </div>
    </Card>
  );
}
