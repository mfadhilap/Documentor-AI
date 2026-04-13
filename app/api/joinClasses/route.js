import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ClassModel from "@/lib/models/Class";
import { getSession } from "@/lib/auth";

export async function POST(req) {
  const user = getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  try {
    const { classCode } = await req.json();
    const result = await ClassModel.joinClass(user.id, classCode);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ message: "Joined class successfully" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to join class" }, { status: 500 });
  }
}