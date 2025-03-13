import express from "express";
import cors from "cors";
import postRoutes from "./routes/post.routes.js";
import qaRoutes from "./routes/qa.routes.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// CORS middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:4000",
    credentials: true,
  })
);

// Routes
app.use("/api/post", postRoutes);
app.use("/api/qa", qaRoutes);

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
