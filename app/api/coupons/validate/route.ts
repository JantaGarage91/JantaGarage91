import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/models/Coupon";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ 
      code: code.toUpperCase(), 
      isActive: true 
    });

    if (!coupon) {
      return NextResponse.json({ error: "Invalid or expired coupon code" }, { status: 404 });
    }

    // Optional: Check expiry date
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json({ error: "Coupon code has expired" }, { status: 410 });
    }

    return NextResponse.json({ 
      message: "Coupon validated", 
      discountPercent: coupon.discountPercent 
    }, { status: 200 });
    
  } catch (error: any) {
    return NextResponse.json({ error: "Validation failure" }, { status: 500 });
  }
}
