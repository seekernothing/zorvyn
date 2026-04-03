"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useAppSelector } from "@/lib/store/hooks";
import { selectMonthlyChartData, selectCategoryBreakdown } from "@/lib/store/transactionsSlice";
import { CATEGORY_COLORS } from "@/lib/data/mock";
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
          <span className="ml-2 font-semibold tabular-nums">
            ${p.value.toLocaleString("en-US", { minimumFractionDigits: 0 })}
          </span>
        </div>
      ))}
    </div>
  );
}

function CategoryTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-xl text-xs">
      <p className="font-semibold">{p.name}</p>
      <p className="text-muted-foreground mt-0.5">
        ${p.value.toLocaleString("en-US", { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}

export function AnalyticsTab() {
  const monthly = useAppSelector(selectMonthlyChartData);
  const breakdown = useAppSelector(selectCategoryBreakdown);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme === "dark";
  const gridColor = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)";
  const axisColor = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)";

  const top8 = breakdown.slice(0, 8);

  if (!mounted)
    return <div className="h-96 rounded-2xl border border-border bg-card animate-pulse" />;

  return (
    <div className="space-y-6">
      {/* Monthly comparison bar chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <div className="mb-5">
          <h3 className="text-sm font-semibold">Monthly Comparison</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Side-by-side income and expense for the last 12 months
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-chart-1 inline-block" />
            Income
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-chart-2 inline-block" />
            Expenses
          </span>
        </div>
        <div style={{ width: "100%", minWidth: 0 }}>
        <ResponsiveContainer width="100%" height={240} debounce={60}>
          <BarChart data={monthly} margin={{ top: 4, right: 4, bottom: 0, left: -8 }} barGap={3}>
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
            <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }} />
            <Bar dataKey="income" fill="var(--chart-1)" radius={[4, 4, 0, 0]} maxBarSize={20} />
            <Bar dataKey="expense" fill="var(--chart-2)" radius={[4, 4, 0, 0]} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Category spending horizontal bars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
        className="rounded-2xl border border-border bg-card p-5"
      >
        <div className="mb-5">
          <h3 className="text-sm font-semibold">Spending by Category</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            All-time expense distribution
          </p>
        </div>
        <div style={{ width: "100%", minWidth: 0 }}>
        <ResponsiveContainer width="100%" height={top8.length * 38} debounce={60}>
          <BarChart
            data={top8}
            layout="vertical"
            margin={{ top: 0, right: 60, bottom: 0, left: 4 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={formatAmount}
              tick={{ fontSize: 11, fill: axisColor }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="category"
              tick={{ fontSize: 11, fill: axisColor }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip content={<CategoryTooltip />} cursor={{ fill: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)" }} />
            <Bar dataKey="amount" radius={[0, 6, 6, 0]} maxBarSize={16}>
              {top8.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={CATEGORY_COLORS[entry.category] ?? "var(--muted-foreground)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}
