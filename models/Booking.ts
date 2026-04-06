import mongoose, { Schema, Document } from "mongoose";

export interface IBookingDoc extends Document {
  bookingId: string;
  user: {
    name: string;
    email: string;
    aadhaarUrl?: string;
    dlUrl?: string;
  };
  bike: {
    bikeId: string;
    name: string;
    vehicleNumber: string;
  };
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  duration: number;
  totalPrice: number;
  status: "CONFIRMED" | "COMPLETED" | "CANCELLED";
}

const BookingSchema = new Schema<IBookingDoc>(
  {
    bookingId: { type: String, required: true, unique: true },
    user: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      aadhaarUrl: { type: String, required: false },
      dlUrl: { type: String, required: false },
    },
    bike: {
      bikeId: { type: Schema.Types.ObjectId, ref: "Bike", required: true },
      name: { type: String, required: true },
      vehicleNumber: { type: String, required: false },
    },
    pickupDate: { type: String, required: true },
    pickupTime: { type: String, required: true },
    dropoffDate: { type: String, required: true },
    dropoffTime: { type: String, required: true },
    duration: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    status: { type: String, default: "CONFIRMED", enum: ["CONFIRMED", "COMPLETED", "CANCELLED"] },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model<IBookingDoc>("Booking", BookingSchema);
