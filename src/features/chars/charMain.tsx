"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/shared/ui/components/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/components/select";
import { Prisma, Revenue } from "@prisma/client";

export const description = "An interactive area chart";


const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  receita: {
    label: "Receitas",
    color: "var(--chart-1)",
  },
  despesas: {
    label: "Despesas",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

interface ChartAreaInteractiveProps {
  revenue: Revenue[];
  expense: Prisma.ExpenseGetPayload<{ select: { date: true; amount: true } }>[];
  services: Prisma.ServiceVehicleGetPayload<{
    select: { dateTime: true; totalValue: true };
  }>[];
}

export function ChartAreaInteractive({ revenue, expense, services }: ChartAreaInteractiveProps) {
    const receitas = [
  ...expense.map((e) => ({
    date: e.date, 
    receita: Number(e.amount),
    despesas: 0,
  })),
  ...services.map((s) => ({
    date: s.dateTime ? s.dateTime.toISOString().split("T")[0] : null,
    receita: Number(s.totalValue),
    despesas: 0,
  })).filter((s) => s.date !== null),
];

const despesas = revenue.map((r) => ({
  date: r.date.toISOString().split("T")[0],
  receita: 0,
  despesas: Number(r.amount),
}));

const combinedMap = new Map();

[...receitas, ...despesas].forEach((item) => {
  if (!combinedMap.has(item.date)) {
    combinedMap.set(item.date, { date: item.date, receita: 0, despesas: 0 });
  }
  const entry = combinedMap.get(item.date);
  entry.receita += item.receita;
  entry.despesas += item.despesas;
});

const chartData = Array.from(combinedMap.values()).sort(
  (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
);

console.log("Teste", chartData);








  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Despesas x Receitas</CardTitle>
          <CardDescription>Relação entre despesas e receitas</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="3 Meses" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              3 Meses
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              30 dias
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              7 dias
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillreceita" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-receita)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-receita)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="filldespesas" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-despesas)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-despesas)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("pt-BR", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="despesas"
              type="natural"
              fill="url(#filldespesas)"
              stroke="var(--color-despesas)"
              stackId="a"
            />
            <Area
              dataKey="receita"
              type="natural"
              fill="url(#fillreceita)"
              stroke="var(--color-receita)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
