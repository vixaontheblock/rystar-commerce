import Link from "next/link";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";

export default function HomePage() {
  const featuredProducts = products.slice(0, 3);

  return (
    <main>
      <section className="relative overflow-hidden bg-black px-5 py-28 md:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2b2b2b,transparent_45%)]" />
        <div className="absolute inset-x-0 top-0 border-y border-white/10 bg-white text-center text-xs font-black uppercase tracking-[0.25em] text-black">
          FREE SHIPPING IN PANAMA ON ORDERS OVER $100
        </div>

        <div className="relative mx-auto max-w-7xl pt-10">
          <p className="mb-5 text-sm uppercase tracking-[0.45em] text-neutral-400">
            SS26 · DROP 001
          </p>

          <h1 className="max-w-5xl text-6xl font-black uppercase leading-[0.86] tracking-tight md:text-8xl">
            First you're crazy, then you're visionary.
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-8 text-neutral-300">
            Rystar Studios no es una colección. Es el comienzo. Limited pieces,
            no restock y drops pensados para quienes estuvieron desde el inicio.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/shop"
              className="rounded-full bg-white px-8 py-4 text-center text-sm font-black uppercase tracking-wide text-black transition hover:bg-neutral-200"
            >
              Ver el drop
            </Link>

            <Link
              href="/shop"
              className="rounded-full border border-white/20 px-8 py-4 text-center text-sm font-black uppercase tracking-wide transition hover:border-white"
            >
              Buscar piezas
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-white py-4 text-black">
        <div className="overflow-hidden whitespace-nowrap text-sm font-black uppercase tracking-[0.3em]">
          <div className="animate-[marquee_20s_linear_infinite]">
            No restock · Limited pieces · Rystar Studios · SS26 · No restock ·
            Limited pieces · Rystar Studios · SS26 ·
          </div>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="mb-3 text-sm uppercase tracking-[0.35em] text-neutral-500">
                Nuestros productos
              </p>
              <h2 className="text-4xl font-black uppercase md:text-6xl">
                Drop pieces
              </h2>
            </div>

            <Link
              href="/shop"
              className="hidden text-sm font-bold uppercase tracking-wide text-neutral-300 transition hover:text-white md:block"
            >
              Ver catálogo completo
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 md:grid-cols-[0.8fr_1.2fr] md:p-12">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-neutral-500">
              Sobre el drop
            </p>
            <p className="mt-6 text-6xl font-black uppercase leading-none md:text-8xl">
              002
            </p>
          </div>

          <div>
            <h2 className="text-4xl font-black uppercase leading-none md:text-6xl">
              Hecho en pocas piezas. Para los que estuvieron desde el inicio.
            </h2>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-300">
              Rystar no es una marca de moda. Es un estado mental. Cada pieza
              existe en cantidades limitadas — cuando se agota, se agota. Sin
              restock. Sin segunda oportunidad.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black p-5">
                <p className="text-3xl font-black">0</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Restock
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black p-5">
                <p className="text-3xl font-black">100%</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Proceso propio
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black p-5">
                <p className="text-3xl font-black">SS26</p>
                <p className="mt-1 text-xs uppercase tracking-[0.2em] text-neutral-500">
                  Temporada
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}