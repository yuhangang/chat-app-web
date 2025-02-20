import { loginUser } from "@/app/api/auth/authServices";
import { authCookieService } from "../cookies";

export default async function authFetch(
  input: string | URL | globalThis.Request,
  init?: RequestInit
): Promise<Response> {
  if (authCookieService.isTokenExpired()) {
    await authCookieService.refetchToken();
  }

  var accessToken = authCookieService.getAccessToken();

  if (!accessToken) {
    console.log("No access token found, logging in...");
    let res = await loginUser({ username: null });

    if (res) {
      accessToken = authCookieService.getAccessToken();
    }
  }

  return await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
