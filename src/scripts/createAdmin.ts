import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";

async function createAdmin() {
  try {
    await dbConnect();

    const existingAdmin = await User.findOne({ role: "admin" });
    if (existingAdmin) {
      console.log("❌ Admin already exists with email:", existingAdmin.email);
      process.exit(0);
    }

    const hash = await bcrypt.hash("Admin@123", 10); // Default password

    const admin = await User.create({
      registrationId: "25ADM00001",
      role: "admin",
      firstName: "Super",
      lastName: "Admin",
      dob: new Date("1990-01-01"),
      email: "admin@gmail.com",
      mobile: "9999999999",
      password: hash,
    });

    console.log("✅ Admin created successfully:", admin.email);
    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();
