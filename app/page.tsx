"use client";

import TransactionForm from "@/components/TransactionForm";
import TransactionsList from "@/components/TransactionsList";
import { useDerived, useStore } from "@/lib/store";

export default function Page() {
  const { accounts } = useStore();
  const { totalIncome, totalExpense, net } = useDerived();

  return (
    <div className="grid gap-6">
      <section className="grid md:grid-cols-3 gap-4">
        <div className="card p-4">
          <div className="text-slate-400 text-sm">Total Income</div>
          <div className="text-2xl font-semibold mt-1 text-green-400">? {totalIncome.toFixed(2)}</div>
        </div>
        <div className="card p-4">
          <div className="text-slate-400 text-sm">Total Expense</div>
          <div className="text-2xl font-semibold mt-1 text-red-400">? {totalExpense.toFixed(2)}</div>
        </div>
        <div className="card p-4">
          <div className="text-slate-400 text-sm">Net</div>
          <div className={`text-2xl font-semibold mt-1 ${net >= 0 ? "text-green-400" : "text-red-400"}`}>? {net.toFixed(2)}</div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        {accounts.map((a) => (
          <div key={a.id} className="card p-4">
            <div className="text-slate-400 text-sm">Account</div>
            <div className="text-lg font-semibold">{a.name}</div>
            <div className="mt-2 text-2xl">? {a.balance.toFixed(2)}</div>
          </div>
        ))}
      </section>

      <TransactionForm />

      <TransactionsList />
    </div>
  );
}
