import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inquiry from "@/models/Inquiry";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const inquiry = await Inquiry.create({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json(
      { message: "Inquiry submitted successfully", data: inquiry },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Inquiry Submission Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error. Please try again later." },
      { status: 500 }
    );
  }
}
