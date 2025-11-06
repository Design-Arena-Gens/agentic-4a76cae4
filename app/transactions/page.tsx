import TransactionForm from "@/components/TransactionForm";
import TransactionsList from "@/components/TransactionsList";

export default function Page() {
  return (
    <div className="grid gap-6">
      <h2 className="text-xl font-semibold">Transactions</h2>
      <TransactionForm />
      <TransactionsList />
    </div>
  );
}
