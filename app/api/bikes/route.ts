import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Bike from "@/models/Bike";

export async function GET() {
  try {
    await connectDB();
    const bikes = await Bike.find({}).sort({ createdAt: -1 });
    return NextResponse.json(bikes, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    
    if (!data.vehicleNumber) {
      return NextResponse.json({ error: "Vehicle number is required" }, { status: 400 });
    }

    const existing = await Bike.findOne({ vehicleNumber: data.vehicleNumber });
    if (existing) {
      return NextResponse.json({ error: "Vehicle with this number already exists" }, { status: 409 });
    }

    const newBike = new Bike(data);
    await newBike.save();
    return NextResponse.json({ message: "Vehicle added successfully", bike: newBike }, { status: 201 });
  } catch (error: any) {
    console.error("Add Vehicle Error:", error);
    return NextResponse.json({ error: error.message || "Failed to add vehicle" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectDB();
    const { id, ...updateData } = await req.json();
    
    if (!id) return NextResponse.json({ error: "Vehicle ID is required" }, { status: 400 });

    const updated = await Bike.findByIdAndUpdate(id, updateData, { new: true });
    if (!updated) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });

    return NextResponse.json({ message: "Vehicle updated successfully", bike: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Vehicle ID is required" }, { status: 400 });

    const deleted = await Bike.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Vehicle not found" }, { status: 404 });

    return NextResponse.json({ message: "Vehicle deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 });
  }
}
