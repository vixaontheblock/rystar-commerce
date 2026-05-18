import { products } from "@/data/products";
import { SearchClient } from "@/components/search-client";

export default function SearchPage() {
  return (
    <main className="bg-black px-5 py-16 text-white md:py-24">
      <SearchClient products={products} />
    </main>
  );
}