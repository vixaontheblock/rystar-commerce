import Link from "next/link";
import type { Product } from "@/types/product";
import { formatMoney } from "@/lib/money";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] transition hover:-translate-y-1 hover:border-white/25"
    >
      <div className="aspect-[4/5] overflow-hidden bg-neutral-900">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      </div>

      <div className="p-5">
        <p className="mb-2 text-xs uppercase tracking-[0.25em] text-neutral-500">
          {product.category}
        </p>

        <div className="flex items-start justify-between gap-4">
          <h3 className="text-lg font-bold">{product.name}</h3>
          <p className="font-semibold">{formatMoney(product.price)}</p>
        </div>

        <p className="mt-3 line-clamp-2 text-sm leading-6 text-neutral-400">
          {product.description}
        </p>
      </div>
    </Link>
  );
}