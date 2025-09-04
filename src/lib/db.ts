/*
import mongoose from "mongoose";

let isConnected = false; // Track connection status

export async function dbConnect() {
  if (isConnected) {
    return true; // Already connected
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in .env.local");
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // ✅ Recommended options
      dbName: process.env.MONGODB_DB || undefined, // Optional: use specific DB if set
      bufferCommands: false, // Don't buffer DB commands before connection
    });

    isConnected = conn.connections[0].readyState === 1;
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw new Error("Database connection failed");
  }
}
*/

// lib/db.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI is not defined in .env.local");
}

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,  // ⚡ DB pooling
    }).then((mongoose) => mongoose);
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
