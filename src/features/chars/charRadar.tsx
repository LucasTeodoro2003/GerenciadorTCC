"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

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

export const description = "A radar chart with dots"

const chartConfig = {
  desktop: {
    label: "Serviços",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

interface ChartRadarDotsProps {
  servicesNames: Prisma.ServiceVehicleServiceGetPayload<{
    include: {
      service: { select: { description: true } }
      serviceVehicle: { select: { dateTime: true } }
    }
  }>[]
}

export function ChartRadarDots({ servicesNames }: ChartRadarDotsProps) {
  function getMonthName(monthIndex: number) {
    return new Date(2025, monthIndex, 1).toLocaleString("pt-BR", {
      month: "long",
    })
  }
  const monthlyCounts = new Array(12).fill(0)

  servicesNames.forEach((item) => {
    const date = new Date(item.serviceVehicle.dateTime!)
    const monthIndex = date.getMonth()
    monthlyCounts[monthIndex]++
  })
  const chartData = monthlyCounts.map((count, monthIndex) => ({
    month: getMonthName(monthIndex),
    desktop: count,
  }))

  return (
    <Card>
      <CardHeader className="items-center">
        <CardTitle>Serviços Mensais</CardTitle>
        <CardDescription>Serviços realizados mensalmente</CardDescription>
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
