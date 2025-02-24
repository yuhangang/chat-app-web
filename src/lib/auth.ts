import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "fallback-secret-key"
);

export async function verifyAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken");

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const verified = await jwtVerify(token.value, JWT_SECRET);
    return verified.payload;
  } catch {
    throw new Error("Unauthorized");
  }
}
