import mongoose, { Schema, Document } from "mongoose";

export interface IAcademic_session extends Document {
  name: string;
  createdBy: string;
}

const Academic_sessionSchema = new Schema<IAcademic_session>(
  {
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Academic_session || mongoose.model<IAcademic_session>("Academic_session", Academic_sessionSchema);
