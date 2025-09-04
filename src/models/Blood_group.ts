import mongoose, { Schema, Document } from "mongoose";

export interface IBlood_group extends Document {
  name: string;
  createdBy: string;
}

const Blood_groupSchema = new Schema<IBlood_group>(
  {
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Blood_group || mongoose.model<IBlood_group>("Blood_group", Blood_groupSchema);
