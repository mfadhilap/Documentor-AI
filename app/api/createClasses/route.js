import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ClassModel from "@/lib/models/Class";
import { getSession } from "@/lib/auth";

export async function POST(req) {
  const user = getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  try {
    const { className } = await req.json();
    const newClass = await ClassModel.createClass(user.id, className);
    return NextResponse.json({ message: "Class created successfully", classId: newClass._id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create class" }, { status: 500 });
  }
}