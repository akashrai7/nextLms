import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  dob: Date;
  email: string;
  mobile: string;
  password: string;
  role: "admin" | "teacher" | "student";
  registrationId: string;
  fatherName?: string;
  motherName?: string;
  gender?: string;
  nationality?: string;
  aadhaar?: string;
  guardianName?: string;
  guardianContact?: string;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  pinCode?: string;
  currentClass?: string;
  stream?: string;
  section?: string;
  bloodGroup?: string;
  category?: string;
  disability?: string;
  photo?: string;
}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dob: { type: Date, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "teacher", "student"], required: true },
    registrationId: { type: String, required: true, unique: true },

    fatherName: String,
    motherName: String,
    gender: String,
    nationality: String,
    aadhaar: String,
    guardianName: String,
    guardianContact: String,
    address: String,
    city: String,
    district: String,
    state: String,
    pinCode: String,
    currentClass: String,
    stream: String,
    section: String,
    bloodGroup: String,
    category: String,
    disability: String,
    photo: String,
  },
  { timestamps: true }
);


const User = mongoose.models.User<IUser> || mongoose.model<IUser>("User", UserSchema);
export default User;

//export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
