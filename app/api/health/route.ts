import { NextResponse } from "next/server";
import connectDB from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ status: "success", message: "MongoDB connected successfully!" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database connection failed";
    return NextResponse.json({ status: "unhealthy", error: message }, { status: 500 });
  }
}
