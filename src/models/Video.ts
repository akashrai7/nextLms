import mongoose, { Schema, Document } from "mongoose";

export interface IVideo extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  playbackUrl: string;
  posterUrl?: string;
  durationSec: number;
  orderIndex: number;
  createdBy: string;
}

const VideoSchema: Schema = new Schema(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    playbackUrl: { type: String, required: true },
    posterUrl: { type: String },
    durationSec: { type: Number, required: true },
    orderIndex: { type: Number, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Video ||
  mongoose.model<IVideo>("Video", VideoSchema);
