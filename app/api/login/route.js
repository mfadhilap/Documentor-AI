import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { encodeSession, SESSION_COOKIE } from "@/lib/auth";

export async function POST(req) {
  await dbConnect();
  const { username, password } = await req.json();

  try {
    const user = await User.loginUser(username, password);
    if (user.error) {
      return NextResponse.json({ success: false, error: user.error }, { status: 400 });
    }

    const fullUser = await User.findOne({ username }).select("name");
    const sessionData = {
      id: user._id.toString(),
      username: user.username,
      name: fullUser?.name || "",
    };

    const response = NextResponse.json({ success: true });
    response.cookies.set(SESSION_COOKIE, encodeSession(sessionData), {
      httpOnly: true,
      maxAge: 60 * 60,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}