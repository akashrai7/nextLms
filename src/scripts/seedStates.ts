import mongoose from "mongoose";
import State from "@/models/State";
import District from "@/models/District";
import states from "./states.json";
import districts from "./districts.json";

const MONGODB_URI = process.env.MONGODB_URI!;

async function seed() {
  await mongoose.connect(MONGODB_URI);

  await State.deleteMany({});
  await District.deleteMany({});

  const insertedStates = await State.insertMany(states);

  // Map state names to IDs for districts
  const stateMap: Record<string, any> = {};
  insertedStates.forEach((st) => {
    stateMap[st.name] = st._id;
  });

  const districtDocs = districts.map((d) => ({
    name: d.name,
    stateId: stateMap[d.stateName],
    createdBy: d.createdBy,
  }));

  await District.insertMany(districtDocs);

  console.log("✅ States & Districts Seeded Successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Error Seeding:", err);
  process.exit(1);
});
