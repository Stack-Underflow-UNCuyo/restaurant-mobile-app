//corre en el servidor de Next antes de que cualquier pagina se renderice
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/signin", "/signup"];

function getRoleFromToken(token: string): string | null {
  try {
    const b64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(b64));
    return (payload.a as string[])?.[0] ?? null;
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));

  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }
  if (token && isPublic) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (token && !isPublic) {
    const role = getRoleFromToken(token);
    if (role === "ROLE_PERSONAL" && pathname !== "/profile") {
      return NextResponse.redirect(new URL("/profile", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images).*)"],
};
