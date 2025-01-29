"use client";

import { formatDateTime } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

async function fetchActivityLogs(page = 1, limit = 4) {
  const response = await fetch(
    `/api/logs/get-activity?page=${page}&limit=${limit}`
  );
  const data = await response.json();
  return data || { activities: [], totalPages: 1 };
}

export function RecentActivity() {
  const [activities, setActivities] = useState<
    { id: number; action: string; timestamp: string }[]
  >([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchActivityLogs(page)
      .then(({ activities, totalPages }) => {
        setActivities(activities);
        setTotalPages(totalPages);
      })
      .catch((error) => {
        console.error("Error fetching activity logs:", error);
        setActivities([]);
      });
  }, [page]);

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="bg-gray-900/80 backdrop-blur-md border border-gray-800 rounded-xl p-6 shadow-2xl">
      <h2 className="text-2xl font-bold text-blue-400 mb-6 font-jura">
        Recent Activity
      </h2>
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
      <div className="flex justify-between mt-6">
        <Button onClick={handlePrev} disabled={page === 1} variant="secondary">
          Previous
        </Button>
        <Button
          onClick={handleNext}
          disabled={page === totalPages}
          variant="secondary"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
