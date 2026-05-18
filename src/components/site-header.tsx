"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/cart-context";

const menuItems = [
  {
    number: "01",
    label: "Inicio",
    href: "/",
  },
  {
    number: "02",
    label: "Catálogo",
    href: "/shop",
  },
  {
    number: "03",
    label: "Custom",
    href: "/shop",
  },
  {
    number: "04",
    label: "Contacto",
    href: "#contact",
  },
  {
    number: "05",
    label: "Search",
    href: "/shop",
  },
];

export function SiteHeader() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <>
      <div className="sticky top-0 z-50">
        <div className="bg-white px-4 py-3 text-center text-[11px] font-black uppercase tracking-[0.28em] text-black md:text-xs">
          Free shipping in Panama on orders over $100
        </div>

        <header className="border-b border-white/10 bg-black/95 backdrop-blur-xl">
          <div className="mx-auto grid h-24 max-w-7xl grid-cols-3 items-center px-5">
            <div className="flex items-center justify-start">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className="group flex h-12 w-12 flex-col items-start justify-center gap-2"
              >
                <span className="block h-1 w-10 rounded-full bg-white transition group-hover:w-8" />
                <span className="block h-1 w-10 rounded-full bg-white transition group-hover:w-10" />
                <span className="block h-1 w-10 rounded-full bg-white transition group-hover:w-6" />
              </button>
            </div>

            <div className="flex justify-center">
              <Link
                href="/"
                className="text-3xl font-black uppercase leading-none tracking-tight text-white"
              >
                R
              </Link>
            </div>

            <div className="flex items-center justify-end gap-5">
              <Link
                href="/shop"
                aria-label="Search"
                className="relative flex h-10 w-10 items-center justify-center"
              >
                <span className="block h-7 w-7 rounded-full border-2 border-neutral-300" />
                <span className="absolute bottom-1 right-1 h-4 w-0.5 rotate-[-45deg] bg-neutral-300" />
              </Link>

              <Link
                href="/cart"
                aria-label="Cart"
                className="relative flex h-10 w-10 items-center justify-center text-white"
              >
                <span className="text-2xl leading-none">♧</span>

                <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1 text-xs font-black text-black">
                  {totalItems}
                </span>
              </Link>
            </div>
          </div>
        </header>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black text-white">
          <div className="border-b border-white/10 px-7 py-10">
            <div className="flex items-center justify-between gap-6">
              <Link
                href="/"
                onClick={closeMenu}
                className="text-5xl font-black uppercase tracking-tight md:text-7xl"
              >
                Rystar
              </Link>

              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="relative flex h-20 w-20 items-center justify-center border border-white/20 transition hover:bg-white hover:text-black"
              >
                <span className="absolute h-12 w-1 rotate-45 bg-current" />
                <span className="absolute h-12 w-1 -rotate-45 bg-current" />
              </button>
            </div>
          </div>

          <div className="border-b border-white/10 px-7 py-8">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
              SS26 · DROP 001
            </p>

            <p className="mt-6 text-xl uppercase tracking-[0.12em] text-neutral-300 md:text-2xl">
              First you're crazy, then you're visionary.
            </p>
          </div>

          <nav>
            {menuItems.map((item) => (
              <Link
                key={item.number}
                href={item.href}
                onClick={closeMenu}
                className="group grid grid-cols-[50px_1fr_40px] items-center border-b border-white/10 px-7 py-8 transition hover:bg-white hover:text-black md:grid-cols-[80px_1fr_60px]"
              >
                <span className="text-sm font-black text-neutral-700 transition group-hover:text-black">
                  {item.number}
                </span>

                <span className="text-5xl font-black uppercase leading-none tracking-tight text-neutral-500 transition group-hover:translate-x-2 group-hover:text-black md:text-8xl">
                  {item.label}
                </span>

                <span className="text-3xl text-neutral-700 transition group-hover:translate-x-2 group-hover:text-black">
                  →
                </span>
              </Link>
            ))}
          </nav>

          <div className="px-7 py-10">
            <Link
              href="/shop"
              onClick={closeMenu}
              className="flex w-full items-center justify-center bg-white px-8 py-7 text-sm font-black uppercase tracking-[0.3em] text-black transition hover:bg-neutral-200"
            >
              Ver el drop
            </Link>

            <div className="mt-8 border border-white/10 p-6">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-neutral-600">
                Rystar Studios
              </p>
              <p className="mt-3 text-sm uppercase leading-6 tracking-[0.16em] text-neutral-400">
                No es una colección. Es el comienzo.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}