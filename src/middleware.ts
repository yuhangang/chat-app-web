import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
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
    console.log("User is already logged in");
    return;
  }

  // TODO: Implement refresh token logic
  /*
  const refreshToken = request.cookies.get("refreshToken");

  if (refreshToken?.value) {
    const result = await fetch(
      `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/refresh`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${refreshToken.value}`,
        },
      }
    );
    if (result.ok) {
      const data = await result.json();
      authCookieService.setAccessToken(data.accessToken);
    } else {
      console.log(
        "Failed to refresh access token",
        result.status,
        refreshToken.value
      );
    }
  }
    */

  return NextResponse.next();
}
