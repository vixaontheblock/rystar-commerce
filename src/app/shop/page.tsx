import { ShopCollectionsClient } from "@/components/shop-collections-client";
import { products } from "@/data/products";

export default function ShopPage() {
  return (
    <main className="bg-black px-5 py-16 text-white md:py-24">
      <ShopCollectionsClient products={products} />
    </main>
  );
}