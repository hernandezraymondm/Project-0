import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaGithub } from "react-icons/fa";
import {
  ChartSpline,
  CircleAlert,
  ShoppingCart,
  UsersRound,
} from "lucide-react";
import { MdTimeline } from "react-icons/md";
import { Overview } from "@/components/dashboard/overview";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { Header } from "@/components/header/header";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex justify-center items-center gap-2">
            <span className="rounded-full bg-card p-3">
              <MdTimeline className="h-6 w-6" />
            </span>
            <h2 className="text-3xl tracking-tight">Overview</h2>
          </div>
          <Button className="rounded-full">
            <FaGithub className="mr-2 h-4 w-4" />
            Star on GitHub
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Badge className="bg-emerald-400 rounded-full">
                <span className="text-xs text-primary">↑ 12%</span>
              </Badge>
              <h3 className="text-sm font-medium text-muted-foreground">
                Clients
              </h3>
            </div>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-2">
              <span className="text-2xl font-bold">512</span>
              <UsersRound className="text-emerald-400" strokeWidth={3} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Badge className="bg-red-400 rounded-full">
                <span className="text-xs text-primary">↓ 12%</span>
              </Badge>
              <h3 className="text-sm font-medium text-muted-foreground">
                Sales
              </h3>
            </div>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-2">
              <span className="text-2xl font-bold">$7,770</span>
              <ShoppingCart className="text-sky-400" strokeWidth={3} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Badge className="bg-purple-400 rounded-full">
                <span className="text-xs text-primary">Overflow</span>
              </Badge>
              <h3 className="text-sm font-medium text-muted-foreground">
                Performance
              </h3>
            </div>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-2">
              <span className="text-2xl font-bold">256</span>
              <ChartSpline className="text-purple-400" strokeWidth={3} />
            </div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Badge className="bg-amber-400 rounded-full">
                <span className="text-xs text-primary">Last 24 Hours</span>
              </Badge>
              <h3 className="text-sm font-medium text-muted-foreground">
                Alerts
              </h3>
            </div>
            <div className="flex flex-row items-center justify-between space-y-0 pb-2 px-2">
              <span className="text-2xl font-bold">24</span>
              <CircleAlert className="text-amber-400" strokeWidth={3} />
            </div>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Overview</h3>
              </div>
              <Overview />
            </div>
          </Card>
          <Card className="col-span-3">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Recent Transactions</h3>
              </div>
              <RecentTransactions />
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
