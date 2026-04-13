import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Post from "@/lib/models/Post";
import ClassModel from "@/lib/models/Class";
import { getSession } from "@/lib/auth";

export async function POST(req) {
  const user = getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  try {
    const { classId } = await req.json();

    const allPosts = await Post.find({ classId })
      .populate("author", "name")
      .sort({ postedAt: -1 });

    const classDoc = await ClassModel.findById(classId).select("creator");
    const isCreator = classDoc && classDoc.creator.toString() === user.id;

    return NextResponse.json({ posts: allPosts, success: isCreator });
  } catch {
    return NextResponse.json({ error: "Failed to load posts" }, { status: 500 });
  }
}