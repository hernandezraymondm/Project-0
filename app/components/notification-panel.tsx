import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function NotificationsPanel() {
  return (
    <Card className="card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="card-title">Notifications</CardTitle>
        <button className="text-primary hover:text-primary/50">View All</button>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <div className="flex items-center gap-3 p-1 hover:bg-accent/10 rounded-lg">
          <div className="h-2 w-2 bg-blue-500 rounded-full" />
          <span>New user registered 2 hours ago</span>
        </div>
        <div className="flex items-center gap-3 p-1 hover:bg-accent/10 rounded-lg">
          <div className="h-2 w-2 bg-green-500 rounded-full" />
          <span>System update completed successfully</span>
        </div>
      </CardContent>
    </Card>
  );
}
