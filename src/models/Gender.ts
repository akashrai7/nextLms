import mongoose, { Schema, Document } from "mongoose";

export interface IGender extends Document {
  name: string;
  createdBy: string;
}

const GenderSchema = new Schema<IGender>(
  {
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Gender || mongoose.model<IGender>("Gender", GenderSchema);
