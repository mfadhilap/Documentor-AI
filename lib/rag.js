import OpenAI from "openai";
import Chunk from "./models/Chunk.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CHUNK_SIZE = 500;      // characters per chunk
const CHUNK_OVERLAP = 50;    // overlap between chunks
const TOP_K = 5;             // number of chunks to retrieve

// Split text into overlapping chunks
export function splitIntoChunks(text, pageNum) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(start + CHUNK_SIZE, text.length);
    const chunkText = text.slice(start, end).trim();

    if (chunkText.length > 50) { // skip tiny chunks
      chunks.push({ text: chunkText, pageNum });
    }

    start += CHUNK_SIZE - CHUNK_OVERLAP;
  }

  return chunks;
}

// Get embedding for a single text
export async function getEmbedding(text) {
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  return res.data[0].embedding;
}

// Embed and store all chunks for a post's file
export async function embedAndStore(postId, filename, pages) {
  // pages = array of { text, pageNum }
  const allChunks = [];

  for (const page of pages) {
    const chunks = splitIntoChunks(page.text, page.pageNum);
    allChunks.push(...chunks);
  }

  if (allChunks.length === 0) return;

  // Embed all chunks in one batch request
  const texts = allChunks.map((c) => c.text);
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: texts,
  });

  const docs = allChunks.map((chunk, i) => ({
    postId,
    filename,
    pageNum: chunk.pageNum,
    text: chunk.text,
    embedding: res.data[i].embedding,
  }));

  await Chunk.insertMany(docs);
  console.log(`Stored ${docs.length} chunks for ${filename}`);
}

// Cosine similarity between two vectors
function cosineSimilarity(a, b) {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

// Retrieve top-k relevant chunks for a question
export async function retrieveRelevantChunks(filename, question) {
  const questionEmbedding = await getEmbedding(question);

  // Fetch all chunks for this file
  const chunks = await Chunk.find({ filename }).lean();

  if (chunks.length === 0) return [];

  // Score each chunk
  const scored = chunks.map((chunk) => ({
    text: chunk.text,
    pageNum: chunk.pageNum,
    score: cosineSimilarity(questionEmbedding, chunk.embedding),
  }));

  // Sort by score descending and take top K
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, TOP_K);
}

// Ask OpenAI with retrieved context
export async function askWithContext(question, relevantChunks) {
  const context = relevantChunks
    .map((c) => `[Page ${c.pageNum}]: ${c.text}`)
    .join("\n\n");

  const systemPrompt = `You are a helpful study assistant. Answer questions based only on the provided document context.
If the answer is not in the context, say "I couldn't find that in the document."
Always structure your answer clearly with bullet points where appropriate.
Format: Brief introduction, then key points as bullet points.`;

  const userPrompt = `Context from document:\n${context}\n\nQuestion: ${question}`;

  const res = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.3,
  });

  return res.choices[0].message.content;
}
