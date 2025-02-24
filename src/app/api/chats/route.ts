import { NextResponse } from "next/server";

export async function POST() {
  try {
    //const user = await verifyAuth();
    //const body = await req.json();

    // Create chat room logic here

    return NextResponse.json({ message: "Chat room created" });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
