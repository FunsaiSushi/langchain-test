// each qa model should have a reference to the blog post
// the que - a string
// the ans - a string
// timestamps true

import mongoose from "mongoose";

const qaSchema = new mongoose.Schema(
  {
    que: {
      type: String,
      required: true,
    },
    ans: {
      type: String,
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      required: true,
    },
  },
  { timestamps: true }
);

const QA = mongoose.model("QA", qaSchema);

export default QA;
