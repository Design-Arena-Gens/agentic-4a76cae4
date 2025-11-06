import AccountsManager from "@/components/AccountsManager";

export default function Page() {
  return (
    <div className="grid gap-6">
      <h2 className="text-xl font-semibold">Accounts</h2>
      <AccountsManager />
    </div>
  );
}
