import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/models/Coupon";

export async function GET() {
  try {
    await connectDB();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return NextResponse.json(coupons, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const { code, discountPercent, expiryDate } = await req.json();
    
    if (!code || !discountPercent) {
      return NextResponse.json({ error: "Code and discount percentage are required" }, { status: 400 });
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    }

    const newCoupon = new Coupon({ 
      code: code.toUpperCase(), 
      discountPercent, 
      expiryDate,
      isActive: true
    });
    await newCoupon.save();
    return NextResponse.json({ message: "Coupon created successfully", coupon: newCoupon }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create coupon" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id, isActive } = await req.json();
    
    if (!id) return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });

    const updated = await Coupon.findByIdAndUpdate(id, { isActive }, { new: true });
    if (!updated) return NextResponse.json({ error: "Coupon not found" }, { status: 404 });

    return NextResponse.json({ message: "Coupon status updated", coupon: updated }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Coupon ID is required" }, { status: 400 });

    const deleted = await Coupon.findByIdAndDelete(id);
    if (!deleted) return NextResponse.json({ error: "Coupon not found" }, { status: 404 });

    return NextResponse.json({ message: "Coupon deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
