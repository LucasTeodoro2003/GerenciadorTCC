"use client"

import { TrendingUp } from "lucide-react"
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/ui/components/card"
import { ChartConfig, ChartContainer } from "@/shared/ui/components/chart"
import { Prisma } from "@prisma/client"

export const description = "A radial chart with a custom shape"

const chartConfig = {
  visitors: {
    label: "Serviços",
  },
  safari: {
    label: "Safari",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig


interface ChartRadialShapeProps {
  servicesNames: Prisma.ServiceVehicleServiceGetPayload<{include:{service:{select:{description:true}},serviceVehicle:{select:{dateTime:true}}}}>[];
}


export function ChartRadialShape({ servicesNames }: ChartRadialShapeProps) {
  const chartColorVars = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];
    const counts = new Map();

  servicesNames.forEach((item) => {
    const service = item.service.description;
    counts.set(service, (counts.get(service) || 0) + 1);
  });

  const chartData = Array.from(counts.entries()).map(([service, count], index) => ({
    browser: service,
    visitors: count,
    fill: chartColorVars[index % chartColorVars.length],
  }));

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total de Serviços</CardTitle>
        <CardDescription>Todos os serviços realizados</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={100}
            innerRadius={80}
            outerRadius={140}
          >
            <PolarGrid
              gridType="circle"
              radialLines={false}
              stroke="none"
              className="first:fill-muted last:fill-background"
              polarRadius={[86, 74]}
            />
            <RadialBar dataKey="visitors" background />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-4xl font-bold"
                        >
                          {chartData.reduce((total, item) => total + item.visitors, 0).toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Serviços
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
