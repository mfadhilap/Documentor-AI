import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { retrieveRelevantChunks, askWithContext } from "@/lib/rag";
import { getSession } from "@/lib/auth";

export async function POST(req) {
  const user = getSession();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await dbConnect();

  try {
    const { question, filename } = await req.json();

    if (!question?.trim()) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    // Retrieve relevant chunks via vector similarity
    const relevantChunks = await retrieveRelevantChunks(filename, question);

    if (relevantChunks.length === 0) {
      return NextResponse.json({
        answer: "I couldn't find any relevant content in this document. The PDF may still be processing — please try again in a moment.",
        chunks: [],
      });
    }

    // Ask OpenAI with the retrieved context
    const answer = await askWithContext(question, relevantChunks);

    return NextResponse.json({ answer, chunks: relevantChunks });
  } catch (e) {
    console.error("RAG error:", e);
    return NextResponse.json({ error: "Failed to get answer" }, { status: 500 });
  }
}