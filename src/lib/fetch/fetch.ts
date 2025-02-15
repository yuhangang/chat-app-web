import { authCookieService } from "../cookies";

export default async function authFetch(
  input: string | URL | globalThis.Request,
  init?: RequestInit
): Promise<Response> {
  if (authCookieService.isTokenExpired()) {
    await authCookieService.refetchToken();
  }

  const accessToken = authCookieService.getAccessToken();

  return await fetch(input, {
    ...init,
    headers: {
      ...init?.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
