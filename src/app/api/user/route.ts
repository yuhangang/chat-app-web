import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username } = body;

    // This will now expect the backend to provide the full response, including JWT
    const backendResponse = await fetch("http://localhost:3001", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });

    if (!backendResponse.ok) {
      return NextResponse.json(
        { error: "Failed to create user" },
        { status: backendResponse.status }
      );
    }

    const userData = await backendResponse.json();

    let cookiesInstance = await cookies();

    // Set the JWT from backend response
    await cookiesInstance.set("token", userData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 86400, // 24 hours
    });

    return NextResponse.json(userData);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
