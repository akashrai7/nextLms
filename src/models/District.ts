import mongoose, { Schema, Document, Types } from "mongoose";

export interface IDistrict extends Document {
  name: string;
  stateId: Types.ObjectId;
}

const DistrictSchema = new Schema<IDistrict>({
  name: { type: String, required: true },
  stateId: { type: Schema.Types.ObjectId, ref: "State", required: true },
});

export default mongoose.models.District || mongoose.model<IDistrict>("District", DistrictSchema);
