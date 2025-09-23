// import mongoose, { Schema, Document } from "mongoose";

// export interface ICourse extends Document {
//   courseType: string[]; // checkbox multiple values
//   language: mongoose.Types.ObjectId; // ref Training_language
//   instructor: mongoose.Types.ObjectId; // ref User (teacher only)
//   title: string;
//   thumbnail: string; // file path/url
//   coverPhoto: string; // file path/url
//   certificateBase: string; // file path/url
//   demoVideo: string;
//   videoSource: mongoose.Types.ObjectId; // ref Video_source
//   courseLevel: mongoose.Types.ObjectId; // ref Course_level
//   summary: string;
//   description: string;
//   certificate: "YES" | "NO";
//   createdAt: mongoose.Types.ObjectId;
// }

// const CourseSchema: Schema = new Schema(
//   {
//     courseType: {
//       type: [String],
//       required: [true, "Course type is required"],
//     },
//     language: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Training_language",
//       required: [true, "Language is required"],
//     },
//     instructor: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: [true, "Instructor is required"],
//     },
//     title: {
//       type: String,
//       required: [true, "Course title is required"],
//       trim: true,
//     },
//     thumbnail: {
//       type: String,
//       required: [true, "Thumbnail image is required"],
//     },
//     coverPhoto: {
//       type: String,
//       required: [true, "Cover photo is required"],
//     },
//     certificateBase: {
//       type: String,
//       required: [true, "Certificate base image is required"],
//     },
//     demoVideo: {
//       type: String,
//       required: [true, "Demo video link is required"],
//     },
//     videoSource: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Video_source",
//       required: [true, "Video source is required"],
//     },
//     courseLevel: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Course_level",
//       required: [true, "Course level is required"],
//     },
//     summary: {
//       type: String,
//       required: [true, "Course summary is required"],
//     },
//     description: {
//       type: String,
//       required: [true, "Course description is required"],
//     },
//     certificate: {
//       type: String,
//       enum: ["YES", "NO"],
//       required: [true, "Certificate selection is required"],
//     },
//     createdAt: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: [true, "CreatedBy is required"],
//     },
    
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Course ||
//   mongoose.model<ICourse>("Course", CourseSchema);

import mongoose, { Schema, Document } from "mongoose";

interface UpdateHistory {
  updatedAt: Date;
  updatedBy: mongoose.Types.ObjectId;
  changes: { field: string; oldValue: any; newValue: any }[];
}

export interface ICourse extends Document {
  courseType: string[];
  language: mongoose.Types.ObjectId;
  instructor: mongoose.Types.ObjectId;
  title: string;
  thumbnail: string;
  coverPhoto: string;
  certificateBase: string;
  demoVideo: string;
  videoSource: mongoose.Types.ObjectId;
  courseLevel: mongoose.Types.ObjectId;
  summary: string;
  description: string;
  certificate: "YES" | "NO";
  createdBy: mongoose.Types.ObjectId;
  updateHistory: UpdateHistory[];  // 👈 yahi field use karna hai
}

const CourseSchema = new Schema<ICourse>(
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
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
     
    },
//  required: [true, "CreatedBy is required"],
    // 👇 Edit History
    updateHistory: [
      {
        updatedAt: { type: Date, default: Date.now },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
        changes: [
          {
            field: { type: String },
            oldValue: { type: Schema.Types.Mixed },
            newValue: { type: Schema.Types.Mixed },
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Course ||
  mongoose.model<ICourse>("Course", CourseSchema);
