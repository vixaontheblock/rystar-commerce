import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import type { ReactNode } from "react";
import { db } from "@/lib/db";

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

async function createCollection(formData: FormData) {
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

  await db.collection.create({
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

export default function NewCollectionPage() {
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
            Add
            <span className="block text-neutral-700">Collection</span>
          </h1>

          <p className="mt-8 max-w-2xl text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
            Crea drops o colecciones para organizar productos por temporada,
            año y concepto visual.
          </p>
        </div>

        <form action={createCollection} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Nombre de la colección">
              <input
                name="title"
                required
                placeholder="Acid Star"
                className="admin-input"
              />
            </Field>

            <Field label="Slug">
              <input
                name="slug"
                placeholder="drop-001-ss26-acid-star"
                className="admin-input"
              />
            </Field>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Field label="Temporada">
              <input
                name="season"
                required
                placeholder="SS26"
                className="admin-input"
              />
            </Field>

            <Field label="Año">
              <input
                name="year"
                type="number"
                required
                min="2000"
                defaultValue="2026"
                className="admin-input"
              />
            </Field>

            <Field label="Posición">
              <input
                name="position"
                type="number"
                min="0"
                defaultValue="0"
                className="admin-input"
              />
            </Field>
          </div>

          <Field label="Descripción">
            <textarea
              name="description"
              rows={5}
              placeholder="Nuevo drop de temporada. Piezas limitadas, sin restock."
              className="admin-input resize-none leading-6"
            />
          </Field>

          <div className="border border-white/10 bg-white/[0.03] p-5">
            <label className="flex cursor-pointer items-center gap-4">
              <input
                name="isActive"
                type="checkbox"
                defaultChecked
                className="h-5 w-5 accent-white"
              />

              <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-400">
                Mostrar colección en la tienda
              </span>
            </label>
          </div>

          <div className="flex flex-col gap-4 border-t border-white/10 pt-8 md:flex-row">
            <button
              type="submit"
              className="border border-white/20 bg-white px-8 py-6 text-sm font-black uppercase tracking-[0.25em] text-black transition hover:bg-neutral-200"
            >
              Create collection
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