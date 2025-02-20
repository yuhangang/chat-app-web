import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

// Cookie management utility functions
export const cookieService = {
  // Set a cookie
  set: (name: string, value: string, options?: Cookies.CookieAttributes) => {
    Cookies.set(name, value, {
      // Default options
      path: "/",
      // Override or extend with provided options
      ...options,
    });
  },

  // Get a cookie value
  get: (name: string) => {
    return Cookies.get(name);
  },

  // Remove a cookie
  remove: (name: string, options?: Cookies.CookieAttributes) => {
    Cookies.remove(name, {
      path: "/",
      ...options,
    });
  },

  // Check if a cookie exists
  has: (name: string) => {
    return Cookies.get(name) !== undefined;
  },
};

// Specific token-related cookie helpers
export const authCookieService = {
  // Set auth token
  setAccessToken: (token: string) => {
    cookieService.set("accessToken", token, {
      // Optional: set expiration, secure, etc.
      expires: 7, // expires in 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  },
  setRefreshToken: (token: string) => {
    cookieService.set("refreshToken", token, {
      // Optional: set expiration, secure, etc.
      expires: 7, // expires in 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  },

  getAccessToken: () => {
    return cookieService.get("accessToken");
  },
  getRefreshToken: () => {
    return cookieService.get("refreshToken");
  },

  // Remove auth token
  removeToken: () => {
    cookieService.remove("accessToken");
    cookieService.remove("refreshToken");
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return cookieService.has("accessToken");
  },
  isTokenExpired: () => {
    const token = cookieService.get("accessToken");

    if (!token) {
      return false;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Current time in seconds

      if (decoded.exp && decoded.exp < currentTime) {
        // Token has expired
        return true;
      } else {
        // Token is still valid
        return false;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      console.log("Token expired", token);
      return true; // If there's an error, consider the token expired
    }
  },
  refetchToken: async () => {
    const refreshToken = authCookieService.getRefreshToken();

    if (refreshToken) {
      const result = await fetch(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        }
      );
      if (result.ok) {
        const data = await result.json();

        if (data.access_token) {
          authCookieService.setAccessToken(data.access_token);
        } else {
          console.error("No access token in response", data);
          return;
        }

        console.log("Access token refreshed");
      } else {
        console.log("Failed to refresh access token");
      }
    }
  },
};
