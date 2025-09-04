import mongoose, { Schema, Document } from "mongoose";

export interface Itraining_language extends Document {
  name: string;
  createdBy: string;
}

const training_languageSchema = new Schema<Itraining_language>(
  {
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Training_language || mongoose.model<Itraining_language>("Training_language", training_languageSchema);
