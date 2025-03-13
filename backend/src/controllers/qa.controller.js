import QA from "../models/qa.js";
import Post from "../models/post.js";
import { generateAnswer } from "../utils/langchain.js";

// createQA
// the req must have a question and the postId
// get the post content using the postId
// answer will be generated with the help of langchain and groq (langchain.js file)
// after generating the answer, create the qa document with the answer
// return the answer
export const createQA = async (req, res) => {
  try {
    const { question, postId } = req.body;

    if (!question || !postId) {
      return res
        .status(400)
        .json({ message: "Question and postId are required" });
    }

    // Find the post by ID
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Generate answer using LangChain
    const answer = await generateAnswer(question, post.content);

    // Create new QA document
    const qa = new QA({
      que: question,
      ans: answer,
      postId: post._id,
    });

    const savedQA = await qa.save();

    return res.status(201).json(savedQA);
  } catch (error) {
    console.error("Error creating QA:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// getQAs
// the req must have a postId
// get all the qa documents with the given postId
// return the qa documents
export const getQAs = async (req, res) => {
  try {
    const { postId } = req.query;

    if (!postId) {
      return res.status(400).json({ message: "PostId is required" });
    }

    // Find all QA pairs for the given post
    const qaPairs = await QA.find({ postId }).sort({ createdAt: -1 });

    return res.status(200).json(qaPairs);
  } catch (error) {
    console.error("Error fetching QAs:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
