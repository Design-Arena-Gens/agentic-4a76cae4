"use client";

import { useStore } from "@/lib/store";

export default function TransactionsList() {
  const { transactions, accounts, categories, subcategories, deleteTransaction } = useStore();

  function nameById<T extends { id: string; name: string }>(items: T[], id?: string) {
    return items.find((x) => x.id === id)?.name || "-";
  }

  return (
    <div className="card divide-y divide-slate-800">
      {transactions.length === 0 && (
        <div className="p-4 text-sm text-slate-400">No transactions yet.</div>
      )}
      {transactions.map((t) => (
        <div key={t.id} className="p-4 grid gap-1 md:grid-cols-12 md:items-center text-sm">
          <div className="md:col-span-2 font-medium capitalize">{t.type}</div>
          <div className="md:col-span-2 font-semibold">? {t.amount.toFixed(2)}</div>
          <div className="md:col-span-2 text-slate-400">{new Date(t.date).toLocaleDateString()}</div>
          <div className="md:col-span-2">
            {t.type === "transfer" ? (
              <span>
                {nameById(accounts, t.fromAccountId)} ? {nameById(accounts, t.toAccountId)}
              </span>
            ) : (
              <span>{nameById(accounts, t.accountId)}</span>
            )}
          </div>
          <div className="md:col-span-3 text-slate-300">
            {t.type !== "transfer" && (
              <>
                {nameById(categories, t.categoryId)}
                {t.subcategoryId ? ` / ${nameById(subcategories, t.subcategoryId)}` : ""}
              </>
            )}
          </div>
          <div className="md:col-span-1 flex justify-end">
            <button onClick={() => deleteTransaction(t.id)} className="btn btn-ghost text-red-400 border-red-900 hover:bg-red-900/20">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
