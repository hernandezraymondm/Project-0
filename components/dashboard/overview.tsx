"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  {
    name: "Jan",
    revenue: 10400,
    subscription: 240,
  },
  {
    name: "Feb",
    revenue: 14405,
    subscription: 300,
  },
  {
    name: "Mar",
    revenue: 9400,
    subscription: 200,
  },
  {
    name: "Apr",
    revenue: 8200,
    subscription: 278,
  },
  {
    name: "May",
    revenue: 7000,
    subscription: 189,
  },
  {
    name: "Jun",
    revenue: 9600,
    subscription: 239,
  },
  {
    name: "Jul",
    revenue: 11244,
    subscription: 278,
  },
  {
    name: "Aug",
    revenue: 12988,
    subscription: 348,
  },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 10,
          left: 10,
          bottom: 0,
        }}
      >
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Revenue
                      </span>
                      <span className="font-bold text-muted-foreground">
                        ${payload[0].value}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Subscription
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {payload[1].value}
                      </span>
                    </div>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Line
          type="monotone"
          dataKey="revenue"
          stroke="#2563eb"
          strokeWidth={2}
          activeDot={{
            r: 6,
            style: { fill: "#2563eb", opacity: 0.25 },
          }}
        />
        <Line
          type="monotone"
          dataKey="subscription"
          stroke="#16a34a"
          strokeWidth={2}
          activeDot={{
            r: 6,
            style: { fill: "#16a34a", opacity: 0.25 },
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
