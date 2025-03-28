import express from "express";
import { createQA, getQAs } from "../controllers/qa.controller.js";

const router = express.Router();

router.post("/create", createQA);
router.get("/all", getQAs);

export default router;
