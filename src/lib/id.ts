import Counter from "@/models/Counter";

export async function generateRegistrationId(role: string) {
  const prefix = new Date().getFullYear().toString().slice(-2);
  let roleCode = "";

  switch (role) {
    case "student":
      roleCode = "STU";
      break;
    case "teacher":
      roleCode = "TEA";
      break;
    case "admin":
      roleCode = "ADM";
      break;
  }

  const counter = await Counter.findOneAndUpdate(
    { key: role },
    { $inc: { count: 1 } },
    { new: true, upsert: true }
  );

  const padded = String(counter.count).padStart(5, "0");
  return `${prefix}${roleCode}${padded}`;
}
