import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_SESSION_COOKIE = "rystar_admin_session";

type AdminLoginPageProps = {
  searchParams: Promise<{
    error?: string;
    next?: string;
  }>;
};

async function loginAction(formData: FormData) {
  "use server";

  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminPassword || !sessionSecret) {
    redirect("/admin/login?error=config");
  }

  if (password !== adminPassword) {
    redirect("/admin/login?error=invalid");
  }

  const cookieStore = await cookies();

  cookieStore.set(ADMIN_SESSION_COOKIE, sessionSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });

  const safeNext =
    next.startsWith("/admin") && !next.startsWith("/admin/login")
      ? next
      : "/admin";

  redirect(safeNext);
}

export default async function AdminLoginPage({
  searchParams,
}: AdminLoginPageProps) {
  const params = await searchParams;

  const errorMessage =
    params.error === "invalid"
      ? "Password incorrecto."
      : params.error === "config"
        ? "Faltan variables ADMIN_PASSWORD o ADMIN_SESSION_SECRET."
        : "";

  return (
    <main className="flex min-h-screen items-center justify-center bg-black px-5 py-20 text-white">
      <section className="w-full max-w-xl border border-white/10 bg-white/[0.03] p-6 md:p-10">
        <Link
          href="/"
          className="mb-10 inline-flex border border-white/10 bg-black px-5 py-4 text-xs font-black uppercase tracking-[0.25em] text-neutral-400 transition hover:bg-white/10 hover:text-white"
        >
          ← Back to store
        </Link>

        <p className="mb-5 text-sm font-black uppercase tracking-[0.35em] text-neutral-600">
          Rystar Admin
        </p>

        <h1 className="text-6xl font-black uppercase leading-[0.85] tracking-tight md:text-8xl">
          Admin
          <span className="block text-neutral-700">Access</span>
        </h1>

        <p className="mt-6 text-sm uppercase leading-7 tracking-[0.16em] text-neutral-500">
          Ingresa el password para gestionar productos, colecciones, pedidos y
          checkout.
        </p>

        <form action={loginAction} className="mt-10 space-y-5">
          <input type="hidden" name="next" value={params.next ?? "/admin"} />

          <div>
            <label className="mb-3 block text-xs font-black uppercase tracking-[0.25em] text-neutral-600">
              Password
            </label>

            <input
              name="password"
              type="password"
              required
              autoFocus
              className="admin-input"
              placeholder="Admin password"
            />
          </div>

          {errorMessage && (
            <div className="border border-red-500/30 bg-red-500/10 p-4 text-sm font-black uppercase tracking-[0.16em] text-red-200">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full border border-white/20 !bg-black px-8 py-6 text-sm font-black uppercase tracking-[0.25em] !text-white transition hover:!bg-white/10 hover:!text-white"
          >
            Enter admin
          </button>
        </form>
      </section>
    </main>
  );
}