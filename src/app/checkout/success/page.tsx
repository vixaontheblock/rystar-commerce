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
      <section className="mx-auto max-w-3xl text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-neutral-500">
          Order completed
        </p>

        <h1 className="text-5xl font-black uppercase md:text-7xl">
          Thank you for your order.
        </h1>

        <p className="mt-6 text-neutral-400">
          Orden demo:{" "}
          <span className="font-bold text-white">{order ?? "RY-DEMO"}</span>
        </p>

        <p className="mt-4 text-neutral-500">
          En la siguiente fase esta orden se guardará en la base de datos y se
          validará con TiloPay.
        </p>

        <Link
          href="/shop"
          className="mt-10 inline-flex rounded-full bg-white px-8 py-4 text-sm font-black uppercase tracking-wide text-black"
        >
          Back to shop
        </Link>
      </section>
    </main>
  );
}