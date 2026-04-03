import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import { mockTransactions } from "@/lib/data/mock";
import type { Transaction, TransactionFilters, Category, TransactionType, SortField, SortOrder } from "./types";
import type { RootState } from "./store";

interface TransactionsState {
  items: Transaction[];
  filters: TransactionFilters;
}

const initialState: TransactionsState = {
  items: mockTransactions,
  filters: {
    search: "",
    category: "all",
    type: "all",
    sortBy: "date",
    sortOrder: "desc",
  },
};

export const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.items.unshift(action.payload);
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    },
    hydrateTransactions: (state, action: PayloadAction<Transaction[]>) => {
      state.items = action.payload;
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },
    setCategory: (state, action: PayloadAction<Category | "all">) => {
      state.filters.category = action.payload;
    },
    setType: (state, action: PayloadAction<TransactionType | "all">) => {
      state.filters.type = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortField>) => {
      state.filters.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<SortOrder>) => {
      state.filters.sortOrder = action.payload;
    },
    toggleSort: (state, action: PayloadAction<SortField>) => {
      if (state.filters.sortBy === action.payload) {
        state.filters.sortOrder = state.filters.sortOrder === "asc" ? "desc" : "asc";
      } else {
        state.filters.sortBy = action.payload;
        state.filters.sortOrder = "desc";
      }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  hydrateTransactions,
  setSearch,
  setCategory,
  setType,
  setSortBy,
  setSortOrder,
  toggleSort,
  resetFilters,
} = transactionsSlice.actions;

const selectAllItems = (state: RootState) => state.transactions.items;
const selectFilters = (state: RootState) => state.transactions.filters;

export const selectFilteredTransactions = createSelector(
  [selectAllItems, selectFilters],
  (items, filters) => {
    let result = [...items];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    if (filters.category !== "all") {
      result = result.filter((t) => t.category === filters.category);
    }
    if (filters.type !== "all") {
      result = result.filter((t) => t.type === filters.type);
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (filters.sortBy === "date") {
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (filters.sortBy === "amount") {
        cmp = a.amount - b.amount;
      } else if (filters.sortBy === "category") {
        cmp = a.category.localeCompare(b.category);
      } else if (filters.sortBy === "description") {
        cmp = a.description.localeCompare(b.description);
      }
      return filters.sortOrder === "asc" ? cmp : -cmp;
    });

    return result;
  }
);

export const selectSummaryStats = createSelector([selectAllItems], (items) => {
  const now = new Date();
  const thisMonth = items.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const lastMonth = items.filter((t) => {
    const d = new Date(t.date);
    const lm = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return d.getMonth() === lm.getMonth() && d.getFullYear() === lm.getFullYear();
  });

  const sum = (arr: Transaction[], type: TransactionType) =>
    arr.filter((t) => t.type === type).reduce((acc, t) => acc + t.amount, 0);

  const thisIncome = sum(thisMonth, "income");
  const thisExpense = sum(thisMonth, "expense");
  const lastIncome = sum(lastMonth, "income");
  const lastExpense = sum(lastMonth, "expense");

  const totalBalance = items.reduce(
    (acc, t) => acc + (t.type === "income" ? t.amount : -t.amount),
    0
  );
  const allIncome = items.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
  const allExpense = items.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);

  const pct = (curr: number, prev: number) =>
    prev === 0 ? 0 : ((curr - prev) / prev) * 100;

  return {
    totalBalance,
    monthlyIncome: thisIncome,
    monthlyExpense: thisExpense,
    netSavings: thisIncome - thisExpense,
    incomeChange: pct(thisIncome, lastIncome),
    expenseChange: pct(thisExpense, lastExpense),
    allIncome,
    allExpense,
  };
});

export const selectCategoryBreakdown = createSelector([selectAllItems], (items) => {
  const expenses = items.filter((t) => t.type === "expense");
  const total = expenses.reduce((a, t) => a + t.amount, 0);
  const map: Record<string, number> = {};
  for (const t of expenses) {
    map[t.category] = (map[t.category] ?? 0) + t.amount;
  }
  return Object.entries(map)
    .map(([category, amount]) => ({
      category,
      amount,
      percentage: total > 0 ? Math.round((amount / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount);
});

export const selectMonthlyChartData = createSelector([selectAllItems], (items) => {
  const months = Array.from({ length: 12 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (11 - i));
    return { year: d.getFullYear(), month: d.getMonth(), label: d.toLocaleString("default", { month: "short" }) };
  });

  return months.map(({ year, month, label }) => {
    const monthItems = items.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
    const income = monthItems.filter((t) => t.type === "income").reduce((a, t) => a + t.amount, 0);
    const expense = monthItems.filter((t) => t.type === "expense").reduce((a, t) => a + t.amount, 0);
    return { label, income, expense };
  });
});

export const selectInsights = createSelector(
  [selectAllItems, selectCategoryBreakdown, selectMonthlyChartData],
  (items, breakdown, monthly) => {
    const topCategory = breakdown[0] ?? null;
    const current = monthly[monthly.length - 1];
    const previous = monthly[monthly.length - 2];
    const savingsRate =
      current.income > 0
        ? Math.round(((current.income - current.expense) / current.income) * 100)
        : 0;
    const expenseChange =
      previous.expense > 0
        ? Math.round(((current.expense - previous.expense) / previous.expense) * 100)
        : 0;
    const incomeChange =
      previous.income > 0
        ? Math.round(((current.income - previous.income) / previous.income) * 100)
        : 0;

    return { topCategory, savingsRate, expenseChange, incomeChange, current, previous };
  }
);

export default transactionsSlice.reducer;
