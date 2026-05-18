"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/types/product";

type SearchClientProps = {
  products: Product[];
};

const quickSearches = ["Acid Star", "Trust The Process", "Tristar", "SS26"];

export function SearchClient({ products }: SearchClientProps) {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return products;
    }

    return products.filter((product) => {
      return (
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery) ||
        product.tags.some((tag) => tag.toLowerCase().includes(normalizedQuery))
      );
    });
  }, [products, query]);

  return (
    <section className="mx-auto max-w-7xl">
      <div className="border border-white/10 bg-white/[0.03] p-5 md:p-8">
        <p className="mb-5 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
          Search
        </p>

        <h1 className="text-6xl font-black uppercase leading-[0.85] tracking-tight md:text-8xl">
          Buscar
        </h1>

        <p className="mt-6 max-w-2xl text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
          Encuentra piezas por nombre, temporada, colección o drop.
        </p>

        <div className="mt-10">
          <input
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar producto..."
            className="w-full border border-white/15 bg-black px-5 py-6 text-sm font-black uppercase tracking-[0.25em] text-white outline-none transition placeholder:text-neutral-700 focus:border-white"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {quickSearches.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setQuery(item)}
              className="border border-white/15 px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-neutral-400 transition hover:border-white hover:text-white"
            >
              {item}
            </button>
          ))}

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="border border-white bg-white px-4 py-3 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:bg-neutral-200"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between border-b border-white/10 pb-5">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-600">
          Resultados
        </p>

        <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-600">
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "producto" : "productos"}
        </p>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, index) => (
            <div key={product.id}>
              <ProductCard product={product} />

              <div className="mt-4 flex items-start justify-between gap-4">
                <p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-700">
                  {String(index + 1).padStart(2, "0")}
                </p>

                <p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-800">
                  Search result
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-10 border border-white/10 bg-white/[0.03] p-10 text-center">
          <h2 className="text-4xl font-black uppercase">
            No encontramos resultados
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm uppercase leading-7 tracking-[0.16em] text-neutral-600">
            Intenta buscar por nombre del producto, colección o temporada.
          </p>

          <Link
            href="/shop"
            className="mt-8 inline-flex border border-white/15 px-8 py-5 text-xs font-black uppercase tracking-[0.25em] transition hover:border-white hover:bg-white hover:text-black"
          >
            Ver catálogo completo
          </Link>
        </div>
      )}
    </section>
  );
}