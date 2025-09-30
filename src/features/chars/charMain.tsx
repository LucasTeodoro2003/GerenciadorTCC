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

const chartData = [
  { date: "2024-04-01", receita: 222, despesas: 150 },
  { date: "2024-04-02", receita: 97, despesas: 180 },
  { date: "2024-04-03", receita: 167, despesas: 120 },
  { date: "2024-04-04", receita: 242, despesas: 260 },
  { date: "2024-04-05", receita: 373, despesas: 290 },
  { date: "2024-04-06", receita: 301, despesas: 340 },
  { date: "2024-04-07", receita: 245, despesas: 180 },
  { date: "2024-04-08", receita: 409, despesas: 320 },
  { date: "2024-04-09", receita: 59, despesas: 110 },
  { date: "2024-04-10", receita: 261, despesas: 190 },
  { date: "2024-04-11", receita: 327, despesas: 350 },
  { date: "2024-04-12", receita: 292, despesas: 210 },
  { date: "2024-04-13", receita: 342, despesas: 380 },
  { date: "2024-04-14", receita: 137, despesas: 220 },
  { date: "2024-04-15", receita: 120, despesas: 170 },
  { date: "2024-04-16", receita: 138, despesas: 190 },
  { date: "2024-04-17", receita: 446, despesas: 360 },
  { date: "2024-04-18", receita: 364, despesas: 410 },
  { date: "2024-04-19", receita: 243, despesas: 180 },
  { date: "2024-04-20", receita: 89, despesas: 150 },
  { date: "2024-04-21", receita: 137, despesas: 200 },
  { date: "2024-04-22", receita: 224, despesas: 170 },
  { date: "2024-04-23", receita: 138, despesas: 230 },
  { date: "2024-04-24", receita: 387, despesas: 290 },
  { date: "2024-04-25", receita: 215, despesas: 250 },
  { date: "2024-04-26", receita: 75, despesas: 130 },
  { date: "2024-04-27", receita: 383, despesas: 420 },
  { date: "2024-04-28", receita: 122, despesas: 180 },
  { date: "2024-04-29", receita: 315, despesas: 240 },
  { date: "2024-04-30", receita: 454, despesas: 380 },
  { date: "2024-05-01", receita: 165, despesas: 220 },
  { date: "2024-05-02", receita: 293, despesas: 310 },
  { date: "2024-05-03", receita: 247, despesas: 190 },
  { date: "2024-05-04", receita: 385, despesas: 420 },
  { date: "2024-05-05", receita: 481, despesas: 390 },
  { date: "2024-05-06", receita: 498, despesas: 520 },
  { date: "2024-05-07", receita: 388, despesas: 300 },
  { date: "2024-05-08", receita: 149, despesas: 210 },
  { date: "2024-05-09", receita: 227, despesas: 180 },
  { date: "2024-05-10", receita: 293, despesas: 330 },
  { date: "2024-05-11", receita: 335, despesas: 270 },
  { date: "2024-05-12", receita: 197, despesas: 240 },
  { date: "2024-05-13", receita: 197, despesas: 160 },
  { date: "2024-05-14", receita: 448, despesas: 490 },
  { date: "2024-05-15", receita: 473, despesas: 380 },
  { date: "2024-05-16", receita: 338, despesas: 400 },
  { date: "2024-05-17", receita: 499, despesas: 420 },
  { date: "2024-05-18", receita: 315, despesas: 350 },
  { date: "2024-05-19", receita: 235, despesas: 180 },
  { date: "2024-05-20", receita: 177, despesas: 230 },
  { date: "2024-05-21", receita: 82, despesas: 140 },
  { date: "2024-05-22", receita: 81, despesas: 120 },
  { date: "2024-05-23", receita: 252, despesas: 290 },
  { date: "2024-05-24", receita: 294, despesas: 220 },
  { date: "2024-05-25", receita: 201, despesas: 250 },
  { date: "2024-05-26", receita: 213, despesas: 170 },
  { date: "2024-05-27", receita: 420, despesas: 460 },
  { date: "2024-05-28", receita: 233, despesas: 190 },
  { date: "2024-05-29", receita: 78, despesas: 130 },
  { date: "2024-05-30", receita: 340, despesas: 280 },
  { date: "2024-05-31", receita: 178, despesas: 230 },
  { date: "2024-06-01", receita: 178, despesas: 200 },
  { date: "2024-06-02", receita: 470, despesas: 410 },
  { date: "2024-06-03", receita: 103, despesas: 160 },
  { date: "2024-06-04", receita: 439, despesas: 380 },
  { date: "2024-06-05", receita: 88, despesas: 140 },
  { date: "2024-06-06", receita: 294, despesas: 250 },
  { date: "2024-06-07", receita: 323, despesas: 370 },
  { date: "2024-06-08", receita: 385, despesas: 320 },
  { date: "2024-06-09", receita: 438, despesas: 480 },
  { date: "2024-06-10", receita: 155, despesas: 200 },
  { date: "2024-06-11", receita: 92, despesas: 150 },
  { date: "2024-06-12", receita: 492, despesas: 420 },
  { date: "2024-06-13", receita: 81, despesas: 130 },
  { date: "2024-06-14", receita: 426, despesas: 380 },
  { date: "2024-06-15", receita: 307, despesas: 350 },
  { date: "2024-06-16", receita: 371, despesas: 310 },
  { date: "2024-06-17", receita: 475, despesas: 520 },
  { date: "2024-06-18", receita: 107, despesas: 170 },
  { date: "2024-06-19", receita: 341, despesas: 290 },
  { date: "2024-06-20", receita: 408, despesas: 450 },
  { date: "2024-06-21", receita: 169, despesas: 210 },
  { date: "2024-06-22", receita: 317, despesas: 270 },
  { date: "2024-06-23", receita: 480, despesas: 530 },
  { date: "2024-06-24", receita: 132, despesas: 180 },
  { date: "2024-06-25", receita: 141, despesas: 190 },
  { date: "2024-06-26", receita: 434, despesas: 380 },
  { date: "2024-06-27", receita: 448, despesas: 490 },
  { date: "2024-06-28", receita: 149, despesas: 200 },
  { date: "2024-06-29", receita: 103, despesas: 160 },
  { date: "2024-06-30", receita: 446, despesas: 400 },
];

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
