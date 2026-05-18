"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
    href: "/custom",
  },
  {
    number: "04",
    label: "Contacto",
    href: "/contact",
  },
  {
    number: "05",
    label: "Search",
    href: "/search",
  },
];

function SearchIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="block shrink-0"
    >
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="M16 16L21 21" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg
      width="30"
      height="30"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="block shrink-0"
    >
      <path d="M6.5 8.5H17.5L18.5 21H5.5L6.5 8.5Z" />
      <path d="M9 8.5V6.5C9 4.6 10.35 3 12 3C13.65 3 15 4.6 15 6.5V8.5" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      className="block shrink-0"
    >
      <path d="M5 5L19 19" />
      <path d="M19 5L5 19" />
    </svg>
  );
}

export function SiteHeader() {
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 24);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="sticky top-0 z-50 bg-black">
        <div
          className={[
            "bg-white px-4 text-center font-black uppercase text-black transition-all duration-300",
            isScrolled
              ? "py-2 text-[9px] tracking-[0.24em]"
              : "py-3 text-[11px] tracking-[0.28em] md:text-xs",
          ].join(" ")}
        >
          Free shipping in Panama on orders over $100
        </div>

        <header className="border-b border-white/10 bg-black/95 backdrop-blur-xl">
          <div
            className={[
              "mx-auto grid max-w-7xl grid-cols-3 items-center px-5 transition-all duration-300",
              isScrolled ? "h-20" : "h-28",
            ].join(" ")}
          >
            <div className="flex items-center justify-start">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className={[
                  "group flex flex-col items-start justify-center transition-all duration-300",
                  isScrolled ? "h-11 w-11 gap-1.5" : "h-14 w-14 gap-2",
                ].join(" ")}
              >
                <span
                  className={[
                    "block rounded-full bg-white transition-all duration-300 group-hover:w-8",
                    isScrolled ? "h-0.5 w-8" : "h-1 w-11",
                  ].join(" ")}
                />
                <span
                  className={[
                    "block rounded-full bg-white transition-all duration-300",
                    isScrolled ? "h-0.5 w-8" : "h-1 w-11",
                  ].join(" ")}
                />
                <span
                  className={[
                    "block rounded-full bg-white transition-all duration-300 group-hover:w-6",
                    isScrolled ? "h-0.5 w-8" : "h-1 w-11",
                  ].join(" ")}
                />
              </button>
            </div>

            <div className="relative z-10 flex justify-center">
              <Link
                href="/"
                aria-label="Ir al inicio de Rystar Studios"
                className={[
                  "relative z-20 flex cursor-pointer items-center justify-center transition-all duration-300",
                  isScrolled ? "h-16 w-16" : "h-28 w-28",
                ].join(" ")}
              >
                <Image
                  src="/logo/rystar-logo.gif"
                  alt="Rystar Studios"
                  width={112}
                  height={112}
                  priority
                  unoptimized
                  className={[
                    "pointer-events-none object-contain transition-all duration-300",
                    isScrolled ? "h-14 w-14" : "h-24 w-24",
                  ].join(" ")}
                />
              </Link>
            </div>

            <div className="flex items-center justify-end gap-5">
              <Link
                href="/search"
                aria-label="Search"
                className={[
                  "flex items-center justify-center text-neutral-300 transition hover:text-white",
                  isScrolled ? "h-10 w-10" : "h-12 w-12",
                ].join(" ")}
              >
                <SearchIcon />
              </Link>

              <Link
                href="/cart"
                aria-label="Cart"
                className={[
                  "relative flex items-center justify-center text-neutral-300 transition hover:text-white",
                  isScrolled ? "h-10 w-10" : "h-12 w-12",
                ].join(" ")}
              >
                <BagIcon />

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
                className="flex h-20 w-20 items-center justify-center border border-white/20 text-white transition hover:bg-white hover:text-black"
              >
                <CloseIcon />
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