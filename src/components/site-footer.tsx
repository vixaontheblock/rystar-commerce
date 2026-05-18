import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black px-5 py-16 text-white">
      <div className="mx-auto max-w-7xl">
        <div>
          <h2 className="text-6xl font-black uppercase leading-none tracking-tight md:text-8xl">
            Rystar
          </h2>

          <p className="mt-6 max-w-xl text-lg uppercase tracking-[0.16em] text-neutral-500">
            No es una colección. Es el comienzo.
          </p>
        </div>

        <div className="mt-14 grid gap-12 md:grid-cols-3">
          <div>
            <p className="mb-8 text-sm font-black uppercase tracking-[0.35em] text-neutral-700">
              Shop
            </p>

            <nav className="space-y-6">
              <Link
                href="/shop"
                className="block text-sm font-black uppercase tracking-[0.24em] text-neutral-500 transition hover:text-white"
              >
                Todos los productos
              </Link>

              <Link
                href="/shop#ss26-acid-star"
                className="block text-sm font-black uppercase tracking-[0.24em] text-neutral-500 transition hover:text-white"
              >
                Drop 001 - Acid Star
              </Link>

              <Link
                href="/shop#ss25-trust-the-process"
                className="block text-sm font-black uppercase tracking-[0.24em] text-neutral-500 transition hover:text-white"
              >
                Drop 001 - Trust The Process
              </Link>

              <Link
                href="/custom"
                className="block text-sm font-black uppercase tracking-[0.24em] text-neutral-500 transition hover:text-white"
              >
                Custom
              </Link>
            </nav>
          </div>

          <div>
            <p className="mb-8 text-sm font-black uppercase tracking-[0.35em] text-neutral-700">
              Info
            </p>

            <nav className="space-y-6">
              <Link
                href="/contact"
                className="block text-sm font-black uppercase tracking-[0.24em] text-neutral-500 transition hover:text-white"
              >
                Contacto
              </Link>

              <Link
                href="/shipping"
                className="block text-sm font-black uppercase tracking-[0.24em] text-neutral-500 transition hover:text-white"
              >
                Envíos
              </Link>

              <Link
                href="/returns"
                className="block text-sm font-black uppercase tracking-[0.24em] text-neutral-500 transition hover:text-white"
              >
                Devoluciones
              </Link>

              <Link
                href="/privacy"
                className="block text-sm font-black uppercase tracking-[0.24em] text-neutral-500 transition hover:text-white"
              >
                Privacidad
              </Link>
            </nav>
          </div>

          <div>
            <p className="mb-8 text-sm font-black uppercase tracking-[0.35em] text-neutral-700">
              Social
            </p>

            <nav className="space-y-6">
              <a
                href="https://www.instagram.com/rystarstudios"
                target="_blank"
                rel="noreferrer"
                className="block text-sm font-black uppercase tracking-[0.24em] text-neutral-500 transition hover:text-white"
              >
                Instagram
              </a>

              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="block text-sm font-black uppercase tracking-[0.24em] text-neutral-500 transition hover:text-white"
              >
                TikTok
              </a>

              <a
                href="https://wa.me/50769115944"
                target="_blank"
                rel="noreferrer"
                className="block text-sm font-black uppercase tracking-[0.24em] text-neutral-500 transition hover:text-white"
              >
                WhatsApp
              </a>
            </nav>
          </div>
        </div>

        <div className="mt-16 border-t border-white/10 pt-10">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-neutral-700">
              © 2026 Rystar
            </p>

            <a
              href="https://ruptastudios.com"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-black uppercase tracking-[0.25em] text-neutral-700 transition hover:text-white"
            >
              Developed by Rupta Studios
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}