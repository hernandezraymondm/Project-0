"use client";

import {
  UsersRound,
  ShoppingCart,
  ChartNoAxesCombined,
  TriangleAlert,
} from "lucide-react";
import { SecurityOverview } from "../../../components/dashboard/security-overview";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import FloatingIconCard from "@/components/reusable/floating-icon-card";
import { SalesAnalytics } from "@/components/dashboard/sales-analytics";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { ClientDateTimeDisplay } from "@/components/reusable/date-time";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Setup2FA } from "@/components/dashboard/setup-2fa";
import { UserStats } from "../_components/user-stats";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MdTimeline } from "react-icons/md";
import { useAuth } from "@/hooks/use-auth";
import { FaGithub } from "react-icons/fa";

export default function DashboardPage() {
  const { session, loading } = useAuth();

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-center gap-2">
          <span className="rounded-full bg-card p-3">
            <MdTimeline className="h-6 w-6" />
          </span>
          <h2 className="text-3xl tracking-tight">Overview</h2>
        </div>
        <div className="hidden flex-nowrap items-center justify-between gap-6 text-nowrap text-sm text-muted-foreground lg:flex">
          <ClientDateTimeDisplay showSeconds type="time" />
          <ClientDateTimeDisplay showSeconds type="date" />
        </div>
        <Button>
          <FaGithub className="mr-2 h-4 w-4" />
          <p className="hidden sm:inline">Star on GitHub</p>
        </Button>
      </div>
      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 gap-5 pt-4 lg:grid-cols-3 2xl:grid-cols-4">
        {/* Left Column */}
        <div className="space-y-5 lg:col-span-3">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-4">
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
              icon={ChartNoAxesCombined}
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
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-7">
            <Card className="col-span-full lg:col-span-4">
              <div className="p-6">
                <h3 className="mb-4 text-lg font-medium">Sales Analytics</h3>
                <SalesAnalytics />
              </div>
            </Card>
            <Card className="col-span-full lg:col-span-3">
              <div className="p-6">
                <h3 className="mb-4 text-lg font-medium">
                  Recent Transactions
                </h3>
                <RecentTransactions />
              </div>
            </Card>
          </div>
          {/* Additional Components */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-7">
            <div className="col-span-full lg:col-span-4">
              {/* <SecurityOverview /> */}
            </div>
            <div className="col-span-full lg:col-span-3">
              {/* <UserStats /> */}
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="grid grid-cols-1 gap-5 lg:col-span-3 xl:grid-cols-3 2xl:col-span-1 2xl:grid-cols-1">
          {/* <Setup2FA /> */}
          <QuickActions />
          {/* <RecentActivity /> */}
        </div>
      </div>
    </div>
  );
}
