import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Booking from "@/models/Booking";
import Bike from "@/models/Bike";

export async function POST(req: Request) {
  try {
    await connectDB();
    const data = await req.json();
    console.log("Confirmed Booking Payload:", JSON.stringify(data, null, 2));

    // Ensure bikeId is present
    const bikeId = data.bike?.bikeId;
    if (!bikeId) {
       console.error("VALIDATION FAILED: No bikeId in payload");
       return NextResponse.json({ error: "Missing required vehicle identity (bikeId)" }, { status: 400 });
    }

    const newBooking = new Booking(data);
    await newBooking.save();
    console.log("Booking record created successfully with ID:", newBooking._id);

    try {
        // Calculate all dates in range plus 1-day buffer
        const start = new Date(data.pickupDate);
        const end = new Date(data.dropoffDate);
        const datesToBlock: string[] = [];
        
        let curr = new Date(start);
        while (curr <= end) {
            datesToBlock.push(curr.toISOString().split('T')[0]);
            curr.setDate(curr.getDate() + 1);
        }
        
        // Add one more day as buffer
        datesToBlock.push(curr.toISOString().split('T')[0]);

        await Bike.findByIdAndUpdate(bikeId, { 
            status: "BOOKED",
            $addToSet: { unavailableDates: { $each: datesToBlock } }
        });
        console.log(`Vehicle ${bikeId} status synchronized to BOOKED with buffer dates.`);
    } catch (bikeErr: any) {
        console.warn("Soft Error: Could not update vehicle status/dates, booking saved anyway.", bikeErr.message);
    }

    return NextResponse.json({ 
       message: "Booking confirmed and synchronized", 
       bookingId: newBooking.bookingId,
       id: newBooking._id 
    }, { status: 201 });
  } catch (error: any) {
    console.error("BREAKING: Confirm Booking Error Flow:", error);
    return NextResponse.json({ 
       error: error.message || "Internal Confirmation Error",
       details: error.errors ? Object.keys(error.errors) : undefined
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const bookings = await Booking.find({}).sort({ createdAt: -1 });
    return NextResponse.json(bookings, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch bookings" }, { status: 500 });
  }
}
