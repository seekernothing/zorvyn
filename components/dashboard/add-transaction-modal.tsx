"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, DollarSign } from "lucide-react";
import { useState } from "react";
import { useAppDispatch } from "@/lib/store/hooks";
import { addTransaction } from "@/lib/store/transactionsSlice";
import { CATEGORIES } from "@/lib/data/mock";
import type { Transaction, Category, TransactionType } from "@/lib/store/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

function generateId() {
  return "t" + Math.random().toString(36).slice(2, 9);
}

export function AddTransactionModal({ open, onClose }: Props) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState({
    description: "",
    amount: "",
    category: "" as Category | "",
    type: "expense" as TransactionType,
    date: new Date().toISOString().slice(0, 10),
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (!form.description.trim()) e.description = "Description is required";
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = "Enter a valid amount";
    if (!form.category) e.category = "Select a category";
    if (!form.date) e.date = "Date is required";
    return e;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const tx: Transaction = {
      id: generateId(),
      description: form.description.trim(),
      amount: parseFloat(form.amount),
      category: form.category as Category,
      type: form.type,
      date: new Date(form.date).toISOString(),
    };
    dispatch(addTransaction(tx));
    toast.success("Transaction added", {
      description: `${form.type === "income" ? "+" : "-"}$${tx.amount.toFixed(2)} · ${tx.category}`,
    });
    onClose();
    setForm({
      description: "",
      amount: "",
      category: "",
      type: "expense",
      date: new Date().toISOString().slice(0, 10),
    });
    setErrors({});
  }

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => { const n = { ...e }; delete n[key]; return n; });
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card shadow-2xl shadow-black/20 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-base font-semibold">Add Transaction</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Record a new income or expense
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex size-8 items-center justify-center rounded-xl hover:bg-secondary text-muted-foreground transition-colors"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-1 rounded-xl bg-secondary p-1">
                {(["expense", "income"] as TransactionType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => set("type", t)}
                    className={cn(
                      "rounded-lg py-1.5 text-xs font-semibold capitalize transition-all duration-200",
                      form.type === t
                        ? "bg-card shadow-sm text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Description</Label>
                <Input
                  placeholder="e.g. Monthly salary, Grocery run…"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  className={cn("h-9 rounded-xl text-sm", errors.description && "border-negative")}
                />
                {errors.description && (
                  <p className="text-[11px] text-negative">{errors.description}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Amount</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => set("amount", e.target.value)}
                    className={cn(
                      "h-9 pl-8 rounded-xl text-sm tabular-nums",
                      errors.amount && "border-negative"
                    )}
                  />
                </div>
                {errors.amount && (
                  <p className="text-[11px] text-negative">{errors.amount}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Category</Label>
                  <Select value={form.category} onValueChange={(v) => set("category", v)}>
                    <SelectTrigger
                      className={cn("h-9 rounded-xl text-xs", errors.category && "border-negative")}
                    >
                      <SelectValue placeholder="Select…" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c} value={c} className="text-xs rounded-lg">{c}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-[11px] text-negative">{errors.category}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-medium">Date</Label>
                  <Input
                    type="date"
                    value={form.date}
                    onChange={(e) => set("date", e.target.value)}
                    className={cn("h-9 rounded-xl text-xs", errors.date && "border-negative")}
                  />
                  {errors.date && (
                    <p className="text-[11px] text-negative">{errors.date}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-9 rounded-xl bg-brand text-white hover:bg-brand-light text-sm font-semibold gap-2"
              >
                <Plus className="size-4" />
                Add Transaction
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
