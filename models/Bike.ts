import mongoose, { Schema, Document } from "mongoose";

export interface IBikeDoc extends Document {
  name: string;
  bikeModel: string;
  vehicleNumber: string;
  category: "BIKE" | "SCOOTY";
  cc: number;
  pricePerDay: number;
  image: string;
  status: "AVAILABLE" | "BOOKED" | "MAINTENANCE";
  description: string;
  isActive: boolean;
  features: string[];
  unavailableDates?: string[]; // Array of strings in YYYY-MM-DD format
}

const BikeSchema = new Schema<IBikeDoc>(
  {
    name: { type: String, required: true },
    bikeModel: { type: String, required: true },
    vehicleNumber: { type: String, required: true, unique: true },
    category: { type: String, required: true, enum: ["BIKE", "SCOOTY"] },
    cc: { type: Number, required: true },
    pricePerDay: { type: Number, required: true, default: 0 },
    image: { type: String, required: true },
    status: { type: String, enum: ["AVAILABLE", "BOOKED", "MAINTENANCE"], default: "AVAILABLE" },
    isActive: { type: Boolean, default: true },
    description: { type: String, default: "Premium vehicle from our elite fleet." }, 
    features: [{ type: String }],
    unavailableDates: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Bike || mongoose.model<IBikeDoc>("Bike", BikeSchema);
