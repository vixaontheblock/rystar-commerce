import Link from "next/link";
import { products } from "@/data/products";
import { ProductCard } from "@/components/product-card";

export default function HomePage() {
  const featuredProducts = products.slice(0, 3);

  return (
    <main>
      <section className="relative overflow-hidden bg-black px-5 py-28 md:py-36">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#202020,transparent_45%)]" />

        <div className="relative mx-auto max-w-7xl pt-10">
          <p className="mb-5 text-sm uppercase tracking-[0.45em] text-neutral-500">
            MODA URBANA · STREET
          </p>

          <h1 className="max-w-5xl text-6xl font-black uppercase leading-[0.86] tracking-tight md:text-8xl">
            Rystar <span className="block text-neutral-500">Studios</span>
          </h1>

          <div className="mt-12 rounded-none border border-white/20 p-5 md:p-8">
            <div className="flex min-h-[260px] items-center justify-center border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.01))]">
              <div className="text-center">
                <p className="text-4xl font-black uppercase tracking-wide text-white md:text-6xl">
                  DROP001
                </p>
                <p className="text-4xl font-black uppercase tracking-wide text-neutral-500 md:text-6xl">
                  SS26
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Link
              href="/shop"
              className="group flex items-center justify-between border border-white/20 px-7 py-6 text-sm font-black uppercase tracking-[0.25em] transition hover:border-white hover:bg-white hover:text-black"
            >
              Ver catálogo
              <span className="flex h-12 w-12 items-center justify-center border border-current text-2xl transition group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-white py-4 text-black">
        <div className="flex w-max animate-[marquee_24s_linear_infinite] gap-8 whitespace-nowrap text-2xl font-black uppercase tracking-wide md:text-4xl">
          <span>
            DROP 001 — SS26 · TEMPORADA 2026 · NO RESTOCK · LIMITED PIECES ·
          </span>
          <span>
            DROP 001 — SS26 · TEMPORADA 2026 · NO RESTOCK · LIMITED PIECES ·
          </span>
        </div>
      </section>

      <section className="px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <div className="mb-5 flex items-center gap-4">
              <span className="h-px w-16 bg-white/20" />
              <p className="text-sm font-black uppercase tracking-[0.35em] text-neutral-500">
                DROP 001 — SS26
              </p>
            </div>

            <h2 className="text-6xl font-black uppercase leading-[0.85] tracking-tight md:text-8xl">
              Acid <span className="block text-neutral-500">Star</span>
            </h2>

            <p className="mt-8 text-sm font-black uppercase tracking-[0.35em] text-neutral-500">
              Temporada 2026 · Limited pieces
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredProducts.map((product, index) => (
              <div key={product.id}>
                <ProductCard product={product} />

                <div className="mt-4 flex items-start justify-between gap-4">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-700">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/shop"
            className="mt-12 flex items-center justify-center gap-4 border border-white/15 px-8 py-6 text-center text-sm font-black uppercase tracking-[0.25em] transition hover:border-white hover:bg-white hover:text-black"
          >
            Ver catálogo completo <span>→</span>
          </Link>
        </div>
      </section>

      <section className="border-y border-white/10 px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <p className="mb-8 text-sm font-black uppercase tracking-[0.35em] text-neutral-500">
            Sobre el drop
          </p>

          <h2 className="max-w-6xl text-6xl font-black uppercase leading-[0.86] tracking-tight md:text-8xl">
            Hecho en pocas piezas.{" "}
            <span className="text-neutral-700">
              Para los que estuvieron desde el inicio.
            </span>
          </h2>

          <div className="mt-10 max-w-4xl space-y-5 text-lg uppercase leading-8 tracking-wide text-neutral-400">
            <p>
              Rystar no es una marca de moda. Es un estado mental.{" "}
              <strong className="text-white">
                Cada pieza de este drop existe en cantidades limitadas
              </strong>{" "}
              — cuando se agota, se agota. Sin restock. Sin segunda oportunidad.
            </p>

            <p>Si estás aquí, ya sabes por qué.</p>
          </div>
        </div>
      </section>

      <section className="divide-y divide-white/10 border-b border-white/10">
        <div className="px-5 py-12">
          <div className="mx-auto max-w-7xl">
            <p className="text-7xl font-black uppercase leading-none md:text-9xl">
              002 <span className="text-4xl text-neutral-500 md:text-6xl">Drop</span>
            </p>
            <p className="mt-8 text-sm font-black uppercase tracking-[0.35em] text-neutral-500">
              Primer drop temporada 2026
            </p>
          </div>
        </div>

        <div className="px-5 py-12">
          <div className="mx-auto max-w-7xl">
            <p className="text-7xl font-black uppercase leading-none md:text-9xl">
              0 <span className="text-4xl text-neutral-500 md:text-6xl">Restock</span>
            </p>
            <p className="mt-8 text-sm font-black uppercase tracking-[0.35em] text-neutral-500">
              Sin segunda oportunidad
            </p>
          </div>
        </div>

        <div className="px-5 py-12">
          <div className="mx-auto max-w-7xl">
            <p className="text-7xl font-black uppercase leading-none md:text-9xl">
              100 <span className="text-4xl text-neutral-500 md:text-6xl">%</span>
            </p>
            <p className="mt-8 text-sm font-black uppercase tracking-[0.35em] text-neutral-500">
              Proceso propio
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-6 text-sm font-black uppercase tracking-[0.35em] text-neutral-500">
            Mailing list
          </p>

          <h2 className="text-6xl font-black uppercase leading-[0.85] md:text-8xl">
            First <span className="block text-neutral-500">Access</span>
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg uppercase leading-8 tracking-wide text-neutral-400">
            Próximos drops, piezas exclusivas y acceso anticipado. Sin spam.
            Solo lo que importa.
          </p>

          <form className="mt-10 border border-white/20">
            <input
              type="email"
              placeholder="EMAIL ADDRESS"
              className="w-full border-b border-white/20 bg-black px-6 py-6 text-center text-sm font-black uppercase tracking-[0.25em] text-white outline-none placeholder:text-neutral-700"
            />

            <button
              type="button"
              className="w-full bg-white px-6 py-6 text-sm font-black uppercase tracking-[0.25em] text-black transition hover:bg-neutral-200"
            >
              Join
            </button>
          </form>

          <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-neutral-800">
            No spam · Unsubscribe anytime
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-sm font-black uppercase tracking-[0.35em] text-neutral-500">
            Need help?
          </p>

          <h2 className="max-w-5xl text-6xl font-black uppercase leading-[0.85] md:text-8xl">
            Questions before the drop?
          </h2>

          <p className="mt-8 text-lg uppercase tracking-wide text-neutral-500">
            Write us directly before your size disappears.
          </p>

          <div className="mt-10 grid gap-4">
            <a
              href="https://wa.me/"
              target="_blank"
              className="bg-[#25D366] px-8 py-6 text-center text-sm font-black uppercase tracking-[0.25em] text-black transition hover:brightness-110"
            >
              WhatsApp
            </a>

            <Link
              href="/shop"
              className="border border-white/15 px-8 py-6 text-center text-sm font-black uppercase tracking-[0.25em] transition hover:border-white hover:bg-white hover:text-black"
            >
              Ver drop
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}