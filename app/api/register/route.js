import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(req) {
  await dbConnect();
  const { username, name, password } = await req.json();

  try {
    const result = await User.registerUser(username, name, password);
    if (result === "User already registered") {
      return NextResponse.json({ success: false, error: "Username is already taken" }, { status: 400 });
    }
    return NextResponse.json({ success: true, message: "User registered successfully" });
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}