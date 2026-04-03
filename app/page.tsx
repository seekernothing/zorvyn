"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";
import { TopNav } from "@/components/dashboard/top-nav";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { StatisticsChart } from "@/components/dashboard/statistics-chart";
import { ExpenseBreakdown } from "@/components/dashboard/expense-breakdown";
import { InsightsSection } from "@/components/dashboard/insights-section";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { AddTransactionModal } from "@/components/dashboard/add-transaction-modal";
import { AnalyticsTab } from "@/components/dashboard/analytics-tab";
import { useAppSelector } from "@/lib/store/hooks";
import { selectActiveTab, selectRole } from "@/lib/store/uiSlice";
import { Button } from "@/components/ui/button";
import { fadeUp } from "@/lib/motion";
import type { Variants } from "framer-motion";

const pageVariants: Variants = fadeUp;

function OverviewTab() {
  return (
    <motion.div
      key="overview"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-6"
    >
      <SummaryCards />
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <StatisticsChart />
        <ExpenseBreakdown />
      </div>
      <InsightsSection />
    </motion.div>
  );
}

function TransactionsTab({ onAdd }: { onAdd: () => void }) {
  const role = useAppSelector(selectRole);
  return (
    <motion.div
      key="transactions"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Transactions</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Browse, search, and filter your financial activity
          </p>
        </div>
        {role === "admin" && (
          <Button
            onClick={onAdd}
            className="h-9 rounded-xl bg-brand text-white hover:bg-brand-light text-sm font-semibold gap-2"
          >
            <Plus className="size-4" />
            Add Transaction
          </Button>
        )}
      </div>
      <TransactionsTable />
    </motion.div>
  );
}

function AnalyticsTabWrapper() {
  return (
    <motion.div
      key="analytics"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="space-y-4"
    >
      <div>
        <h2 className="text-base font-semibold">Analytics</h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Detailed breakdowns and trend analysis
        </p>
      </div>
      <AnalyticsTab />
    </motion.div>
  );
}

function InsightsTab() {
  return (
    <motion.div
      key="insights"
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <InsightsSection />
    </motion.div>
  );
}

function FloatingAddButton({ onClick }: { onClick: () => void }) {
  const role = useAppSelector(selectRole);
  if (role !== "admin") return null;
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 400 }}
      onClick={onClick}
      className="flex size-14 items-center justify-center rounded-full bg-brand shadow-lg shadow-brand/30 text-white hover:bg-brand-light transition-colors active:scale-95"
    >
      <Plus className="size-6" />
    </motion.button>
  );
}

export default function DashboardPage() {
  const activeTab = useAppSelector(selectActiveTab);
  const [addOpen, setAddOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopNav />

      <div className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h1 className="text-xl font-bold tracking-tight">Good morning, Abhishek</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              {" · "}
              Here is your finance overview
            </p>
          </motion.div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <AnimatePresence mode="wait">
          {activeTab === "overview" && <OverviewTab key="overview" />}
          {activeTab === "transactions" && (
            <TransactionsTab key="transactions" onAdd={() => setAddOpen(true)} />
          )}
          {activeTab === "analytics" && <AnalyticsTabWrapper key="analytics" />}
          {activeTab === "insights" && <InsightsTab key="insights" />}
        </AnimatePresence>
      </main>

      {activeTab !== "transactions" && (
        <div className="fixed bottom-6 right-6 sm:hidden">
          <FloatingAddButton onClick={() => setAddOpen(true)} />
        </div>
      )}

      <AddTransactionModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
