// import mongoose, { Schema, Document } from "mongoose";

// export interface ICourse extends Document {
//   title: string;
//   description: string;
//   category: string;
//   createdBy: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const CourseSchema = new Schema<ICourse>(
//   {
//     title: { type: String, required: true },
//     description: { type: String, required: true },
//     category: { type: String, required: true },
//     createdBy: { type: String, required: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Course ||
//   mongoose.model<ICourse>("Course", CourseSchema);

import mongoose, { Schema, Document } from "mongoose";

export interface ICourse extends Document {
  courseType: string[]; // checkbox multiple values
  language: mongoose.Types.ObjectId; // ref Training_language
  instructor: mongoose.Types.ObjectId; // ref User (teacher only)
  title: string;
  thumbnail: string; // file path/url
  coverPhoto: string; // file path/url
  certificateBase: string; // file path/url
  demoVideo: string;
  videoSource: mongoose.Types.ObjectId; // ref Video_source
  courseLevel: mongoose.Types.ObjectId; // ref Course_level
  summary: string;
  description: string;
  certificate: "YES" | "NO";
  createBy: mongoose.Types.ObjectId;
}

const CourseSchema: Schema = new Schema(
  {
    courseType: {
      type: [String],
      required: [true, "Course type is required"],
    },
    language: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Training_language",
      required: [true, "Language is required"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
    },
    thumbnail: {
      type: String,
      required: [true, "Thumbnail image is required"],
    },
    coverPhoto: {
      type: String,
      required: [true, "Cover photo is required"],
    },
    certificateBase: {
      type: String,
      required: [true, "Certificate base image is required"],
    },
    demoVideo: {
      type: String,
      required: [true, "Demo video link is required"],
    },
    videoSource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video_source",
      required: [true, "Video source is required"],
    },
    courseLevel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course_level",
      required: [true, "Course level is required"],
    },
    summary: {
      type: String,
      required: [true, "Course summary is required"],
    },
    description: {
      type: String,
      required: [true, "Course description is required"],
    },
    certificate: {
      type: String,
      enum: ["YES", "NO"],
      required: [true, "Certificate selection is required"],
    },
    
  },
  { timestamps: true }
);

export default mongoose.models.Course ||
  mongoose.model<ICourse>("Course", CourseSchema);
