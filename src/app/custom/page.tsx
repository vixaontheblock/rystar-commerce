import Link from "next/link";
import { CustomOrderClient } from "@/components/custom-order-client";

export default function CustomPage() {
  return (
    <main>
      <section className="relative min-h-[82vh] overflow-hidden bg-black px-5 py-24 text-white">
        <div className="absolute inset-0 bg-[url('/custom/custom-hero.jpg')] bg-cover bg-center opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/40" />

        <div className="relative mx-auto flex min-h-[65vh] max-w-7xl flex-col justify-end">
          <p className="mb-5 text-sm font-black uppercase tracking-[0.35em] text-neutral-400">
            Rystar Studios · Custom Program
          </p>

          <h1 className="max-w-5xl text-6xl font-black uppercase leading-[0.85] tracking-tight md:text-8xl">
            JD Custom
          </h1>

          <p className="mt-6 max-w-xl text-sm uppercase leading-7 tracking-[0.16em] text-neutral-300">
            Create your own piece. Designed your way.
          </p>

          <div className="mt-8">
            <Link
              href="#custom-order"
              className="inline-flex bg-white px-8 py-5 text-xs font-black uppercase tracking-[0.25em] text-black transition hover:bg-neutral-200"
            >
              Inicia tu personalización
            </Link>
          </div>
        </div>
      </section>

      <section id="custom-order">
        <CustomOrderClient />
      </section>

      <section className="border-t border-white/10 bg-black px-5 py-20 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-end justify-between gap-6">
            <h2 className="text-5xl font-black uppercase leading-[0.85] md:text-7xl">
              Custom
              <br />
              Pieces
            </h2>

            <Link
              href="/shop"
              className="hidden border border-white/15 px-6 py-4 text-xs font-black uppercase tracking-[0.25em] transition hover:border-white hover:bg-white hover:text-black md:block"
            >
              Ver todo →
            </Link>
          </div>

          <div className="mt-10 border-y border-dashed border-white/10 py-10 text-center">
            <p className="text-xs font-black uppercase leading-6 tracking-[0.25em] text-neutral-600">
              Asigna una colección en el editor del tema para mostrar productos
              aquí.
            </p>
          </div>

          <p className="mt-8 text-xs font-black uppercase tracking-[0.25em] text-neutral-700">
            Rystar Studios · Custom Program · All pieces made to order
          </p>
        </div>
      </section>

      <section
        id="contact"
        className="border-t border-white/10 bg-black px-5 py-20 text-white"
      >
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