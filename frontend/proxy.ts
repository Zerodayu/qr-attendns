import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/api/") || pathname.startsWith("/auth/")) {
    const target = process.env.API_URL ?? "http://localhost:8080";
    const url = new URL(pathname + search, target);
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*", "/auth/:path*"],
};
