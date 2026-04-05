import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Worker from "@/models/Worker";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { workerId, name, phone, email, address, password } = await request.json();

    if (!workerId || !name || !phone || !email || !address || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Check if workerId exists
    const existingWorker = await Worker.findOne({ workerId });
    if (existingWorker) {
      return NextResponse.json({ error: "Worker ID already exists" }, { status: 409 });
    }

    // Securely hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newWorker = new Worker({
      workerId,
      name,
      phone,
      email,
      address,
      passwordHash,
    });

    await newWorker.save();

    return NextResponse.json({ message: "Worker identity created successfully!", worker: newWorker }, { status: 201 });
  } catch (error: any) {
    console.error("Worker Creation Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    // Return workers with high-level info, omit passwordHash entirely
    const workers = await Worker.find({}, { passwordHash: 0 }).sort({ createdAt: -1 });
    return NextResponse.json(workers, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Workers Error:", error);
    return NextResponse.json({ error: "Failed to fetch workers" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const { id, name, phone, email, address, password } = await request.json();

    if (!id) return NextResponse.json({ error: "Worker ID is required" }, { status: 400 });

    const updateData: any = { name, phone, email, address };
    
    // If a new password is provided, hash it
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(password, salt);
    }

    const updatedWorker = await Worker.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updatedWorker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });

    return NextResponse.json({ message: "Worker updated successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update worker" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Worker ID is required" }, { status: 400 });

    const deletedWorker = await Worker.findByIdAndDelete(id);
    if (!deletedWorker) return NextResponse.json({ error: "Worker not found" }, { status: 404 });

    return NextResponse.json({ message: "Worker deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete worker" }, { status: 500 });
  }
}
