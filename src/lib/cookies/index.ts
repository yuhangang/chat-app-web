import Cookies from "js-cookie";

// Cookie management utility functions
export const cookieService = {
  // Set a cookie
  set: (name: string, value: string, options?: Cookies.CookieAttributes) => {
    console.log("Setting cookie", name, value, options);
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
  setToken: (token: string) => {
    cookieService.set("token", token, {
      // Optional: set expiration, secure, etc.
      expires: 7, // expires in 7 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  },

  // Get auth token
  getToken: () => {
    return cookieService.get("token");
  },

  // Remove auth token
  removeToken: () => {
    cookieService.remove("token");
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!cookieService.get("token");
  },
};
