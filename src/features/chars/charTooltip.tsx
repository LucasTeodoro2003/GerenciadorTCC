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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/ui/components/chart"
import { Prisma } from "@prisma/client"

interface ChartTooltipIndicatorLineProps {
  servicesNames: Prisma.ServiceVehicleServiceGetPayload<{
    include: {
      service: { select: { description: true } }
      serviceVehicle: { select: { dateTime: true } }
    }
  }>[]
}

export function ChartTooltipIndicatorLine({
  servicesNames,
}: ChartTooltipIndicatorLineProps) {
  const combinedMap = new Map()
  servicesNames.forEach((s) => {
    const date = s.serviceVehicle.dateTime
      ? new Date(s.serviceVehicle.dateTime).toISOString().split("T")[0]
      : null
    const serviceName = s.service.description

    if (!date || !serviceName) return

    if (!combinedMap.has(date)) {
      combinedMap.set(date, { date })
    }

    const entry = combinedMap.get(date)!
    entry[serviceName] = (entry[serviceName] || 0) + 1
  })

  const chartData = Array.from(combinedMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )
  const serviceKeys = Array.from(
    new Set(
      chartData.flatMap((item) =>
        Object.keys(item).filter((key) => key !== "date")
      )
    )
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Serviços Diários</CardTitle>
        <CardDescription>Serviços realizados diariamente</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={Object.fromEntries(
            serviceKeys.map((key, i) => [
              key,
              {
                label: key,
                color: `var(--chart-${(i % 5) + 1})`,
              },
            ])
          )}
        >
          <BarChart data={chartData}>
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("pt-BR", {
                  weekday: "short",
                })
              }
            />
            {serviceKeys.map((key, i) => (
              <Bar
                key={key}
                dataKey={key}
                stackId="a"
                fill={`var(--chart-${(i % 5) + 1})`}
              />
            ))}
            <ChartTooltip
              content={<ChartTooltipContent indicator="line" />}
              cursor={false}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
