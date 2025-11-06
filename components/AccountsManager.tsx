"use client";

import { useStore } from "@/lib/store";
import { useState } from "react";

export default function AccountsManager() {
  const { accounts, addAccount, renameAccount, deleteAccount } = useStore();
  const [name, setName] = useState("");

  return (
    <div className="grid gap-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          addAccount(name.trim());
          setName("");
        }}
        className="card p-4 flex gap-2"
      >
        <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="New account name" />
        <button className="btn btn-primary" type="submit">Add</button>
      </form>

      <div className="card divide-y divide-slate-800">
        {accounts.map((a) => (
          <div key={a.id} className="p-4 flex items-center gap-3">
            <input
              className="input"
              defaultValue={a.name}
              onBlur={(e) => renameAccount(a.id, e.target.value)}
            />
            <div className="ml-auto text-sm text-slate-400">Balance: ? {a.balance.toFixed(2)}</div>
            <button className="btn btn-ghost text-red-400 border-red-900 hover:bg-red-900/20" onClick={() => deleteAccount(a.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
