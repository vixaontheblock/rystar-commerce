import Link from "next/link";

type SuccessPageProps = {
  searchParams: Promise<{
    order?: string;
  }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const { order } = await searchParams;

  return (
    <main className="px-5 py-24">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-white/10 bg-white/[0.03] p-8 text-center md:p-14">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-black text-black">
          ✓
        </div>

        <p className="mt-8 text-sm uppercase tracking-[0.35em] text-neutral-500">
          Order completed
        </p>

        <h1 className="mt-4 text-5xl font-black uppercase tracking-tight md:text-7xl">
          Thank you for your order.
        </h1>

        <p className="mt-6 text-neutral-400">
          Orden demo:{" "}
          <span className="font-bold text-white">{order ?? "RY-DEMO"}</span>
        </p>

        <div className="mx-auto mt-10 grid max-w-2xl gap-4 text-left md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-black p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
              Step 1
            </p>
            <p className="mt-2 font-bold">Order received</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
              Step 2
            </p>
            <p className="mt-2 font-bold">Payment pending</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black p-5">
            <p className="text-xs uppercase tracking-[0.25em] text-neutral-500">
              Step 3
            </p>
            <p className="mt-2 font-bold">Delivery soon</p>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-xl text-sm leading-6 text-neutral-500">
          En la versión real, esta página se mostrará después de que TiloPay
          confirme el pago correctamente.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/shop"
            className="rounded-full bg-white px-8 py-4 text-sm font-black uppercase tracking-wide text-black"
          >
            Back to shop
          </Link>

          <Link
            href="/"
            className="rounded-full border border-white/15 px-8 py-4 text-sm font-black uppercase tracking-wide transition hover:border-white"
          >
            Home
          </Link>
        </div>
      </section>
    </main>
  );
}