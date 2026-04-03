"use client";

import { motion } from "framer-motion";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useAppSelector } from "@/lib/store/hooks";
import { selectMonthlyChartData } from "@/lib/store/transactionsSlice";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

function formatAmount(v: number) {
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}k`;
  return `$${v}`;
}

interface TooltipProps {
  active?: boolean;
  payload?: { value: number; name: string; color: string }[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-card px-3.5 py-2.5 shadow-xl shadow-black/10">
      <p className="mb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
        {label}
      </p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <span className="size-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}</span>
          <span className="ml-auto font-semibold tabular-nums">
            ${p.value.toLocaleString("en-US", { minimumFractionDigits: 0 })}
          </span>
        </div>
      ))}
    </div>
  );
}

export function StatisticsChart() {
  const data = useAppSelector(selectMonthlyChartData);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const axisColor = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";

  if (!mounted) {
    return <div className="h-64 rounded-2xl border border-border bg-card animate-pulse" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className="rounded-2xl border border-border bg-card p-5"
    >
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Statistics</h3>
          <p className="text-xs text-muted-foreground mt-0.5">12-month income vs expenses</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-chart-1 inline-block" />
            Income
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-chart-2 inline-block" />
            Expenses
          </span>
        </div>
      </div>

      <div style={{ width: "100%", minWidth: 0 }}>
        <ResponsiveContainer width="100%" height={220} debounce={60}>
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -8 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.18} />
                <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--chart-2)" stopOpacity={0.14} />
                <stop offset="95%" stopColor="var(--chart-2)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: axisColor }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={formatAmount}
              tick={{ fontSize: 11, fill: axisColor }}
              axisLine={false}
              tickLine={false}
              width={36}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: gridColor, strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="income"
              stroke="var(--chart-1)"
              strokeWidth={2}
              fill="url(#incomeGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "var(--chart-1)", strokeWidth: 0 }}
            />
            <Area
              type="monotone"
              dataKey="expense"
              stroke="var(--chart-2)"
              strokeWidth={2}
              fill="url(#expenseGrad)"
              dot={false}
              activeDot={{ r: 4, fill: "var(--chart-2)", strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border pt-4">
        <div>
          <p className="text-[11px] text-muted-foreground">Avg. Income</p>
          <p className="text-base font-semibold tabular-nums mt-0.5">
            ${(data.reduce((a, d) => a + d.income, 0) / data.length).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>
        <div>
          <p className="text-[11px] text-muted-foreground">Avg. Expenses</p>
          <p className="text-base font-semibold tabular-nums mt-0.5">
            ${(data.reduce((a, d) => a + d.expense, 0) / data.length).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
