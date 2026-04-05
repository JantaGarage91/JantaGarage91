import mongoose, { Schema, Document } from "mongoose";

export interface IWorker extends Document {
  workerId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  passwordHash: string;
  status: "ACTIVE" | "INACTIVE";
}

const WorkerSchema = new Schema<IWorker>(
  {
    workerId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    address: { type: String, required: true },
    passwordHash: { type: String, required: true },
    status: { type: String, enum: ["ACTIVE", "INACTIVE"], default: "ACTIVE" },
  },
  { timestamps: true }
);

export default mongoose.models.Worker || mongoose.model<IWorker>("Worker", WorkerSchema);
