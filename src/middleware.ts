import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { authCookieService } from "./lib/cookies";

const protectedRoutes = ["/chats", "/users"];

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken");

  if (
    !token &&
    protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  } else if (token && request.nextUrl.pathname === "/login") {
    return;
  }

  if (authCookieService.isTokenExpired()) {
    await authCookieService.refetchToken();
  }

  return NextResponse.next();
}
