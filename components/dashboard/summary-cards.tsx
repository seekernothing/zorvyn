"use client";

import { motion } from "framer-motion";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PiggyBank,
} from "lucide-react";
import { useAppSelector } from "@/lib/store/hooks";
import { selectSummaryStats } from "@/lib/store/transactionsSlice";
import { AnimatedNumber } from "./animated-number";
import { cn } from "@/lib/utils";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

function ChangeBadge({ value }: { value: number }) {
  const positive = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums",
        positive
          ? "bg-positive-muted text-positive"
          : "bg-negative-muted text-negative"
      )}
    >
      {positive ? (
        <ArrowUpRight className="size-3" />
      ) : (
        <ArrowDownRight className="size-3" />
      )}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

interface StatCardProps {
  index: number;
  label: string;
  value: number;
  change?: number;
  icon: React.ReactNode;
  iconBg: string;
  prefix?: string;
  decimals?: number;
  accent?: boolean;
  subtitle?: string;
}

function StatCard({
  index,
  label,
  value,
  change,
  icon,
  iconBg,
  prefix = "$",
  decimals = 2,
  accent = false,
  subtitle,
}: StatCardProps) {
  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border bg-card p-5",
        "transition-shadow duration-300 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/30"
      )}
    >
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-linear-to-br from-brand/5 to-transparent" />

      <div className="relative flex items-start justify-between">
        <div className={cn("flex size-10 items-center justify-center rounded-xl", iconBg)}>
          {icon}
        </div>
        {change !== undefined && <ChangeBadge value={change} />}
      </div>

      <div className="relative mt-4">
        <p className="text-xs font-medium text-muted-foreground">{label}</p>
        <div
          className={cn(
            "mt-1 text-2xl font-bold tracking-tight tabular-nums",
            accent ? "text-brand" : "text-foreground"
          )}
        >
          <AnimatedNumber value={value} prefix={prefix} decimals={decimals} />
        </div>
        {subtitle && (
          <p className="mt-1 text-[11px] text-muted-foreground">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}

export function SummaryCards() {
  const stats = useAppSelector(selectSummaryStats);

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <StatCard
        index={0}
        label="Total Balance"
        value={stats.totalBalance}
        icon={<Wallet className="size-5 text-brand" />}
        iconBg="bg-brand-muted"
        subtitle="All-time net worth"
        accent
      />
      <StatCard
        index={1}
        label="Monthly Income"
        value={stats.monthlyIncome}
        change={stats.incomeChange}
        icon={<TrendingUp className="size-5 text-positive" />}
        iconBg="bg-positive-muted"
        subtitle="vs last month"
      />
      <StatCard
        index={2}
        label="Monthly Expenses"
        value={stats.monthlyExpense}
        change={stats.expenseChange}
        icon={<TrendingDown className="size-5 text-negative" />}
        iconBg="bg-negative-muted"
        subtitle="vs last month"
      />
      <StatCard
        index={3}
        label="Net Savings"
        value={stats.netSavings}
        change={
          stats.monthlyIncome > 0
            ? Math.round((stats.netSavings / stats.monthlyIncome) * 100)
            : 0
        }
        icon={<PiggyBank className="size-5 text-warning" />}
        iconBg="bg-warning-muted"
        subtitle="This month"
      />
    </div>
  );
}
