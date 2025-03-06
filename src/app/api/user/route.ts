import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  const clerkId = req.headers.get("clerk-id"); // Pass this from the client

  if (!clerkId) {
    return NextResponse.json({ error: "Missing Clerk ID" }, { status: 400 });
  }

  try {
    const user = await db.user.findUnique({
      where: { clerkId },
      include: {
        connections: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Database query error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


// Upload profile image
export async function POST(req: Request) {
  try {
    const { action, image, name } = await req.json();
    const clerkId = req.headers.get("clerk-id");

    if (!clerkId) {
      return NextResponse.json({ error: "Missing Clerk ID" }, { status: 400 });
    }

    if (action === "uploadProfileImage") {
      if (!image) {
        return NextResponse.json({ error: "Image is required" }, { status: 400 });
      }

      const response = await db.user.update({
        where: { clerkId },
        data: { profileImage: image },
      });

      return NextResponse.json({ data: response });
    }

    if (action === "removeProfileImage") {
      const response = await db.user.update({
        where: { clerkId },
        data: { profileImage: "" },
      });

      return NextResponse.json({ data: response });
    }

    if (action === "updateUserInfo") {
      if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
      }

      const response = await db.user.update({
        where: { clerkId },
        data: { name },
      });

      return NextResponse.json({ data: response });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("User update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}