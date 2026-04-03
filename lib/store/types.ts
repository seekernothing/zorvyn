export type TransactionType = "income" | "expense";

export type Category =
  | "Food & Health"
  | "Shopping"
  | "Entertainment"
  | "Platform"
  | "Transport"
  | "Housing"
  | "Salary"
  | "Freelance"
  | "Investment"
  | "Other";

export interface Transaction {
  id: string;
  date: string; // ISO string
  description: string;
  category: Category;
  type: TransactionType;
  amount: number;
}

export type Role = "viewer" | "admin";

export type ActiveTab = "overview" | "transactions" | "analytics" | "insights";

export type SortField = "date" | "amount" | "category" | "description";
export type SortOrder = "asc" | "desc";

export interface TransactionFilters {
  search: string;
  category: Category | "all";
  type: TransactionType | "all";
  sortBy: SortField;
  sortOrder: SortOrder;
}
