import { createAccount, loginUser } from "@/app/api/auth/authServices";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const useLogin = () => {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const login = async () => {
    setError("");

    try {
      // api end point from env API_ENDPOINT

      const success = await loginUser({ username: username });

      if (success) {
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

  const signUp = async () => {
    setError("");

    try {
      // api end point from env API_ENDPOINT

      const success = await createAccount({ username: username });

      if (success) {
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

  return { username, error, setUsername, login, signUp };
};
