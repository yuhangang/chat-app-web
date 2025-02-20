import { authCookieService } from "@/lib/cookies";

type AuthResponse = {
  access_token: string;
  refresh_token: string;
};

export async function loginUser({
  username,
}: {
  username?: String | null;
}): Promise<boolean> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username }),
  });

  if (res.ok) {
    const data: AuthResponse | null = await res.json();

    if (data) {
      authCookieService.setAccessToken(data.access_token);
      authCookieService.setRefreshToken(data.refresh_token);

      return true;
    }
  }

  return false;
}
