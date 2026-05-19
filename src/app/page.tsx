import Link from "next/link";
import type { ReactNode } from "react";
import { ProductCard } from "@/components/product-card";
import { HeroGlitchLoop } from "@/components/hero-glitch-loop";
import { getStorefrontProducts } from "@/lib/storefront-data";

export const dynamic = "force-dynamic";

const outlineButtonClass =
  "!bg-black !text-white border border-white/20 px-8 py-6 text-sm font-black uppercase tracking-[0.25em] transition hover:!bg-white/10 hover:!text-white active:!bg-white/10 focus:!bg-black focus:!text-white";

function DropDivider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <section className="overflow-hidden bg-white py-4 text-black">
      <div className="whitespace-nowrap text-2xl font-black uppercase tracking-wide md:text-4xl">
        {children}
      </div>
    </section>
  );
}

function HeroEditorialSplit() {
  return (
    <section className="border-b border-white/10 bg-black text-white">
      <div className="grid min-h-[calc(100svh-120px)] lg:grid-cols-[36%_64%]">
        <div className="order-2 flex flex-col justify-between border-r border-white/10 px-5 py-10 md:px-10 lg:order-1 lg:min-h-[calc(100svh-120px)]">
          <div>
            <p className="mb-6 text-xs font-black uppercase tracking-[0.45em] text-neutral-600">
              Moda urbana · Street
            </p>

            <span className="inline-flex border border-white/25 px-4 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-neutral-300">
              Unisex
            </span>

            <h1 className="mt-10 text-6xl font-black uppercase leading-[0.82] tracking-tight md:text-8xl lg:text-7xl xl:text-8xl">
              Rystar
              <span className="block text-neutral-700">Studios</span>
            </h1>

            <p className="mt-8 max-w-md text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
              Limited drops, custom pieces y cultura streetwear desde Panamá.
              Pocas piezas. Sin restock.
            </p>

            <div className="mt-10 border border-white/25 bg-black p-2">
              <div className="overflow-hidden border border-white/10 bg-black">
                <HeroGlitchLoop />
              </div>
            </div>
          </div>

          <Link
            href="/shop"
            className={`${outlineButtonClass} group mt-10 flex items-center justify-between`}
          >
            Ver catálogo
            <span className="flex h-12 w-12 items-center justify-center border border-current text-2xl transition group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        <div className="order-1 min-h-[54vh] overflow-hidden lg:order-2 lg:min-h-[calc(100svh-120px)]">
          <img
            src="/hero/rystar-editorial-hero.webp"
            alt="Rystar Studios editorial campaign"
            className="h-full w-full object-cover object-[55%_center]"
          />
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const products = await getStorefrontProducts();

  const ss26Products = products.filter((product) =>
    product.tags.includes("SS26")
  );

  const ss25Products = products.filter((product) =>
    product.tags.includes("SS25")
  );

  return (
    <main>
      <HeroEditorialSplit />

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

      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <div className="mb-5 flex items-center gap-4">
              <span className="h-px w-16 bg-white/20" />

              <p className="text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
                Drop 001 — SS26
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h2 className="text-7xl font-black uppercase leading-[0.82] tracking-tight md:text-9xl">
                  Acid <span className="block text-neutral-600">Star</span>
                </h2>

                <p className="mt-8 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
                  Temporada 2026 · {ss26Products.length}{" "}
                  {ss26Products.length === 1 ? "piece" : "pieces"}
                </p>
              </div>

              <p className="max-w-sm text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
                Nuevo drop. Una pieza. Cantidades limitadas. Cuando se agota, se
                agota.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {ss26Products.map((product, index) => (
              <div key={product.id} className="md:col-span-1">
                <ProductCard product={product} />

                <div className="mt-4 flex items-start justify-between gap-4">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-700">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-800">
                    SS26
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DropDivider>
        DROP 001 — SS25 · TEMPORADA 2025 · TRUST THE PROCESS ·
      </DropDivider>

      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <div className="mb-5 flex items-center gap-4">
              <span className="h-px w-16 bg-white/20" />

              <p className="text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
                Drop 001 — SS25
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                <h2 className="text-7xl font-black uppercase leading-[0.82] tracking-tight md:text-9xl">
                  Trust
                  <span className="block text-neutral-600">The Process</span>
                </h2>

                <p className="mt-8 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
                  Temporada 2025 · {ss25Products.length}{" "}
                  {ss25Products.length === 1 ? "piece" : "pieces"}
                </p>
              </div>

              <p className="max-w-sm text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
                El drop que marcó el inicio. Piezas limitadas para quienes
                entienden el proceso.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {ss25Products.map((product, index) => (
              <div key={product.id}>
                <ProductCard product={product} />

                <div className="mt-4 flex items-start justify-between gap-4">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-700">
                    {String(index + 1).padStart(2, "0")}
                  </p>

                  <p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-800">
                    SS25
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/shop"
            className={`${outlineButtonClass} mt-12 flex items-center justify-center gap-4 text-center`}
          >
            Ver catálogo completo <span>→</span>
          </Link>
        </div>
      </section>

      <section className="border-y border-white/10 px-5 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <p className="mb-8 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
            Sobre el drop
          </p>

          <h2 className="max-w-6xl text-6xl font-black uppercase leading-[0.86] tracking-tight md:text-9xl">
            Hecho en pocas piezas.{" "}
            <span className="text-neutral-800">
              Para los que estuvieron desde el inicio.
            </span>
          </h2>

          <div className="mt-10 max-w-4xl space-y-5 text-base uppercase leading-8 tracking-wide text-neutral-500 md:text-lg">
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
        {[
          ["002", "Drop", "Primer drop temporada 2026"],
          ["0", "Restock", "Sin segunda oportunidad"],
          ["100", "%", "Proceso propio"],
          ["SS", "26", "Temporada 2026"],
        ].map(([number, label, note]) => (
          <div key={`${number}-${label}`} className="px-5 py-12 md:py-16">
            <div className="mx-auto max-w-7xl">
              <p className="text-7xl font-black uppercase leading-none md:text-9xl">
                {number}{" "}
                <span className="text-4xl text-neutral-600 md:text-6xl">
                  {label}
                </span>
              </p>

              <p className="mt-8 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
                {note}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-6 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
            Mailing list
          </p>

          <h2 className="text-6xl font-black uppercase leading-[0.85] md:text-9xl">
            First <span className="block text-neutral-600">Access</span>
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-base uppercase leading-8 tracking-wide text-neutral-500 md:text-lg">
            Próximos drops, piezas exclusivas y acceso anticipado. Sin spam.
            Solo lo que importa.
          </p>

          <form className="mt-10 border border-white/20">
            <input
              type="email"
              placeholder="Email address"
              className="w-full border-b border-white/20 bg-black px-6 py-6 text-center text-sm font-black uppercase tracking-[0.25em] text-white outline-none placeholder:text-neutral-700"
            />

            <button
              type="button"
              className="w-full border border-white/20 !bg-black px-6 py-6 text-sm font-black uppercase tracking-[0.25em] !text-white transition hover:!bg-white/10 hover:!text-white"
            >
              Join
            </button>
          </form>

          <p className="mt-8 text-xs font-black uppercase tracking-[0.3em] text-neutral-800">
            No spam · Unsubscribe anytime
          </p>
        </div>
      </section>

      <section id="contact" className="border-t border-white/10 px-5 py-20">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
            Need help?
          </p>

          <h2 className="max-w-5xl text-6xl font-black uppercase leading-[0.85] md:text-9xl">
            Questions before the drop?
          </h2>

          <p className="mt-8 text-base uppercase tracking-wide text-neutral-500 md:text-lg">
            Write us directly before your size disappears.
          </p>

          <div className="mt-10 grid gap-4">
            <a
              href="https://wa.me/50769115944"
              target="_blank"
              rel="noreferrer"
              className="bg-[#25D366] px-8 py-6 text-center text-sm font-black uppercase tracking-[0.25em] text-black transition hover:brightness-110"
            >
              WhatsApp
            </a>

            <Link href="/shop" className={`${outlineButtonClass} text-center`}>
              Ver drop
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}