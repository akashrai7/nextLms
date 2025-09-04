import mongoose, { Schema, Document } from "mongoose";

export interface IStream extends Document {
  name: string;
  createdBy: string;
}

const StreamSchema = new Schema<IStream>(
  {
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Stream || mongoose.model<IStream>("Stream", StreamSchema);
