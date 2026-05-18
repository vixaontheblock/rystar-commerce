import Link from "next/link";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";

export default function HomePage() {
  const featuredProducts = products.slice(0, 3);

  return (
    <main>
      <section className="relative overflow-hidden bg-black px-5 py-28 md:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#333333,transparent_40%)]" />

        <div className="relative mx-auto max-w-7xl">
          <p className="mb-5 text-sm uppercase tracking-[0.45em] text-neutral-400">
            Rystar Clothing
          </p>

          <h1 className="max-w-5xl text-6xl font-black uppercase leading-[0.9] tracking-tight md:text-8xl">
            Independent streetwear store.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-300">
            Nueva experiencia digital para comprar piezas Rystar sin depender de
            Shopify. Catálogo, carrito y checkout propio.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/shop"
              className="rounded-full bg-white px-8 py-4 text-center text-sm font-black uppercase tracking-wide text-black transition hover:bg-neutral-200"
            >
              Shop now
            </Link>

            <Link
              href="/cart"
              className="rounded-full border border-white/20 px-8 py-4 text-center text-sm font-black uppercase tracking-wide transition hover:border-white"
            >
              View cart
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.35em] text-neutral-500">
                Featured
              </p>
              <h2 className="text-3xl font-black uppercase md:text-5xl">
                Latest pieces
              </h2>
            </div>

            <Link
              href="/shop"
              className="hidden text-sm font-bold uppercase tracking-wide text-neutral-300 transition hover:text-white md:block"
            >
              See all
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}