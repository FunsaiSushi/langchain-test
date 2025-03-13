import express from "express";
import {
  createPost,
  getPosts,
  deletePosts,
  getPostById,
} from "../controllers/post.controller.js";

const router = express.Router();

router.post("/create", createPost);
router.get("/all", getPosts);
router.delete("/delete", deletePosts);
router.get("/:postId", getPostById);

export default router;

// the controllers should handle the logic for the routes
