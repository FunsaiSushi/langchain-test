import Post from "../models/post.js";
import User from "../models/user.js";
import mongoose from "mongoose";

// createPost
// the req must have a title and content and may have a userId
// if there is no userId, generate a random unique userId
// create a new post post in mongodb
// return the new post post (along with the userId if there was none)
export const createPost = async (req, res) => {
  try {
    const { title, content, userId } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    let userDocument;

    // If no userId provided, create a new one
    if (!userId) {
      const randomUserId = mongoose.Types.ObjectId().toString();
      userDocument = new User({ userId: randomUserId });
      await userDocument.save();
    } else {
      // Check if user exists, otherwise create it
      userDocument = await User.findOne({ userId });
      if (!userDocument) {
        userDocument = new User({ userId });
        await userDocument.save();
      }
    }

    // Create the post
    const post = new Post({
      title,
      content,
      userId: userDocument._id,
    });

    const savedPost = await post.save();

    // Return the new post along with userId if it was generated
    return res.status(201).json({
      post: savedPost,
      userId: userDocument.userId,
      userIdGenerated: !userId,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// getPosts
// the req must have a userId
// get all post posts from mongodb for the given userId (implement pagination)
// return the post posts
export const getPosts = async (req, res) => {
  try {
    const { userId } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    // Find the user by userId
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get posts with pagination
    const posts = await Post.find({ userId: user._id })
      .skip(skip)
      .limit(limit)
      .sort({ _id: -1 });

    const total = await Post.countDocuments({ userId: user._id });

    return res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// deletePosts
// the req must have a userId
// delete all post posts from mongodb
export const deletePosts = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    // Find the user by userId
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete all posts for this user
    const result = await Post.deleteMany({ userId: user._id });

    return res.status(200).json({
      message: "Posts deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error deleting posts:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
