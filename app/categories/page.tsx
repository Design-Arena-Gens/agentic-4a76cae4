import CategoriesManager from "@/components/CategoriesManager";

export default function Page() {
  return (
    <div className="grid gap-6">
      <h2 className="text-xl font-semibold">Categories & Subcategories</h2>
      <CategoriesManager />
    </div>
  );
}
