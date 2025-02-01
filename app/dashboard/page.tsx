import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { Overview } from "@/components/dashboard/overview";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { Header } from "@/components/dashboard/header";

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
          <Button>
            <Star className="mr-2 h-4 w-4" />
            Star on GitHub
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Clients</h3>
              <span className="text-xs text-emerald-500">↑ 12%</span>
            </div>
            <div className="text-2xl font-bold">512</div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Sales</h3>
              <span className="text-xs text-red-500">↓ 12%</span>
            </div>
            <div className="text-2xl font-bold">$7,770</div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Performance</h3>
              <span className="text-xs text-amber-500">Overflow</span>
            </div>
            <div className="text-2xl font-bold">256%</div>
          </Card>
          <Card className="p-6">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Alerts</h3>
              <span className="text-xs text-blue-500">Last 24 Hours</span>
            </div>
            <div className="text-2xl font-bold">24</div>
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
