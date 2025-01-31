"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveLine } from "@nivo/line";
import { useTheme } from "next-themes";

const data = [
  {
    id: "Sales",
    data: [
      { x: "Jan", y: 4000 },
      { x: "Feb", y: 3000 },
      { x: "Mar", y: 2000 },
      { x: "Apr", y: 2780 },
      { x: "May", y: 1890 },
      { x: "Jun", y: 2390 },
      { x: "Jul", y: 3490 },
      { x: "Aug", y: 3000 },
      { x: "Sep", y: 2700 },
      { x: "Oct", y: 3200 },
      { x: "Nov", y: 4100 },
      { x: "Dec", y: 4500 },
    ],
  },
  {
    id: "Target",
    data: [
      { x: "Jan", y: 2400 },
      { x: "Feb", y: 2210 },
      { x: "Mar", y: 2290 },
      { x: "Apr", y: 2000 },
      { x: "May", y: 2181 },
      { x: "Jun", y: 2500 },
      { x: "Jul", y: 2100 },
      { x: "Aug", y: 2400 },
      { x: "Sep", y: 2600 },
      { x: "Oct", y: 2900 },
      { x: "Nov", y: 3000 },
      { x: "Dec", y: 3300 },
    ],
  },
];

export function SalesAnalytics() {
  const { theme } = useTheme();

  return (
    <Card className="card">
      <CardHeader>
        <CardTitle className="card-title">Sales Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height: 330 }}>
          <ResponsiveLine
            data={data}
            margin={{ top: 10, right: 15, bottom: 50, left: 50 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              clamp: true, // added
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-$.2f"
            curve="natural"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: "", // Month
              legendOffset: 36,
              legendPosition: "middle",
            }}
            axisLeft={{
              tickValues: 5, // added
              tickSize: 0,
              tickPadding: 5,
              tickRotation: 0,
              legend: "", // Amount
              legendOffset: -40,
              legendPosition: "middle",
            }}
            enableGridX={false}
            gridYValues="1"
            lineWidth={1}
            colors={{ scheme: "category10" }}
            pointSize={6}
            pointColor={{ from: "color", modifiers: [] }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            enableArea={true}
            // areaBaselineValue={2000}
            areaOpacity={0.1}
            theme={{
              axis: {
                ticks: {
                  text: {
                    fill: theme === "dark" ? "#ffffff" : "#000000",
                  },
                },
                legend: {
                  text: {
                    fill: theme === "dark" ? "#ffffff" : "#000000",
                  },
                },
              },
              legends: {
                text: {
                  fill: theme === "dark" ? "#ffffff" : "#000000",
                },
              },
              tooltip: {
                container: {
                  background: theme === "dark" ? "#333" : "#fff",
                  color: theme === "dark" ? "#fff" : "#333",
                },
              },
            }}
            legends={[
              {
                anchor: "top",
                direction: "row",
                justify: false,
                translateX: 0,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: "left-to-right",
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 18,
                symbolShape: "circle",
                symbolBorderColor: "rgba(0, 0, 0, .5)",
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemBackground: "rgba(0, 0, 0, .03)",
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </div>
      </CardContent>
    </Card>
  );
}
