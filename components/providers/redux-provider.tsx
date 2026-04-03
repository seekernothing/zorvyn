"use client";

import { Provider } from "react-redux";
import { useEffect, useRef } from "react";
import { store } from "@/lib/store/store";
import { hydrateTransactions } from "@/lib/store/transactionsSlice";
import type { Transaction } from "@/lib/store/types";

const STORAGE_KEY = "zorvyn:transactions";

function loadFromStorage(): Transaction[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed as Transaction[];
  } catch {
    return null;
  }
}

function saveToStorage(items: Transaction[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // quota exceeded or private mode — just skip
  }
}

function StorePersistence() {
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      const saved = loadFromStorage();
      if (saved) store.dispatch(hydrateTransactions(saved));
    }

    // only save when items actually change, not on every dispatch
    let prevItems = store.getState().transactions.items;
    const unsubscribe = store.subscribe(() => {
      const nextItems = store.getState().transactions.items;
      if (nextItems !== prevItems) {
        prevItems = nextItems;
        saveToStorage(nextItems);
      }
    });

    return unsubscribe;
  }, []);

  return null;
}

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <StorePersistence />
      {children}
    </Provider>
  );
}
