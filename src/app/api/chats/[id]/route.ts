import { verifyAuth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await verifyAuth();

    // Get chat room logic here

    return NextResponse.json({ chatId: id });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

//export async function POST(
//  req: Request,
//  { params }: { params: { id: string } }
//) {
//  try {
//    const user = await verifyAuth();
//    const body = await req.json();
//
//    // Create message logic here
//
//    return NextResponse.json({ message: "Message sent" });
//  } catch (error) {
//    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//  }
//}
