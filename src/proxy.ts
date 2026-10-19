/**
 * 관리자 전용 경로 보호 (1차, 쿠키 서명만 확인). 각 페이지도 서버에서 다시 확인한다.
 */
import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifySessionToken } from "@/lib/admin/session";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (pathname === "/admin/login") return noindex(NextResponse.next());

  if (!verifySessionToken(request.cookies.get(ADMIN_COOKIE)?.value, Date.now())) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname + search);
    return noindex(NextResponse.redirect(login));
  }
  return noindex(NextResponse.next());
}

function noindex(res: NextResponse) {
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/sources", "/sources/:path*"],
};
