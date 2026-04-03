"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  X,
  Trash2,
  Download,
} from "lucide-react";
import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  selectFilteredTransactions,
  setSearch,
  setCategory,
  setType,
  toggleSort,
  resetFilters,
  deleteTransaction,
} from "@/lib/store/transactionsSlice";
import { selectRole } from "@/lib/store/uiSlice";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/data/mock";
import type { SortField } from "@/lib/store/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { exportAsCSV, exportAsJSON } from "@/lib/export";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const PAGE_SIZE = 10;

function SortIcon({ field, activeField, order }: { field: SortField; activeField: SortField; order: "asc" | "desc" }) {
  if (field !== activeField) return <ArrowUpDown className="size-3 opacity-30" />;
  return order === "asc" ? <ArrowUp className="size-3 text-brand" /> : <ArrowDown className="size-3 text-brand" />;
}

export function TransactionsTable() {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(selectFilteredTransactions);
  const filters = useAppSelector((s) => s.transactions.filters);
  const role = useAppSelector(selectRole);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const paged = transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleSearch(v: string) {
    dispatch(setSearch(v));
    setPage(1);
  }
  function handleCategory(v: string) {
    dispatch(setCategory(v as any));
    setPage(1);
  }
  function handleType(v: string) {
    dispatch(setType(v as any));
    setPage(1);
  }
  function handleSort(field: SortField) {
    dispatch(toggleSort(field));
  }
  function handleDelete(id: string, desc: string) {
    dispatch(deleteTransaction(id));
    toast.success(`Deleted "${desc}"`);
  }

  const hasActiveFilters =
    filters.search || filters.category !== "all" || filters.type !== "all";

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <Input
            placeholder="Search transactions…"
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-8 h-9 rounded-xl text-sm"
          />
        </div>

        {/* Category filter */}
        <Select value={filters.category} onValueChange={handleCategory}>
          <SelectTrigger className="w-40 h-9 rounded-xl text-xs">
            <SlidersHorizontal className="size-3.5 mr-1.5 text-muted-foreground" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="text-xs rounded-lg">All categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c} className="text-xs rounded-lg">{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Type filter */}
        <Select value={filters.type} onValueChange={handleType}>
          <SelectTrigger className="w-32 h-9 rounded-xl text-xs">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="text-xs rounded-lg">All types</SelectItem>
            <SelectItem value="income" className="text-xs rounded-lg">Income</SelectItem>
            <SelectItem value="expense" className="text-xs rounded-lg">Expense</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 rounded-xl text-xs text-muted-foreground gap-1"
            onClick={() => { dispatch(resetFilters()); setPage(1); }}
          >
            <X className="size-3" />
            Clear
          </Button>
        )}

        <span className="text-xs text-muted-foreground tabular-nums">
          {transactions.length} results
        </span>

        {/* Export */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="ml-auto h-9 rounded-xl text-xs gap-1.5"
            >
              <Download className="size-3.5" />
              Export
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-36 rounded-xl">
            <DropdownMenuItem
              className="gap-2 rounded-lg text-xs"
              onClick={() => {
                exportAsCSV(transactions);
                toast.success("Exported as CSV", { description: `${transactions.length} transactions` });
              }}
            >
              Export CSV
            </DropdownMenuItem>
            <DropdownMenuItem
              className="gap-2 rounded-lg text-xs"
              onClick={() => {
                exportAsJSON(transactions);
                toast.success("Exported as JSON", { description: `${transactions.length} transactions` });
              }}
            >
              Export JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Column headers */}
        <div className="grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[2fr_1fr_1fr_auto] gap-4 px-4 py-2.5 border-b border-border bg-secondary/50">
          {(
            [
              { label: "Description", field: "description" as SortField },
              { label: "Category",    field: "category" as SortField,    hidden: true },
              { label: "Date",        field: "date" as SortField,        hidden: false },
              { label: "Amount",      field: "amount" as SortField },
            ] as { label: string; field: SortField; hidden?: boolean }[]
          ).map(({ label, field, hidden }) => (
            <button
              key={field}
              onClick={() => handleSort(field)}
              className={cn(
                "flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors text-left",
                hidden && "hidden sm:flex",
                field === "amount" && "justify-end"
              )}
            >
              {label}
              <SortIcon field={field} activeField={filters.sortBy} order={filters.sortOrder} />
            </button>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-border">
          <AnimatePresence mode="popLayout" initial={false}>
            {paged.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-16 text-muted-foreground"
              >
                <Search className="size-8 mb-3 opacity-30" />
                <p className="text-sm font-medium">No transactions found</p>
                <p className="text-xs mt-1 opacity-70">Try adjusting your filters</p>
              </motion.div>
            ) : (
              paged.map((t, i) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: i * 0.025, duration: 0.25 }}
                  className="group grid grid-cols-[1fr_auto_auto_auto] sm:grid-cols-[2fr_1fr_1fr_auto] gap-4 px-4 py-3 hover:bg-secondary/40 transition-colors"
                >
                  {/* Description */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="shrink-0 size-7 rounded-xl flex items-center justify-center text-[11px] font-bold text-white"
                      style={{
                        background: CATEGORY_COLORS[t.category] ?? "var(--muted-foreground)",
                      }}
                    >
                      {t.category[0]}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{t.description}</p>
                      <p className="text-[11px] text-muted-foreground sm:hidden mt-0.5">
                        {t.category} · {new Date(t.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>

                  {/* Category */}
                  <div className="hidden sm:flex items-center">
                    <Badge
                      variant="secondary"
                      className="text-[10px] rounded-lg font-medium px-2 py-0.5"
                    >
                      {t.category}
                    </Badge>
                  </div>

                  {/* Date */}
                  <div className="hidden sm:flex items-center text-xs text-muted-foreground tabular-nums">
                    {new Date(t.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>

                  {/* Amount + actions */}
                  <div className="flex items-center gap-2 justify-end">
                    <span
                      className={cn(
                        "text-sm font-semibold tabular-nums",
                        t.type === "income" ? "text-positive" : "text-foreground"
                      )}
                    >
                      {t.type === "income" ? "+" : "-"}$
                      {t.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </span>
                    {role === "admin" && (
                      <button
                        onClick={() => handleDelete(t.id, t.description)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-lg hover:bg-negative-muted text-negative"
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
            <span className="text-[11px] text-muted-foreground tabular-nums">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-lg"
                disabled={page === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-7 rounded-lg"
                disabled={page === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
