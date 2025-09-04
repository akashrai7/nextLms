// import mongoose from "mongoose";
// import Course from "@models/Course";
// import Video from "@models/Video";

// const MONGODB_URI = process.env.MONGODB_URI!;
// const IK_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT!;

// async function seed() {
//   await mongoose.connect(MONGODB_URI);

//   await Course.deleteMany({});
//   await Video.deleteMany({});

//   const jsCourse = await Course.create({
//     title: "HTML Basics",
//     slug: "js-basics",
//     description: "Learn the fundamentals of HTML.",
//     thumbnailUrl: `${IK_ENDPOINT}/courses/js-basics/thumbnails/html.jpg`,
//   });

//   await Video.insertMany([
//     {
//       courseId: jsCourse._id,
//       title: "HTML",
//       orderIndex: 1,
//       playbackUrl: `${IK_ENDPOINT}/courses/js-basics/videos/video-1.mp4`,
//       posterUrl: `${IK_ENDPOINT}/courses/js-basics/thumbnails/html.jpg`,
//       durationSec: 300,
//     },
//     {
//       courseId: jsCourse._id,
//       title: "CSS",
//       orderIndex: 2,
//       playbackUrl: `${IK_ENDPOINT}/courses/js-basics/videos/video-2.mp4`,
//       posterUrl: `${IK_ENDPOINT}/courses/js-basics/thumbnails/css.jpg`,
//       durationSec: 420,
//     },
//     {
//       courseId: jsCourse._id,
//       title: "Json",
//       orderIndex: 3,
//       playbackUrl: `${IK_ENDPOINT}/courses/js-basics/videos/video-1.mp4`,
//       posterUrl: `${IK_ENDPOINT}/courses/js-basics/thumbnails/html.jpg`,
//       durationSec: 600,
//     },
//   ]);

//   console.log("✅ Seed data inserted!");
//   process.exit(0);
// }

// seed().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });

// src/scripts/seed.ts
import mongoose from "mongoose";
import Course from "../models/Course"; // ✅ relative path sahi rakha
import Video from "../models/Video";

const MONGODB_URI = process.env.MONGODB_URI!;
const IK_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT!;

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Purana data delete
    await Course.deleteMany({});
    await Video.deleteMany({});
    console.log("🗑 Old data removed");

    // Ek course create
    const jsCourse = await Course.create({
      title: "HTML Basics",
      slug: "js-basics",
      description: "Learn the fundamentals of HTML.",
      thumbnailUrl: `${IK_ENDPOINT}/courses/js-basics/thumbnails/html.jpg`,
    });

    // Uske andar videos create
    await Video.insertMany([
      {
        courseId: jsCourse._id,
        title: "HTML",
        orderIndex: 1,
        playbackUrl: `${IK_ENDPOINT}/courses/js-basics/videos/video-1.mp4`,
        posterUrl: `${IK_ENDPOINT}/courses/js-basics/thumbnails/html.jpg`,
        durationSec: 300,
      },
      {
        courseId: jsCourse._id,
        title: "CSS",
        orderIndex: 2,
        playbackUrl: `${IK_ENDPOINT}/courses/js-basics/videos/video-2.mp4`,
        posterUrl: `${IK_ENDPOINT}/courses/js-basics/thumbnails/css.jpg`,
        durationSec: 420,
      },
      {
        courseId: jsCourse._id,
        title: "JSON",
        orderIndex: 3,
        playbackUrl: `${IK_ENDPOINT}/courses/js-basics/videos/video-3.mp4`,
        posterUrl: `${IK_ENDPOINT}/courses/js-basics/thumbnails/json.jpg`,
        durationSec: 600,
      },
    ]);

    console.log("✅ Seed data inserted!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error while seeding:", err);
    process.exit(1);
  }
}

seed();
