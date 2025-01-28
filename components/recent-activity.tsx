"use client";

import { formatDateTime } from "@/lib/utils";
import { useEffect, useState } from "react";

async function fetchActivityLogs() {
  const response = await fetch("/api/logs/get-activity");
  const data = await response.json();
  return data.activities || [];
}

export function RecentActivity() {
  const [activities, setActivities] = useState<
    { id: number; action: string; timestamp: string }[]
  >([]);

  useEffect(() => {
    fetchActivityLogs()
      .then((activities) => setActivities(activities))
      .catch((error) => {
        console.error("Error fetching activity logs:", error);
        setActivities([]);
      });
  }, []);

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-blue-400 mb-6">Recent Activity</h2>
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex justify-between items-center p-4 bg-gray-800/50 rounded-lg"
            >
              <p className="text-gray-300">{activity.action}</p>
              <p className="text-gray-400 text-sm">
                {formatDateTime(activity.timestamp)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-400">No recent activities found.</p>
        )}
      </div>
    </div>
  );
}
