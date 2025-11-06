export type Id = string;

export type TransactionType = "income" | "expense" | "transfer";

export interface Account {
  id: Id;
  name: string;
  balance: number; // derived; stored for fast load
}

export interface Category {
  id: Id;
  name: string;
}

export interface Subcategory {
  id: Id;
  categoryId: Id;
  name: string;
}

export interface Transaction {
  id: Id;
  type: TransactionType;
  amount: number; // positive
  date: string; // ISO
  accountId?: Id; // for income/expense
  fromAccountId?: Id; // for transfer
  toAccountId?: Id; // for transfer
  categoryId?: Id; // for income/expense
  subcategoryId?: Id; // for income/expense
  note?: string;
}

export interface AppData {
  accounts: Account[];
  categories: Category[];
  subcategories: Subcategory[];
  transactions: Transaction[];
  lastUpdatedAt: string;
}
