import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  createdBy: string;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);
