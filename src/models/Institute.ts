import mongoose, { Schema, Document } from "mongoose";

export interface IInstitute extends Document {
  name: string;
  schoolCode?: string;
  instituteType: mongoose.Types.ObjectId;
  affiliationBoard: mongoose.Types.ObjectId;
  principalName: string;
  officialMobile: string;
  alternateMobile?: string;
  officialEmail: string;
  institutePhone?: string;
  officialWebsite?: string;
  fullAddress: string;
  city: string;
  district: mongoose.Types.ObjectId;
  state: mongoose.Types.ObjectId;
  pincode: string;
  trainingMode: string;
  trainingLanguage: string;
  computerLab: "Yes" | "No" | "Partial";
  computerCount?: number;
  schoolRegCertificate: string;
  institutePAN: string;
  createdBy?: mongoose.Types.ObjectId;
}

const InstituteSchema = new Schema(
  {
    name: { type: String, required: true },
    schoolCode: { type: String },
    instituteType: { type: Schema.Types.ObjectId, ref: "institute_type", required: true },
    affiliationBoard: { type: Schema.Types.ObjectId, ref: "affiliation_board", required: true },
    principalName: { type: String, required: true },
    officialMobile: { type: String, required: true },
    alternateMobile: { type: String },
    officialEmail: { type: String, required: true },
    institutePhone: { type: String },
    officialWebsite: { type: String },
    fullAddress: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: Schema.Types.ObjectId, ref: "districts", required: true },
    state: { type: Schema.Types.ObjectId, ref: "states", required: true },
    pincode: { type: String, required: true },
    trainingMode: { type: String, required: true },
    trainingLanguage: { type: String, required: true },
    computerLab: { type: String, enum: ["Yes", "No", "Partial"], required: true },
    computerCount: { type: Number },
    schoolRegCertificate: { type: String, required: true },
    institutePAN: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "users" }
  },
  { timestamps: true }
);

export default mongoose.models.Institute ||
  mongoose.model<IInstitute>("Institute", InstituteSchema);
