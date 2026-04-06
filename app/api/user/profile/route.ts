import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { userId, aadhaarUrl, dlUrl } = body;

    if (!userId) {
      return NextResponse.json({ error: "Missing identity reference" }, { status: 400 });
    }

    const updateData: any = {};
    if (aadhaarUrl !== undefined) updateData.aadhaarUrl = aadhaarUrl;
    if (dlUrl !== undefined) updateData.dlUrl = dlUrl;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User identity not located" }, { status: 404 });
    }

    // Don't send back password
    const userResp = {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      aadhaarUrl: updatedUser.aadhaarUrl,
      dlUrl: updatedUser.dlUrl
    };

    return NextResponse.json(userResp);
  } catch (error: any) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal profile synchronization failure" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "No identity reference provided" }, { status: 400 });
    }

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json({ error: "User identity not located" }, { status: 404 });
    }

    const userResp = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      aadhaarUrl: user.aadhaarUrl || "",
      dlUrl: user.dlUrl || "",
    };

    return NextResponse.json(userResp);
  } catch (error: any) {
    console.error("Profile fetch error:", error);
    return NextResponse.json({ error: "Internal synchronization failure" }, { status: 500 });
  }
}
