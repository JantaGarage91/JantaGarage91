import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the precise TypeScript Interface for the document
interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "WORKER";
  isActive: boolean;
}

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in the environment.");
}

// User Schema mapping
const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["ADMIN", "WORKER"], required: true },
  isActive: { type: Boolean, default: true }
});

const User = mongoose.models.User as mongoose.Model<IUser> || mongoose.model<IUser>("User", UserSchema);

async function setupAdminAccount(email: string, pass: string): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Successfully Connected to Database Registry");

    // Securely hash the password using bcryptjs
    const hashedPassword = await bcrypt.hash(pass, 10);
    
    // Find existing to update or create new
    const existingAdmin = await User.findOne({ 
      $or: [{ email: "bikers" }, { email: email.toLowerCase() }] 
    });

    if (existingAdmin) {
      existingAdmin.email = email.toLowerCase();
      existingAdmin.password = hashedPassword;
      existingAdmin.role = "ADMIN";
      await existingAdmin.save();
      console.log(`🔄 ADMIN [${email}] has been successfully updated and re-hashed.`);
    } else {
      await User.create({
        name: "Head Administrator",
        email: email.toLowerCase(),
        password: hashedPassword,
        role: "ADMIN"
      });
      console.log(`🚀 Brand new encrypted ADMIN account [${email}] has been initialized.`);
    }

    console.log("🎉 Secure Access Initialized Successfully.");
    process.exit(0);

  } catch (err) {
    console.error("❌ Fatal Error during Account Initialization:", err);
    process.exit(1);
  }
}

// Execution block for bikers@gmail.com / bikers123
setupAdminAccount("bikers@gmail.com", "bikers123");
