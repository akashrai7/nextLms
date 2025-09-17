// import mongoose, { Schema, Document } from "mongoose";

// export interface ICourse_level extends Document {
//   name: string;
//   createdBy: string;
// }

// const Course_levelSchema = new Schema<ICourse_level>(
//   {
//     name: { type: String, required: true },
//     createdBy: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Course_level || mongoose.model<ICourse_level>("Course_level", Course_levelSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface ICourse_level extends Document {
  name: string;
  createdBy: string;
}

const Course_levelSchema = new Schema<ICourse_level>(
  {
    name: { type: String, required: true },
    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Course_level ||
  mongoose.model<ICourse_level>("Course_level", Course_levelSchema);

