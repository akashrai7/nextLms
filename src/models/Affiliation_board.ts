import mongoose, { Schema, Document } from "mongoose";

export interface IAffiliation_board extends Document {
  name: string;
  createdBy: string;
}

const Affiliation_boardSchema = new Schema<IAffiliation_board>(
  {
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Affiliation_board || mongoose.model<IAffiliation_board>("Affiliation_board", Affiliation_boardSchema);
