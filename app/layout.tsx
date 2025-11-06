import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "Money Manager",
  description: "Income, Expense, Transfers, Categories, Subcategories",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container-max py-6">
          <header className="mb-6">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-xl font-semibold">?? Money Manager</Link>
              <nav className="flex gap-2 text-sm">
                <Link className="btn btn-ghost" href="/">Dashboard</Link>
                <Link className="btn btn-ghost" href="/transactions">Transactions</Link>
                <Link className="btn btn-ghost" href="/categories">Categories</Link>
                <Link className="btn btn-ghost" href="/accounts">Accounts</Link>
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="mt-10 text-center text-xs text-slate-500">
            Built for managing income, expenses, and transfers
          </footer>
        </div>
      </body>
    </html>
  );
}
