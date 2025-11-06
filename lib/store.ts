"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { AppData, Account, Category, Subcategory, Transaction, Id } from "./types";

function generateId(): Id {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const defaultData: AppData = {
  accounts: [
    { id: "acc-cash", name: "Cash", balance: 0 },
    { id: "acc-bank", name: "Bank", balance: 0 },
  ],
  categories: [
    { id: "cat-income", name: "Income" },
    { id: "cat-expense", name: "Expense" },
  ],
  subcategories: [
    { id: "sub-salary", categoryId: "cat-income", name: "Salary" },
    { id: "sub-bonus", categoryId: "cat-income", name: "Bonus" },
    { id: "sub-food", categoryId: "cat-expense", name: "Food" },
    { id: "sub-bills", categoryId: "cat-expense", name: "Bills" },
    { id: "sub-transport", categoryId: "cat-expense", name: "Transport" },
  ],
  transactions: [],
  lastUpdatedAt: new Date().toISOString(),
};

export interface StoreState extends AppData {
  addAccount: (name: string) => void;
  renameAccount: (id: Id, name: string) => void;
  deleteAccount: (id: Id) => void;

  addCategory: (name: string) => void;
  renameCategory: (id: Id, name: string) => void;
  deleteCategory: (id: Id) => void;

  addSubcategory: (categoryId: Id, name: string) => void;
  renameSubcategory: (id: Id, name: string) => void;
  deleteSubcategory: (id: Id) => void;

  addTransaction: (t: Omit<Transaction, "id">) => void;
  deleteTransaction: (id: Id) => void;
}

function recalcBalances(accounts: Account[], transactions: Transaction[]): Account[] {
  const map = new Map<string, number>();
  for (const acc of accounts) map.set(acc.id, 0);
  for (const t of transactions) {
    if (t.type === "income" && t.accountId) {
      map.set(t.accountId, (map.get(t.accountId) ?? 0) + t.amount);
    } else if (t.type === "expense" && t.accountId) {
      map.set(t.accountId, (map.get(t.accountId) ?? 0) - t.amount);
    } else if (t.type === "transfer" && t.fromAccountId && t.toAccountId) {
      map.set(t.fromAccountId, (map.get(t.fromAccountId) ?? 0) - t.amount);
      map.set(t.toAccountId, (map.get(t.toAccountId) ?? 0) + t.amount);
    }
  }
  return accounts.map((a) => ({ ...a, balance: map.get(a.id) ?? 0 }));
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      ...defaultData,

      addAccount: (name) =>
        set((state) => ({
          accounts: [...state.accounts, { id: generateId(), name, balance: 0 }],
          lastUpdatedAt: new Date().toISOString(),
        })),
      renameAccount: (id, name) =>
        set((state) => ({
          accounts: state.accounts.map((a) => (a.id === id ? { ...a, name } : a)),
          lastUpdatedAt: new Date().toISOString(),
        })),
      deleteAccount: (id) =>
        set((state) => ({
          accounts: state.accounts.filter((a) => a.id !== id),
          // Remove related transactions referencing this account
          transactions: state.transactions.filter(
            (t) => t.accountId !== id && t.fromAccountId !== id && t.toAccountId !== id
          ),
          lastUpdatedAt: new Date().toISOString(),
        })),

      addCategory: (name) =>
        set((state) => ({
          categories: [...state.categories, { id: generateId(), name }],
          lastUpdatedAt: new Date().toISOString(),
        })),
      renameCategory: (id, name) =>
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, name } : c)),
          lastUpdatedAt: new Date().toISOString(),
        })),
      deleteCategory: (id) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          subcategories: state.subcategories.filter((s) => s.categoryId !== id),
          // Remove category reference from transactions
          transactions: state.transactions.map((t) =>
            t.categoryId === id ? { ...t, categoryId: undefined, subcategoryId: undefined } : t
          ),
          lastUpdatedAt: new Date().toISOString(),
        })),

      addSubcategory: (categoryId, name) =>
        set((state) => ({
          subcategories: [...state.subcategories, { id: generateId(), categoryId, name }],
          lastUpdatedAt: new Date().toISOString(),
        })),
      renameSubcategory: (id, name) =>
        set((state) => ({
          subcategories: state.subcategories.map((s) => (s.id === id ? { ...s, name } : s)),
          lastUpdatedAt: new Date().toISOString(),
        })),
      deleteSubcategory: (id) =>
        set((state) => ({
          subcategories: state.subcategories.filter((s) => s.id !== id),
          transactions: state.transactions.map((t) => (t.subcategoryId === id ? { ...t, subcategoryId: undefined } : t)),
          lastUpdatedAt: new Date().toISOString(),
        })),

      addTransaction: (t) =>
        set((state) => {
          const tx: Transaction = { ...t, id: generateId() };
          const transactions = [tx, ...state.transactions];
          const accounts = recalcBalances(state.accounts, transactions);
          return { transactions, accounts, lastUpdatedAt: new Date().toISOString() };
        }),
      deleteTransaction: (id) =>
        set((state) => {
          const transactions = state.transactions.filter((t) => t.id !== id);
          const accounts = recalcBalances(state.accounts, transactions);
          return { transactions, accounts, lastUpdatedAt: new Date().toISOString() };
        }),
    }),
    {
      name: "money-manager-store",
      partialize: (state) => ({
        accounts: state.accounts,
        categories: state.categories,
        subcategories: state.subcategories,
        transactions: state.transactions,
        lastUpdatedAt: state.lastUpdatedAt,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const accounts = recalcBalances(state.accounts, state.transactions);
        // @ts-ignore - we are in control
        state.accounts = accounts;
      },
    }
  )
);

export function useDerived() {
  const store = useStore();
  const totalIncome = store.transactions
    .filter((t) => t.type === "income")
    .reduce((a, b) => a + b.amount, 0);
  const totalExpense = store.transactions
    .filter((t) => t.type === "expense")
    .reduce((a, b) => a + b.amount, 0);
  const net = totalIncome - totalExpense;
  return { totalIncome, totalExpense, net };
}
