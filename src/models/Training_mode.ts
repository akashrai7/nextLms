import mongoose, { Schema, Document } from "mongoose";

export interface Itraining_mode extends Document {
  name: string;
  createdBy: string;
}

const Training_modeSchema = new Schema<Itraining_mode>(
  {
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Training_mode || mongoose.model<Itraining_mode>("Training_mode", Training_modeSchema);
