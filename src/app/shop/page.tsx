import Link from "next/link";
import { getStorefrontCollections } from "@/lib/storefront-data";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const collections = await getStorefrontCollections();
  const visibleCollections = collections.filter(
    (collection) => collection.products.length > 0
  );

  return (
    <main className="bg-black text-white">
      <section className="border-b border-white/10 px-5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
            Catálogo
          </p>

          <h1 className="text-6xl font-black uppercase leading-[0.85] tracking-tight md:text-9xl">
            Shop
            <span className="block text-neutral-700">Rystar</span>
          </h1>

          <p className="mt-8 max-w-2xl text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
            Productos conectados directamente a Neon. Todo lo que se active
            desde el admin aparece aquí automáticamente.
          </p>
        </div>
      </section>

      {visibleCollections.length === 0 ? (
        <section className="px-5 py-20">
          <div className="mx-auto max-w-4xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <h2 className="text-5xl font-black uppercase">
              No products yet
            </h2>

            <p className="mx-auto mt-6 max-w-xl text-sm uppercase leading-7 tracking-[0.16em] text-neutral-600">
              Crea productos activos desde el admin para mostrarlos en la
              tienda.
            </p>

            <Link
              href="/admin"
              className="mt-8 inline-flex border border-white/20 !bg-black px-8 py-5 text-sm font-black uppercase tracking-[0.25em] !text-white transition hover:!bg-white/10"
            >
              Go to admin
            </Link>
          </div>
        </section>
      ) : (
        <div>
          {visibleCollections.map((collection) => (
            <section
              key={collection.id}
              className="border-b border-white/10 px-5 py-20"
            >
              <div className="mx-auto max-w-7xl">
                <div className="mb-12">
                  <div className="mb-5 flex items-center gap-4">
                    <span className="h-px w-16 bg-white/20" />

                    <p className="text-sm font-black uppercase tracking-[0.35em] text-neutral-500">
                      {collection.slug}
                    </p>
                  </div>

                  <h2 className="text-6xl font-black uppercase leading-[0.85] tracking-tight md:text-8xl">
                    {collection.title}
                    <span className="block text-neutral-700">
                      {collection.season}
                    </span>
                  </h2>

                  <p className="mt-8 text-sm font-black uppercase tracking-[0.35em] text-neutral-500">
                    Temporada {collection.year} ·{" "}
                    {collection.products.length}{" "}
                    {collection.products.length === 1 ? "piece" : "pieces"}
                  </p>

                  {collection.description && (
                    <p className="mt-6 max-w-3xl text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
                      {collection.description}
                    </p>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {collection.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}