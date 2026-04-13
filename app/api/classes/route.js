import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import ClassModel from "@/lib/models/Class";
import { getSession } from "@/lib/auth";

export async function GET() {
  const user = getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  try {
    const classes = await ClassModel.find({ members: user.id })
      .populate("creator", "name -_id")
      .select("_id classname classcode creator");

    const formatted = classes.map((cls) => ({
      classId: cls._id,
      classname: cls.classname,
      classcode: cls.classcode,
      creatorName: cls.creator.name,
    }));

    return NextResponse.json(formatted);
  } catch {
    return NextResponse.json({ error: "Failed to fetch classes" }, { status: 500 });
  }
}