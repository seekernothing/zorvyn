"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Flame, Sparkles, Target, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";
import { selectInsights } from "@/lib/store/transactionsSlice";
import { CATEGORY_COLORS } from "@/lib/data/mock";
import { cn } from "@/lib/utils";
import type { MouseEvent } from "react";

// cursor-following radial glow — aceternity style
function SpotlightCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  }
  function handleMouseLeave() {
    x.set(-999);
    y.set(-999);
  }

  const background = useTransform(
    [springX, springY],
    ([lx, ly]) =>
      `radial-gradient(200px circle at ${lx}px ${ly}px, var(--brand-muted), transparent 80%)`
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-card p-5",
        "transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30",
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

function SavingsGauge({ rate }: { rate: number }) {
  const clamped = Math.min(100, Math.max(0, rate));
  const color =
    clamped >= 20 ? "var(--positive)" : clamped >= 10 ? "var(--warning)" : "var(--negative)";

  return (
    <div className="mt-4">
      <div className="flex items-end justify-between mb-1.5">
        <span className="text-[11px] text-muted-foreground">Savings rate</span>
        <span className="text-sm font-bold tabular-nums" style={{ color }}>
          {clamped}%
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ delay: 0.8, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>0%</span>
        <span>20% target</span>
        <span>100%</span>
      </div>
    </div>
  );
}

export function InsightsSection() {
  const insights = useAppSelector(selectInsights);

  const expenseDir = insights.expenseChange >= 0 ? "up" : "down";
  const incomeDir = insights.incomeChange >= 0 ? "up" : "down";

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-base font-semibold">Insights</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Key observations from your financial activity
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <SpotlightCard delay={0.3}>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex size-8 items-center justify-center rounded-xl bg-negative-muted">
              <Flame className="size-4 text-negative" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Top Spending
            </span>
          </div>
          {insights.topCategory ? (
            <>
              <p className="text-xl font-bold tracking-tight">{insights.topCategory.category}</p>
              <p className="text-sm font-semibold tabular-nums text-negative mt-1">
                ${insights.topCategory.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </p>
              <div className="mt-3 flex items-center gap-1.5">
                <span
                  className="size-2 rounded-full"
                  style={{ background: CATEGORY_COLORS[insights.topCategory.category] ?? "var(--muted-foreground)" }}
                />
                <span className="text-xs text-muted-foreground">
                  {insights.topCategory.percentage}% of total expenses
                </span>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No data yet</p>
          )}
        </SpotlightCard>

        <SpotlightCard delay={0.38}>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex size-8 items-center justify-center rounded-xl bg-info/10">
              <Sparkles className="size-4 text-info" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Month vs Month
            </span>
          </div>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Income</span>
              <span
                className={cn(
                  "flex items-center gap-0.5 text-xs font-semibold tabular-nums",
                  incomeDir === "up" ? "text-positive" : "text-negative"
                )}
              >
                {incomeDir === "up" ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {Math.abs(insights.incomeChange)}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Expenses</span>
              <span
                className={cn(
                  "flex items-center gap-0.5 text-xs font-semibold tabular-nums",
                  expenseDir === "up" ? "text-negative" : "text-positive"
                )}
              >
                {expenseDir === "up" ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                {Math.abs(insights.expenseChange)}%
              </span>
            </div>
            <div className="border-t border-border pt-2.5 mt-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">This month</span>
                <span className="text-xs font-semibold tabular-nums">
                  ${insights.current.income.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                  {" / "}
                  <span className="text-negative">
                    ${insights.current.expense.toLocaleString("en-US", { minimumFractionDigits: 0 })}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </SpotlightCard>

        <SpotlightCard delay={0.46} className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="flex size-8 items-center justify-center rounded-xl bg-brand-muted">
              <Target className="size-4 text-brand" />
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Savings Health
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {insights.savingsRate >= 20
              ? "You are on track. Saving above 20% is excellent financial health."
              : insights.savingsRate >= 10
              ? "Good progress. Try to increase savings to the 20% target."
              : "Below target. Consider reducing top spending categories."}
          </p>
          <SavingsGauge rate={insights.savingsRate} />
        </SpotlightCard>
      </div>
    </div>
  );
}
