import mongoose, { Schema, Document } from "mongoose";

export interface IVideo_source extends Document {
  name: string;
  createdBy: string;
}

const Video_sourceSchema = new Schema<IVideo_source>(
  {
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Video_source || mongoose.model<IVideo_source>("Video_source", Video_sourceSchema);
