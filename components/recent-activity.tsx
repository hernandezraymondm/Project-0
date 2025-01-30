"use client";

import { formatDateTime } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/ui/loader";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";

async function fetchActivityLogs(page = 1, limit = 2) {
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchActivityLogs(page)
      .then(({ activities, totalPages }) => {
        setActivities(activities);
        setTotalPages(totalPages);
      })
      .catch((error) => {
        console.error("Error fetching activity logs:", error);
        setActivities([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page]);

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <Card className="card">
      <CardHeader>
        <CardTitle className="card-title">Recent Activity</CardTitle>
      </CardHeader>
      {loading && <Loader size="lg" />}
      {!loading && (
        <CardContent className="space-y-4">
          {activities.length > 0 ? (
            activities.map((activity) => (
              <div key={activity.id} className="card-content text-sm">
                <p className="text-gray-300">{activity.action}</p>
                <p className="text-gray-400 text-xs">
                  {formatDateTime(activity.timestamp)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No recent activities found.</p>
          )}
        </CardContent>
      )}

      <CardFooter className="flex justify-between mt-6">
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
      </CardFooter>
    </Card>
  );
}
