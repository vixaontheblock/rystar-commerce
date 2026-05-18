"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { Product } from "@/types/product";

type ShopClientProps = {
  products: Product[];
};

export function ShopClient({ products }: ShopClientProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((product) => product.category))
    );

    return ["All", ...uniqueCategories];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.tags.some((tag) =>
          tag.toLowerCase().includes(query.toLowerCase())
        );

      const matchesCategory =
        category === "All" || product.category === category;

      return matchesQuery && matchesCategory;
    });
  }, [products, query, category]);

  return (
    <section className="mx-auto max-w-7xl">
      <div className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-5 md:p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products..."
            className="h-14 rounded-full border border-white/10 bg-black px-6 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-white"
          />

          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0">
            {categories.map((item) => {
              const active = item === category;

              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={[
                    "h-14 whitespace-nowrap rounded-full border px-5 text-sm font-bold transition",
                    active
                      ? "border-white bg-white text-black"
                      : "border-white/10 text-neutral-300 hover:border-white hover:text-white",
                  ].join(" ")}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between text-sm text-neutral-500">
          <p>
            Showing{" "}
            <span className="font-bold text-white">
              {filteredProducts.length}
            </span>{" "}
            products
          </p>

          {(query || category !== "All") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
              className="font-bold text-neutral-300 transition hover:text-white"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filteredProducts.length > 0 ? (
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-12 text-center">
          <h2 className="text-3xl font-black uppercase">No products found</h2>
          <p className="mt-4 text-neutral-500">
            Try another search or category.
          </p>
        </div>
      )}
    </section>
  );
}