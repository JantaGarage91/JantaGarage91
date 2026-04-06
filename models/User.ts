import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "WORKER" | "USER";
  isActive: boolean;
  aadhaarUrl?: string;
  dlUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ["ADMIN", "WORKER", "USER"], 
      required: true,
      default: "USER"
    },
    isActive: { type: Boolean, default: true },
    aadhaarUrl: { type: String },
    dlUrl: { type: String },
  },
  { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
