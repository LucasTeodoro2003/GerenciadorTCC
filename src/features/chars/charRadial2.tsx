"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/components/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/ui/components/chart";
import { Prisma } from "@prisma/client";

export const description = "A radial chart with stacked sections";

interface ChartRadialStackedProps {
  servicesNames: Prisma.ServiceVehicleServiceGetPayload<{
    include: {
      service: { select: { description: true } };
      serviceVehicle: { select: { dateTime: true } };
    };
  }>[];
}

export function ChartRadialStacked({ servicesNames }: ChartRadialStackedProps) {
  const counts = new Map();
  servicesNames.forEach((item) => {
    const service = item.service.description || "Outro";
    counts.set(service, (counts.get(service) || 0) + 1);
  });
  const chartData = [
    Object.fromEntries(counts.entries()) as Record<string, number>,
  ];
  const serviceColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
    "var(--chart-6)",
  ];

  const chartConfig: ChartConfig = {};
  Array.from(counts.keys()).forEach((service, i) => {
    chartConfig[service] = {
      label: service,
      color: serviceColors[i % serviceColors.length],
    };
  });

  const totalServices = Array.from(counts.values()).reduce(
    (acc, val) => acc + val,
    0
  );

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Total de Serviços</CardTitle>
        <CardDescription>Distribuição de todos os serviços realizados</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[280px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalServices.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Serviços
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>

            {Object.keys(chartData[0]).map((service, i) => (
              <RadialBar
                key={service}
                dataKey={service}
                stackId="a"
                cornerRadius={5}
                fill={serviceColors[i % serviceColors.length]}
                className="stroke-transparent stroke-2"
              />
            ))}
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
