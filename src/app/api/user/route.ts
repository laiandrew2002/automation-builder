import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const clerkId = req.headers.get("clerk-id"); // Pass this from the client

  if (!clerkId) {
    return NextResponse.json({ error: "Missing Clerk ID" }, { status: 400 });
  }

  try {
    const user = await db.user.findUnique({ where: { clerkId } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}