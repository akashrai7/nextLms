import mongoose, { Schema, Document } from "mongoose";

export interface Iinstitute_type extends Document {
  name: string;
  createdBy: string;
}

const Institute_typeSchema = new Schema<Iinstitute_type>(
  {
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Institute_type || mongoose.model<Iinstitute_type>("Institute_type", Institute_typeSchema);
