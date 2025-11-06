"use client";

import { useStore } from "@/lib/store";
import { useMemo, useState } from "react";

export default function CategoriesManager() {
  const {
    categories,
    subcategories,
    addCategory,
    renameCategory,
    deleteCategory,
    addSubcategory,
    renameSubcategory,
    deleteSubcategory,
  } = useStore();

  const [newCat, setNewCat] = useState("");
  const [selectedCatId, setSelectedCatId] = useState<string>(categories[0]?.id ?? "");
  const [newSub, setNewSub] = useState("");

  const subs = useMemo(
    () => subcategories.filter((s) => s.categoryId === selectedCatId),
    [subcategories, selectedCatId]
  );

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="grid gap-3">
        <h3 className="text-lg font-semibold">Categories</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const n = newCat.trim();
            if (!n) return;
            addCategory(n);
            setNewCat("");
          }}
          className="card p-4 flex gap-2"
        >
          <input className="input" placeholder="New category name" value={newCat} onChange={(e) => setNewCat(e.target.value)} />
          <button className="btn btn-primary" type="submit">Add</button>
        </form>

        <div className="card divide-y divide-slate-800">
          {categories.map((c) => (
            <div key={c.id} className="p-4 flex items-center gap-2">
              <input className="input" defaultValue={c.name} onBlur={(e) => renameCategory(c.id, e.target.value)} />
              <button className="btn btn-ghost" onClick={() => setSelectedCatId(c.id)}>Manage Subs</button>
              <button className="btn btn-ghost text-red-400 border-red-900 hover:bg-red-900/20" onClick={() => deleteCategory(c.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3">
        <h3 className="text-lg font-semibold">Subcategories</h3>
        <div className="card p-4 grid gap-2">
          <label className="label">Select Category</label>
          <select className="select" value={selectedCatId} onChange={(e) => setSelectedCatId(e.target.value)}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const n = newSub.trim();
              if (!n || !selectedCatId) return;
              addSubcategory(selectedCatId, n);
              setNewSub("");
            }}
            className="mt-2 flex gap-2"
          >
            <input className="input" placeholder="New subcategory name" value={newSub} onChange={(e) => setNewSub(e.target.value)} />
            <button className="btn btn-primary" type="submit">Add</button>
          </form>
        </div>

        <div className="card divide-y divide-slate-800">
          {subs.map((s) => (
            <div key={s.id} className="p-4 flex items-center gap-2">
              <input className="input" defaultValue={s.name} onBlur={(e) => renameSubcategory(s.id, e.target.value)} />
              <button className="btn btn-ghost text-red-400 border-red-900 hover:bg-red-900/20" onClick={() => deleteSubcategory(s.id)}>Delete</button>
            </div>
          ))}
          {subs.length === 0 && (
            <div className="p-4 text-sm text-slate-400">No subcategories.</div>
          )}
        </div>
      </div>
    </div>
  );
}
