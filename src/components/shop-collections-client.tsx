"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/types/product";

type Collection = {
  id: string;
  label: string;
  title: string;
  season: string;
  year: string;
  tag: string;
  description: string;
};

const collections: Collection[] = [
  {
    id: "ss26-acid-star",
    label: "Drop 001 — SS26",
    title: "Acid Star",
    season: "SS26",
    year: "2026",
    tag: "SS26",
    description:
      "Nuevo drop de temporada 2026. Una pieza, cantidades limitadas y sin restock.",
  },
  {
    id: "ss25-trust-the-process",
    label: "Drop 001 — SS25",
    title: "Trust The Process",
    season: "SS25",
    year: "2025",
    tag: "SS25",
    description:
      "El drop que marcó el inicio. Piezas limitadas para quienes entienden el proceso.",
  },
];

type ShopCollectionsClientProps = {
  products: Product[];
};

export function ShopCollectionsClient({ products }: ShopCollectionsClientProps) {
  const [query, setQuery] = useState("");
  const [activeCollection, setActiveCollection] = useState("all");

  const filteredCollections = useMemo(() => {
    return collections
      .map((collection) => {
        const collectionProducts = products.filter((product) => {
          const belongsToCollection = product.tags.includes(collection.tag);

          const matchesQuery =
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase()) ||
            product.tags.some((tag) =>
              tag.toLowerCase().includes(query.toLowerCase())
            );

          const matchesCollection =
            activeCollection === "all" || activeCollection === collection.id;

          return belongsToCollection && matchesQuery && matchesCollection;
        });

        return {
          ...collection,
          products: collectionProducts,
        };
      })
      .filter((collection) => collection.products.length > 0);
  }, [products, query, activeCollection]);

  const totalVisibleProducts = filteredCollections.reduce(
    (total, collection) => total + collection.products.length,
    0
  );

  return (
    <section className="mx-auto max-w-7xl">
      <div className="border border-white/10 bg-white/[0.03] p-5 md:p-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="mb-4 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
              Collections
            </p>

            <h1 className="text-6xl font-black uppercase leading-[0.85] tracking-tight md:text-8xl">
              Catálogo
            </h1>

            <p className="mt-5 max-w-2xl text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
              Explora las piezas por temporada, drop y colección. Limited
              pieces. No restock.
            </p>
          </div>

          <div className="border border-white/10 p-5 lg:min-w-64">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
              Showing
            </p>

            <p className="mt-3 text-5xl font-black uppercase leading-none">
              {totalVisibleProducts}
            </p>

            <p className="mt-2 text-xs font-black uppercase tracking-[0.25em] text-neutral-700">
              Products
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_auto]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar producto..."
            className="h-16 border border-white/15 bg-black px-5 text-xs font-black uppercase tracking-[0.25em] text-white outline-none transition placeholder:text-neutral-700 focus:border-white"
          />

          <div className="flex gap-3 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveCollection("all")}
              className={[
                "h-16 whitespace-nowrap border px-5 text-xs font-black uppercase tracking-[0.22em] transition",
                activeCollection === "all"
                  ? "border-white bg-white text-black"
                  : "border-white/15 text-white hover:border-white",
              ].join(" ")}
            >
              Todas
            </button>

            {collections.map((collection) => (
              <button
                key={collection.id}
                type="button"
                onClick={() => setActiveCollection(collection.id)}
                className={[
                  "h-16 whitespace-nowrap border px-5 text-xs font-black uppercase tracking-[0.22em] transition",
                  activeCollection === collection.id
                    ? "border-white bg-white text-black"
                    : "border-white/15 text-white hover:border-white",
                ].join(" ")}
              >
                {collection.season}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filteredCollections.length > 0 ? (
        <div className="mt-16 space-y-24">
          {filteredCollections.map((collection) => (
            <section
              key={collection.id}
              id={collection.id}
              className="scroll-mt-40"
            >
              <div className="mb-10 grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
                <div>
                  <div className="mb-5 flex items-center gap-4">
                    <span className="h-px w-16 bg-white/20" />

                    <p className="text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
                      {collection.label}
                    </p>
                  </div>

                  <h2 className="text-6xl font-black uppercase leading-[0.82] tracking-tight md:text-8xl">
                    {collection.title.split(" ")[0]}{" "}
                    <span className="block text-neutral-600">
                      {collection.title.split(" ").slice(1).join(" ")}
                    </span>
                  </h2>

                  <p className="mt-6 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
                    Temporada {collection.year} ·{" "}
                    {collection.products.length}{" "}
                    {collection.products.length === 1 ? "piece" : "pieces"}
                  </p>
                </div>

                <p className="max-w-sm text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
                  {collection.description}
                </p>
              </div>

              <div
                className={[
                  "grid gap-6",
                  collection.products.length === 1
                    ? "md:grid-cols-3"
                    : "md:grid-cols-2",
                ].join(" ")}
              >
                {collection.products.map((product, index) => (
                  <div key={product.id}>
                    <ProductCard product={product} />

                    <div className="mt-4 flex items-start justify-between gap-4">
                      <p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-700">
                        {String(index + 1).padStart(2, "0")}
                      </p>

                      <p className="text-xs font-black uppercase tracking-[0.25em] text-neutral-800">
                        {collection.season}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="mt-16 border border-white/10 bg-white/[0.03] p-12 text-center">
          <h2 className="text-4xl font-black uppercase">No products found</h2>

          <p className="mt-4 text-sm uppercase tracking-[0.18em] text-neutral-600">
            Intenta con otra búsqueda o colección.
          </p>

          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveCollection("all");
            }}
            className="mt-8 border border-white/15 px-8 py-5 text-xs font-black uppercase tracking-[0.25em] transition hover:border-white hover:bg-white hover:text-black"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </section>
  );
}