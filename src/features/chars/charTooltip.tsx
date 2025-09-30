"use client"

import { Bar, BarChart, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/components/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/ui/components/chart"
import { Prisma } from "@prisma/client"

export const description = "A stacked bar chart with a legend"
export const iframeHeight = "600px"
export const containerClassName =
  "[&>div]:w-full [&>div]:max-w-md flex items-center justify-center min-h-svh"


const chartConfig = {
  running: {
    label: "Running",
    color: "var(--chart-1)",
  },
  swimming: {
    label: "Swimming",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig


interface ChartTooltipIndicatorLineProps {
  servicesNames: Prisma.ServiceVehicleServiceGetPayload<{include:{service:{select:{description:true}},serviceVehicle:{select:{dateTime:true}}}}>[];
}

export function ChartTooltipIndicatorLine({servicesNames}:ChartTooltipIndicatorLineProps) {
  const combinedMap = new Map();

  servicesNames.forEach((s) => {
  const date = s.serviceVehicle.dateTime ? new Date(s.serviceVehicle.dateTime).toISOString().split("T")[0] : null;
  const serviceName = s.service.description;

  if (!date || !serviceName) return;

  if (!combinedMap.has(date)) {
    combinedMap.set(date, { date });
  }

  const entry = combinedMap.get(date)!;
  entry[serviceName] = (entry[serviceName] || 0) + 1;
});

const chartData = Array.from(combinedMap.values()).sort(
  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
);

console.log("GRAFICO COISAS DIARIAS: ", chartData);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços Diários</CardTitle>
        <CardDescription>Serviços realizados diariamente</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                })
              }}
            />
            <Bar
              dataKey="running"
              stackId="a"
              fill="var(--color-running)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="swimming"
              stackId="a"
              fill="var(--color-swimming)"
              radius={[4, 4, 0, 0]}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
              cursor={false}
              defaultIndex={1}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
