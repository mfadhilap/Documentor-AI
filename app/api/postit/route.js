import { NextResponse } from "next/server";
import { writeFile, mkdir, readFile } from "fs/promises";
import path from "path";
import dbConnect from "@/lib/db";
import Post from "@/lib/models/Post";
import { getSession } from "@/lib/auth";
import { embedAndStore } from "@/lib/rag";

async function extractPdfPages(filePath) {
  const pdfParse = (await import("pdf-parse")).default;
  const buffer = await readFile(filePath);
  const data = await pdfParse(buffer);

  const pages = data.text
    .split(/\f/)
    .map((text, i) => ({ text: text.trim(), pageNum: i + 1 }))
    .filter((p) => p.text.length > 0);

  return pages.length > 0 ? pages : [{ text: data.text, pageNum: 1 }];
}

export async function POST(req) {
  const user = getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  try {
    const formData = await req.formData();
    const classId = formData.get("classId");
    const content = formData.get("content");
    const files = formData.getAll("media");

    const uploadDir = path.join(process.cwd(), "uploads");
    await mkdir(uploadDir, { recursive: true });

    const originalFilename = [];
    const newFilename = [];

    for (const file of files) {
      if (file && file.name) {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.name)}`;
        const filePath = path.join(uploadDir, uniqueName);
        const bytes = await file.arrayBuffer();
        await writeFile(filePath, Buffer.from(bytes));
        originalFilename.push(file.name);
        newFilename.push(uniqueName);
      }
    }

    const newPost = await Post.create({
      classId,
      author: user.id,
      content,
      media: { originalFilename, newFilename },
    });

    // Embed PDFs in background — don't block the response
    for (let i = 0; i < newFilename.length; i++) {
      const fname = newFilename[i];
      if (path.extname(fname).toLowerCase() === ".pdf") {
        const filePath = path.join(process.cwd(), "uploads", fname);
        extractPdfPages(filePath)
          .then((pages) => embedAndStore(newPost._id, fname, pages))
          .catch((err) => console.error("Embedding error:", err));
      }
    }

    return NextResponse.json({ success: true, post: newPost });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}