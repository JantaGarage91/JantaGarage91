import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Inquiry from "@/models/Inquiry";

export async function GET() {
  try {
    await connectDB();
    // Fetch all inquiries sorted by newest first
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });

    return NextResponse.json(inquiries, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Inquiries Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: "ID and status are required" },
        { status: 400 }
      );
    }

    const updatedInquiry = await Inquiry.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    return NextResponse.json(updatedInquiry, { status: 200 });
  } catch (error: any) {
    console.error("Update Inquiry Error:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500 }
    );
  }
}
