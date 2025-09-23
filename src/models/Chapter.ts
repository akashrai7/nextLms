import mongoose, { Schema, Document } from "mongoose";

export interface IChapter extends Document {
  name: string;
  createdBy: string;
}

const ChapterSchema = new Schema<IChapter>(
  {
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Chapter || mongoose.model<IChapter>("Chapter", ChapterSchema);
