"use client";

import Link from "next/link";
import { useCart } from "@/context/cart-context";

export function SiteHeader() {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5">
        <Link href="/" className="text-lg font-black uppercase tracking-tight">
          Rystar
        </Link>

        <nav className="hidden items-center gap-8 text-sm text-neutral-300 md:flex">
          <Link href="/shop" className="transition hover:text-white">
            Shop
          </Link>

          <Link href="/cart" className="transition hover:text-white">
            Cart
          </Link>
        </nav>

        <Link
          href="/cart"
          className="rounded-full border border-white/15 px-5 py-2 text-sm font-semibold transition hover:border-white hover:bg-white hover:text-black"
        >
          Cart {totalItems > 0 ? `(${totalItems})` : ""}
        </Link>
      </div>
    </header>
  );
}
