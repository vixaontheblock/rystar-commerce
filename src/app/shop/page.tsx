import { ProductCard } from "@/components/product-card";
import { products } from "@/data/products";

export default function ShopPage() {
  return (
    <main className="px-5 py-16">
      <section className="mx-auto max-w-7xl">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
          Shop
        </p>

        <h1 className="text-5xl font-black uppercase tracking-tight md:text-7xl">
          Rystar catalog
        </h1>

        <p className="mt-5 max-w-2xl text-neutral-400">
          Explora las piezas disponibles. Esta versión todavía usa productos
          locales; después conectamos base de datos y panel admin.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}