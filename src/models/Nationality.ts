import mongoose, { Schema, Document } from "mongoose";

export interface INationality extends Document {
  name: string;
  createdBy: string;
}

const NationalitySchema = new Schema<INationality>(
  {
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Nationality || mongoose.model<INationality>("Nationality", NationalitySchema);
