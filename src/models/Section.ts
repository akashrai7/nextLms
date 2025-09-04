import mongoose, { Schema, Document } from "mongoose";

export interface ISection extends Document {
  name: string;
  createdBy: string;
}

const SectionSchema = new Schema<ISection>(
  {
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Section || mongoose.model<ISection>("Section", SectionSchema);
