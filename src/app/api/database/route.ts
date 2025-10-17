import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    // Put code here
    
    return NextResponse.json({ message: "Connected to DB. Ready for queries." });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Failed to connect to database" },
      { status: 500 }
    );
  }
}
