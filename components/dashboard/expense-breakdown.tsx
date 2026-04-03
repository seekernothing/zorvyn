"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useAppSelector } from "@/lib/store/hooks";
import { selectCategoryBreakdown } from "@/lib/store/transactionsSlice";
import { CATEGORY_COLORS } from "@/lib/data/mock";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface TooltipProps {
  active?: boolean;
  payload?: { name: string; value: number; payload: { percentage: number } }[];
}

function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;
  const p = payload[0];
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2 shadow-xl shadow-black/10 text-xs">
      <p className="font-semibold">{p.name}</p>
      <p className="text-muted-foreground mt-0.5">
        ${p.value.toLocaleString("en-US", { minimumFractionDigits: 2 })} · {p.payload.percentage}%
      </p>
    </div>
  );
}

export function ExpenseBreakdown() {
  const breakdown = useAppSelector(selectCategoryBreakdown);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const top5 = breakdown.slice(0, 5);

  if (!mounted) {
    return (
      <div className="h-full rounded-2xl border border-border bg-card animate-pulse" />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      className="flex flex-col rounded-2xl border border-border bg-card p-5"
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold">Expense Breakdown</h3>
        <p className="text-xs text-muted-foreground mt-0.5">By category</p>
      </div>

      {/* Donut chart */}
      <div className="relative mx-auto h-44 w-44 shrink-0">
        <ResponsiveContainer width="100%" height="100%" debounce={60}>
          <PieChart>
            <Pie
              data={top5}
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={3}
              dataKey="amount"
              nameKey="category"
              strokeWidth={0}
              startAngle={90}
              endAngle={-270}
            >
              {top5.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={CATEGORY_COLORS[entry.category] ?? "var(--muted-foreground)"}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-[10px] text-muted-foreground">Total</p>
          <p className="text-sm font-bold tabular-nums">
            ${breakdown.reduce((a, b) => a + b.amount, 0).toLocaleString("en-US", {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 space-y-2.5">
        {top5.map((item, i) => (
          <motion.div
            key={item.category}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.06 }}
            className="flex items-center gap-2.5"
          >
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ background: CATEGORY_COLORS[item.category] ?? "var(--muted-foreground)" }}
            />
            <span className="flex-1 text-xs text-muted-foreground truncate">
              {item.category}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ delay: 0.6 + i * 0.06, duration: 0.6 }}
                  className="h-full rounded-full"
                  style={{ background: CATEGORY_COLORS[item.category] ?? "var(--muted-foreground)" }}
                />
              </div>
              <span className="text-xs font-semibold tabular-nums w-7 text-right">
                {item.percentage}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
