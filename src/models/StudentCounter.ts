import mongoose, { Schema, Document } from "mongoose";

export interface IStudentCounter extends Document {
  year: number;
  seq: number;
}

const StudentCounterSchema = new Schema<IStudentCounter>({
  year: { type: Number, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

const StudentCounter =
  (mongoose.models.StudentCounter as mongoose.Model<IStudentCounter>) ||
  mongoose.model<IStudentCounter>("StudentCounter", StudentCounterSchema);

export default StudentCounter;
