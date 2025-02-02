"use client";

import { useEffect, useState } from "react";
import { Loader } from "@/components/ui/loader";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateTime } from "@/common/utils/format-date";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // PAGINATION CUSTOMIZATION
  // Adjust these values to change the pagination behavior
  const SHOW_FIRST_LAST = true; // Always show first and last page numbers
  const MAX_VISIBLE_PAGES = 1; // Maximum number of page numbers to show (excluding first and last)

  const renderPaginationItems = () => {
    const items = [];

    if (SHOW_FIRST_LAST && page > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      if (page > 2) items.push(<PaginationEllipsis key="ellipsis-start" />);
    }

    const start = Math.max(1, page - Math.floor(MAX_VISIBLE_PAGES / 2));
    const end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);

    for (let i = start; i <= end; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
            isActive={page === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (SHOW_FIRST_LAST && page < totalPages) {
      if (page < totalPages - 1)
        items.push(<PaginationEllipsis key="ellipsis-end" />);
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
  };

  return (
    <Card className="card col-span-2">
      <CardHeader>
        <CardTitle className="card-title">Recent Activity</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 min-h-[9.5em]">
        {loading && <Loader size="lg" className="pt-6" />}
        {!loading &&
          activities.length > 0 &&
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between text-sm"
            >
              <p>{activity.action}</p>
              <p>{formatDateTime(activity.timestamp)}</p>
            </div>
          ))}
      </CardContent>

      <CardFooter>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) handlePageChange(page - 1);
                }}
              />
            </PaginationItem>
            {renderPaginationItems()}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) handlePageChange(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
