"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils/format-date";
import GridLoader from "react-spinners/GridLoader";
import { useEffect, useState } from "react";

async function fetchActivityLogs(page = 1, limit = 4) {
  const response = await fetch(
    `/api/logs/get-activity?page=${page}&limit=${limit}`,
  );
  const data = await response.json();
  return data || { activities: [], totalPages: 1 };
}

export function RecentActivity() {
  const [activities, setActivities] = useState(
    [] as { id: number; action: string; timestamp: string }[],
  );
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  console.log(activities);

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

  const SHOW_FIRST_LAST = true;
  const MAX_VISIBLE_PAGES = 1;

  const renderPaginationItems = () => {
    const items = [];
    const start = Math.max(1, page - Math.floor(MAX_VISIBLE_PAGES / 2));
    const end = Math.min(totalPages, start + MAX_VISIBLE_PAGES - 1);

    if (SHOW_FIRST_LAST && start > 1) {
      items.push(
        <PaginationItem key="first">
          <PaginationLink
            size="xs"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );
      if (start > 2) items.push(<PaginationEllipsis key="ellipsis-start" />);
    }

    for (let i = start; i <= end; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            size="xs"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(i);
            }}
            isActive={page === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (SHOW_FIRST_LAST && end < totalPages) {
      if (end < totalPages - 1)
        items.push(<PaginationEllipsis key="ellipsis-end" />);
      items.push(
        <PaginationItem key="last">
          <PaginationLink
            size="xs"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-[9.5em] flex-col space-y-4">
        {/* TODO: TURN LOADING TO SKELETON */}
        {loading ? (
          <div className="flex h-full w-full flex-grow items-center justify-center">
            <GridLoader
              size={5}
              color="hsl(var(--tertiary))"
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        ) : (
          activities?.length > 0 &&
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between text-sm"
            >
              <p>{activity.action}</p>
              <p>{formatDateTime(activity.timestamp)}</p>
            </div>
          ))
        )}
      </CardContent>

      <CardFooter>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                size="xs"
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
                size="xs"
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
