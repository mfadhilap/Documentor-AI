import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  media: {
    originalFilename: { type: [String], default: [] },
    newFilename: { type: [String], default: [] },
  },
  postedAt: { type: Date, default: Date.now },
});

const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
export default Post;
