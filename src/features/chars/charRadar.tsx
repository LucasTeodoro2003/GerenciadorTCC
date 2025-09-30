"use client"

import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

export const description = "A radar chart with dots"


const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig





interface ChartRadarDotsProps {
  servicesNames: Prisma.ServiceVehicleServiceGetPayload<{include:{service:{select:{description:true}},serviceVehicle:{select:{dateTime:true}}}}>[];
}




export function ChartRadarDots({servicesNames}:ChartRadarDotsProps) {
  function getMonthName(monthIndex: number) {
  return new Date(2025, monthIndex, 1).toLocaleString("pt-BR", { month: "long" });
}

  const counts = new Map<string, number>();

  servicesNames.forEach((item) => {
    const date = new Date(item.serviceVehicle.dateTime!);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    counts.set(key, (counts.get(key) || 0) + 1);
  });

  const chartData = Array.from(counts.entries())
    .map(([key, count]) => {
      const [year, monthIndex] = key.split("-").map(Number);
      return {
        month: getMonthName(monthIndex),
        desktop: count,
      };
    })
    .sort((a, b) => new Date(`2025 ${a.month}`).getTime() - new Date(`2025 ${b.month}`).getTime());


  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Serviços Mensais</CardTitle>
        <CardDescription>
          Serviços realizados mensalmente
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <PolarAngleAxis dataKey="month" />
            <PolarGrid />
            <Radar
              dataKey="desktop"
              fill="var(--color-desktop)"
              fillOpacity={0.6}
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
