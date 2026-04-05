import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Coupon from "@/models/Coupon";

export async function GET() {
  try {
    await connectDB();
    
    // Find highest discount percent among active and non-expired coupons
    const bestCoupon = await Coupon.findOne({ 
      isActive: true,
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gt: new Date() } }
      ]
    }).sort({ discountPercent: -1 });

    if (!bestCoupon) {
      return NextResponse.json({ message: "No active coupons found" }, { status: 404 });
    }

    return NextResponse.json({ 
      code: bestCoupon.code,
      discountPercent: bestCoupon.discountPercent
    }, { status: 200 });
    
  } catch (error: any) {
    return NextResponse.json({ error: "Discovery failure" }, { status: 500 });
  }
}
