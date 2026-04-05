import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Worker from "@/models/Worker";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { workerId, password } = await req.json();

    if (!workerId || !password) {
      return NextResponse.json({ error: "Worker ID and passcode are required" }, { status: 400 });
    }

    const worker = await Worker.findOne({ workerId });
    if (!worker) {
      return NextResponse.json({ error: "Invalid Worker ID" }, { status: 401 });
    }

    // Check password (matching the logic in worker creation)
    // Note: In a real app, use bcrypt. For now, matching the creation logic.
    if (worker.passwordHash !== password) {
      return NextResponse.json({ error: "Incorrect passcode" }, { status: 401 });
    }

    if (worker.status !== "ACTIVE") {
      return NextResponse.json({ error: "This account has been deactivated" }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      message: "Login successful!",
      worker: {
        id: worker._id,
        workerId: worker.workerId,
        name: worker.name,
        role: "WORKER",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
