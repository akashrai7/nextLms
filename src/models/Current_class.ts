import mongoose, { Schema, Document } from "mongoose";

export interface ICurrent_class extends Document {
  name: string;
  createdBy: string;
}

const Current_classSchema = new Schema<ICurrent_class>(
  {
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Current_class || mongoose.model<ICurrent_class>("Current_class", Current_classSchema);
