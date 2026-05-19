import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ReactNode } from "react";
import { db } from "@/lib/db";

type CollectionEditPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseNumber(value: FormDataEntryValue | null, fallback: number) {
  const numberValue = Number(value ?? fallback);

  if (Number.isNaN(numberValue)) {
    return fallback;
  }

  return numberValue;
}

async function updateCollection(collectionId: string, formData: FormData) {
  "use server";

  const title = String(formData.get("title") ?? "").trim();
  const manualSlug = String(formData.get("slug") ?? "").trim();
  const season = String(formData.get("season") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();

  if (!title) {
    throw new Error("Collection title is required.");
  }

  if (!season) {
    throw new Error("Season is required.");
  }

  const slug = manualSlug ? slugify(manualSlug) : slugify(title);
  const year = parseNumber(formData.get("year"), new Date().getFullYear());
  const position = parseNumber(formData.get("position"), 0);
  const isActive = formData.get("isActive") === "on";

  await db.collection.update({
    where: {
      id: collectionId,
    },
    data: {
      title,
      slug,
      season,
      year,
      description,
      position,
      isActive,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin");
}

export default async function CollectionEditPage({
  params,
}: CollectionEditPageProps) {
  const { id } = await params;

  const collection = await db.collection.findUnique({
    where: {
      id,
    },
    include: {
      products: {
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  if (!collection) {
    notFound();
  }

  const updateCollectionWithId = updateCollection.bind(null, collection.id);

  return (
    <main className="bg-black px-5 py-16 text-white md:py-24">
      <section className="mx-auto max-w-5xl">
        <div className="mb-10">
          <Link
            href="/admin"
            className="inline-flex border border-white/10 bg-black px-5 py-4 text-xs font-black uppercase tracking-[0.25em] text-neutral-400 transition hover:bg-white/10 hover:text-white"
          >
            ← Back to admin
          </Link>

          <p className="mt-10 mb-5 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
            Admin · Collections
          </p>

          <h1 className="text-6xl font-black uppercase leading-[0.85] tracking-tight md:text-8xl">
            Edit
            <span className="block text-neutral-700">Collection</span>
          </h1>

          <p className="mt-8 max-w-2xl text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
            Edita el drop o colección desde la base de datos. Los productos
            asignados a esta colección se muestran debajo.
          </p>
        </div>

        <form action={updateCollectionWithId} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Nombre de la colección">
              <input
                name="title"
                required
                defaultValue={collection.title}
                className="admin-input"
              />
            </Field>

            <Field label="Slug">
              <input
                name="slug"
                defaultValue={collection.slug}
                className="admin-input"
              />
            </Field>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Field label="Temporada">
              <input
                name="season"
                required
                defaultValue={collection.season}
                className="admin-input"
              />
            </Field>

            <Field label="Año">
              <input
                name="year"
                type="number"
                required
                min="2000"
                defaultValue={collection.year}
                className="admin-input"
              />
            </Field>

            <Field label="Posición">
              <input
                name="position"
                type="number"
                min="0"
                defaultValue={collection.position}
                className="admin-input"
              />
            </Field>
          </div>

          <Field label="Descripción">
            <textarea
              name="description"
              rows={5}
              defaultValue={collection.description ?? ""}
              className="admin-input resize-none leading-6"
            />
          </Field>

          <div className="border border-white/10 bg-white/[0.03] p-5">
            <label className="flex cursor-pointer items-center gap-4">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked={collection.isActive}
                className="h-5 w-5 accent-white"
              />

              <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-400">
                Mostrar colección en la tienda
              </span>
            </label>
          </div>

          <div className="border border-white/10 bg-white/[0.03] p-5">
            <p className="mb-5 text-xs font-black uppercase tracking-[0.3em] text-neutral-700">
              Productos en esta colección
            </p>

            {collection.products.length > 0 ? (
              <div className="space-y-3">
                {collection.products.map((product) => (
                  <div
                    key={product.id}
                    className="grid gap-4 border border-white/10 bg-black p-4 md:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <p className="text-sm font-black uppercase">
                        {product.name}
                      </p>

                      <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-700">
                        {product.slug}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="border border-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">
                        {product.status}
                      </span>

                      <Link
                        href={`/admin/products/${product.id}`}
                        className="border border-white/10 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-neutral-400 transition hover:bg-white/10 hover:text-white"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border border-white/10 bg-black p-6 text-center">
                <p className="text-xs font-black uppercase leading-6 tracking-[0.22em] text-neutral-700">
                  No hay productos asignados a esta colección todavía.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row">
            <button
              type="submit"
              className="border border-white/20 bg-white px-8 py-6 text-sm font-black uppercase tracking-[0.25em] text-black transition hover:bg-neutral-200"
            >
              Save changes
            </button>

            <Link
              href="/admin"
              className="border border-white/10 bg-black px-8 py-6 text-center text-sm font-black uppercase tracking-[0.25em] text-neutral-400 transition hover:bg-white/10 hover:text-white"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="border border-white/10 bg-white/[0.03] p-5">
      <label className="mb-3 block text-xs font-black uppercase tracking-[0.25em] text-neutral-600">
        {label}
      </label>

      {children}
    </div>
  );
}