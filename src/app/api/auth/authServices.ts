import { authCookieService } from "@/lib/cookies";

type AuthResponse = {
  access_token: string;
  refresh_token: string;
};

export async function loginUser({
  username,
}: {
  username?: string | null;
}): Promise<boolean> {
  const accessToken = authCookieService.getAccessToken();

  const formData = new FormData();

  if (username) {
    formData.append("username", username as string);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/login`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      body: formData,
    }
  );

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

export async function createAccount({
  username,
}: {
  username?: string | null;
}): Promise<boolean> {
  const accessToken = authCookieService.getAccessToken();
  console.log("accessToken", accessToken);

  const formData = new FormData();

  if (username) {
    formData.append("username", username as string);
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: formData,
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
