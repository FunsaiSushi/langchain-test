import express from "express";
import {
  createPost,
  getPosts,
  deletePosts,
} from "../controllers/post.controllers.js";

const router = express.Router();

router.post("/create", createPost);
router.get("/all", getPosts);
router.delete("/delete", deletePosts);

export default router;

// the controllers should handle the logic for the routes
