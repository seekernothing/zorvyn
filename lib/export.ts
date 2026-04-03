import type { Transaction } from "@/lib/store/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function exportAsCSV(transactions: Transaction[], filename = "zorvyn-transactions") {
  const headers = ["Date", "Description", "Category", "Type", "Amount (USD)"];

  const rows = transactions.map((t) => [
    formatDate(t.date),
    `"${t.description.replace(/"/g, '""')}"`,
    t.category,
    t.type,
    t.type === "income" ? t.amount.toFixed(2) : (-t.amount).toFixed(2),
  ]);

  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

  downloadFile(`${filename}.csv`, csv, "text/csv;charset=utf-8;");
}

export function exportAsJSON(transactions: Transaction[], filename = "zorvyn-transactions") {
  const data = transactions.map((t) => ({
    id: t.id,
    date: formatDate(t.date),
    description: t.description,
    category: t.category,
    type: t.type,
    amount: t.amount,
  }));

  downloadFile(`${filename}.json`, JSON.stringify(data, null, 2), "application/json");
}

function downloadFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
