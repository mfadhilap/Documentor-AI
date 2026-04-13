import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(req, { params }) {
  const { filename } = params;

  // Basic security: prevent path traversal
  if (filename.includes("..") || filename.includes("/")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  try {
    const filePath = path.join(process.cwd(), "uploads", filename);
    const fileBuffer = await readFile(filePath);

    // Determine content type
    const ext = path.extname(filename).toLowerCase();
    const contentTypes = {
      ".pdf": "application/pdf",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".mp4": "video/mp4",
    };
    const contentType = contentTypes[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: { "Content-Type": contentType },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}