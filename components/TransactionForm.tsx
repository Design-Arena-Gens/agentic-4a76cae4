"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/lib/store";
import type { TransactionType } from "@/lib/types";

export default function TransactionForm() {
  const {
    accounts,
    categories,
    subcategories,
    addTransaction,
  } = useStore();

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState<string>("");
  const [date, setDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [accountId, setAccountId] = useState<string>(accounts[0]?.id ?? "");
  const [fromAccountId, setFromAccountId] = useState<string>(accounts[0]?.id ?? "");
  const [toAccountId, setToAccountId] = useState<string>(accounts[1]?.id ?? accounts[0]?.id ?? "");
  const [categoryId, setCategoryId] = useState<string>("");
  const [subcategoryId, setSubcategoryId] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const filteredSubcats = useMemo(
    () => subcategories.filter((s) => s.categoryId === categoryId),
    [subcategoryId, categoryId, subcategories]
  );

  function reset() {
    setAmount("");
    setNote("");
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(amount);
    if (!Number.isFinite(amt) || amt <= 0) return;

    const iso = new Date(date).toISOString();

    if (type === "transfer") {
      if (!fromAccountId || !toAccountId || fromAccountId === toAccountId) return;
      addTransaction({ type, amount: amt, date: iso, fromAccountId, toAccountId, note });
    } else {
      if (!accountId) return;
      addTransaction({ type, amount: amt, date: iso, accountId, categoryId: categoryId || undefined, subcategoryId: subcategoryId || undefined, note });
    }
    reset();
  }

  return (
    <form onSubmit={onSubmit} className="card p-4 grid gap-3">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={`btn ${type === "expense" ? "btn-primary" : "btn-ghost"}`} onClick={() => setType("expense")}>Expense</button>
        <button type="button" className={`btn ${type === "income" ? "btn-primary" : "btn-ghost"}`} onClick={() => setType("income")}>Income</button>
        <button type="button" className={`btn ${type === "transfer" ? "btn-primary" : "btn-ghost"}`} onClick={() => setType("transfer")}>Transfer</button>
      </div>

      <div>
        <label className="label">Date</label>
        <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
      </div>

      <div>
        <label className="label">Amount</label>
        <input className="input" type="number" step="0.01" min="0" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
      </div>

      {type !== "transfer" ? (
        <>
          <div>
            <label className="label">Account</label>
            <select className="select" value={accountId} onChange={(e) => setAccountId(e.target.value)} required>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Category</label>
            <select className="select" value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setSubcategoryId(""); }}>
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Subcategory</label>
            <select className="select" value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)} disabled={!categoryId}>
              <option value="">None</option>
              {filteredSubcats.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="label">From Account</label>
            <select className="select" value={fromAccountId} onChange={(e) => setFromAccountId(e.target.value)} required>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">To Account</label>
            <select className="select" value={toAccountId} onChange={(e) => setToAccountId(e.target.value)} required>
              {accounts.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div>
        <label className="label">Note</label>
        <input className="input" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional note" />
      </div>

      <div className="flex justify-end">
        <button className="btn btn-primary" type="submit">Add {type}</button>
      </div>
    </form>
  );
}
