import { NextResponse, type NextRequest } from "next/server";

const ADMIN_SESSION_COOKIE = "rystar_admin_session";

function isPublicAdminPath(pathname: string) {
  return pathname === "/admin/login" || pathname === "/admin/logout";
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (isPublicAdminPath(pathname)) {
    return NextResponse.next();
  }

  const session = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (sessionSecret && session === sessionSecret) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/admin/login", request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};