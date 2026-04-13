import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  filename: { type: String, required: true },
  pageNum: { type: Number },
  text: { type: String, required: true },
  embedding: { type: [Number], required: true },
}, { timestamps: true });

// MongoDB Atlas Vector Search index must be created manually in Atlas UI:
// Field: "embedding", Dimensions: 1536, Similarity: "cosine"
const Chunk = mongoose.models.Chunk || mongoose.model("Chunk", chunkSchema);
export default Chunk;
