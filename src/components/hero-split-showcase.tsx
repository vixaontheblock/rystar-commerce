import Link from "next/link";

export function HeroSplitShowcase() {
  return (
    <section className="border-b border-white/10 bg-black text-white">
      <div className="grid min-h-[calc(100svh-120px)] lg:grid-cols-[34%_66%]">
        <div className="order-2 flex flex-col justify-between border-r border-white/10 px-6 py-10 md:px-10 lg:order-1">
          <div>
            <p className="mb-6 text-xs font-black uppercase tracking-[0.45em] text-neutral-500">
              Moda urbana · Street
            </p>

            <span className="inline-flex border border-white/30 px-4 py-2 text-[10px] font-black uppercase tracking-[0.24em] text-neutral-300">
              Unisex
            </span>

            <div className="mt-10">
              <p className="font-serif text-5xl italic leading-none text-white md:text-6xl">
                Rystar Studios
              </p>
            </div>

            <div className="mt-12 border border-white/35 p-2">
              <div className="flex aspect-[16/10] items-center justify-center border border-white/20 bg-black">
                <img
                  src="/logo/rystar-logo.gif"
                  alt="Rystar Studios logo"
                  className="h-40 w-40 object-contain opacity-90"
                />
              </div>
            </div>
          </div>

          <Link
            href="/shop"
            className="mt-12 flex items-center justify-between border border-white/35 px-7 py-6 text-xs font-black uppercase tracking-[0.3em] text-white transition hover:bg-white hover:text-black"
          >
            Ver catálogo
            <span className="flex h-7 w-7 items-center justify-center border border-current">
              →
            </span>
          </Link>
        </div>

        <div className="order-1 min-h-[52vh] overflow-hidden lg:order-2 lg:min-h-[calc(100svh-120px)]">
          <img
            src="/hero/rystar-editorial-hero.webp"
            alt="Rystar Studios editorial campaign"
            className="h-full w-full object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}