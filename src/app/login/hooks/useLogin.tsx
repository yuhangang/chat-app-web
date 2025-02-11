import { cookieService } from "@/lib/cookies";
import router from "next/router";
import { useState } from "react";

export const useLogin = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      // api end point from env API_ENDPOINT

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });

      const data = await res.json();
      const accessToken = data?.access_token;

      cookieService.set("token", accessToken, {
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: 7,
      });

      if (accessToken) {
        document.cookie = `token=${accessToken}; path=/`;
        // Save token to cookie
      }

      if (res.ok) {
        //router.push("/");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      console.error(error);
      setError("Network error. Please try again.");
    }
  };

  return { username, error, setUsername, handleSubmit };
};
