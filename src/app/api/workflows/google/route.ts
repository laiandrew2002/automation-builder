import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

  // 📌 GET Google Listener
  export async function GET(req: NextRequest) {
    const clerkId = req.headers.get("clerk-id"); // Pass this from the client
  
    if (!clerkId) {
      return NextResponse.json({ error: "Missing Clerk ID" }, { status: 400 });
    }
  
    const listener = await db.user.findUnique({
      where: { clerkId },
      select: { googleResourceId: true },
    })
  
    return NextResponse.json(listener || {})
  }