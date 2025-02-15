import { authCookieService } from "@/lib/cookies";
import { useRouter } from "next/navigation";
import { useState } from "react";

type AuthResponse = {
  access_token: string;
  refresh_token: string;
};

export const useLogin = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // api end point from env API_ENDPOINT

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data: AuthResponse | null = await res.json();

      if (data) {
        authCookieService.setAccessToken(data.access_token);
        authCookieService.setRefreshToken(data.refresh_token);
      }

      if (res.ok) {
        router.replace("/chats");
        router.refresh();
      } else {
        setError("Login failed");
      }
    } catch (error) {
      console.error(error);
      setError("Network error. Please try again.");
    }
  };

  return { username, error, setUsername, handleSubmit };
};
