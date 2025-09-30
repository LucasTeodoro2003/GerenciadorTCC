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

function isDateOnlyString(s: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(s);
}

function parseToDate(input: string | Date | undefined | null): Date | null {
  if (!input) return null;
  if (input instanceof Date) {
    if (Number.isNaN(input.getTime())) return null;
    return input;
  }
  const s = String(input).trim();
  if (isDateOnlyString(s)) {
    const [y, m, d] = s.split("-").map((v) => Number(v));
    return new Date(y, m - 1, d);
  }
  const parsed = new Date(s);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function toNumber(val: string | number | undefined | null): number {
  if (val == null) return 0;
  if (typeof val === "number") return val;
  const s = String(val).trim();
  const n = Number(s);
  if (!Number.isNaN(n)) return n;
  const alt = Number(s.replace(/\./g, "").replace(",", "."));
  if (!Number.isNaN(alt)) return alt;
  return 0;
}

function formatDateKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function dateFromKey(key: string) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function ChartAreaInteractive({
  revenue,
  expense,
  services,
}: ChartAreaInteractiveProps) {
  const chartData = React.useMemo(() => {
    const map = new Map<
      string,
      { date: string; receita: number; despesas: number }
    >();

    const add = (
      rawDate: string | Date | null | undefined,
      receita = 0,
      despesas = 0
    ) => {
      const dt = parseToDate(rawDate);
      if (!dt) return;
      const key = formatDateKey(dt);
      const cur = map.get(key) ?? { date: key, receita: 0, despesas: 0 };
      cur.receita += receita;
      cur.despesas += despesas;
      map.set(key, cur);
    };

    (expense || []).forEach((e) => {
      add(e.date, toNumber(e.amount), 0);
    });

    (services || []).forEach((s) => {
      add(s.dateTime ?? null, toNumber(s.totalValue), 0);
    });
    (revenue || []).forEach((r) => {
      add(r.date, 0, toNumber(r.amount));
    });

    const arr = Array.from(map.values()).sort(
      (a, b) => dateFromKey(a.date).getTime() - dateFromKey(b.date).getTime()
    );
    return arr.map((it) => ({
      date: it.date,
      receita: Math.round((it.receita + Number.EPSILON) * 100) / 100,
      despesas: Math.round((it.despesas + Number.EPSILON) * 100) / 100,
    }));
  }, [revenue, expense, services]);

  const [timeRange, setTimeRange] = React.useState("90d");

  const filteredData = React.useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
    const now = new Date();
    const referenceDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    return chartData.filter((item) => {
      const itemDate = dateFromKey(item.date);
      return itemDate.getTime() >= startDate.getTime();
    });
  }, [chartData, timeRange]);

  console.log("Despesas: ",chartData);
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
                const [y, m, d] = String(value).split("-").map(Number);
                const date = new Date(y, m - 1, d);
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
                    const [y, m, d] = String(value).split("-").map(Number);
                    const date = new Date(y, m - 1, d);
                    return date.toLocaleDateString("pt-BR", {
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
