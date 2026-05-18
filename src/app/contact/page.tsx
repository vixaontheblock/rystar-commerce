import Link from "next/link";
import { ContactFormClient } from "@/components/contact-form-client";

const WHATSAPP_NUMBER = "50769115944";

export default function ContactPage() {
  return (
    <main className="bg-black px-5 py-16 text-white">
      <section className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="border border-white/10 bg-white/[0.03] p-5 md:p-8">
          <div className="mb-8 flex items-center gap-4">
            <span className="h-px w-12 bg-white/20" />
            <p className="text-xs font-black uppercase tracking-[0.35em] text-neutral-500">
              Contacto
            </p>
          </div>

          <h1 className="text-6xl font-black uppercase leading-[0.82] tracking-tight md:text-8xl">
            Contacto
          </h1>

          <p className="mt-8 max-w-xl text-sm leading-7 text-neutral-400">
            ¿Tienes dudas sobre tallas, envíos o disponibilidad? Escríbenos y
            te respondemos lo antes posible.
          </p>

          <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
            <div className="py-6">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
                Email
              </p>
              <a
                href="mailto:rystarstudios@gmail.com"
                className="text-sm font-black uppercase tracking-[0.18em] text-white transition hover:text-neutral-400"
              >
                rystarstudios@gmail.com
              </a>
            </div>

            <div className="py-6">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
                WhatsApp
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-black uppercase tracking-[0.18em] text-white transition hover:text-neutral-400"
              >
                +50769115944
              </a>
            </div>

            <div className="py-6">
              <p className="mb-3 text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
                Location
              </p>
              <p className="text-sm font-black uppercase tracking-[0.18em] text-white">
                Panamá
              </p>
            </div>
          </div>

          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="mt-8 flex w-full items-center justify-center bg-white px-8 py-6 text-xs font-black uppercase tracking-[0.3em] text-black transition hover:bg-neutral-200"
          >
            Escribir por WhatsApp
          </a>
        </div>

        <ContactFormClient />
      </section>

      <section className="mx-auto mt-20 max-w-7xl border-t border-white/10 pt-16">
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
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
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
      </section>
    </main>
  );
}