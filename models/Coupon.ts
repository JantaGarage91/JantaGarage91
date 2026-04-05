import mongoose, { Schema, Document } from "mongoose";

export interface ICouponDoc extends Document {
  code: string;
  discountPercent: number;
  isActive: boolean;
  expiryDate?: Date;
}

const CouponSchema = new Schema<ICouponDoc>(
  {
    code: { type: String, required: true, unique: true, uppercase: true },
    discountPercent: { type: Number, required: true, min: 1, max: 100 },
    isActive: { type: Boolean, default: true },
    expiryDate: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model<ICouponDoc>("Coupon", CouponSchema);
