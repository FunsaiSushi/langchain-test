import express from "express";
import mongoose from "mongoose";
import blogRoutes from "./routes/blogRoutes.js";
import qaRoutes from "./routes/qaRoutes.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/blog", blogRoutes);
app.use("/api/qa", qaRoutes);

// MongoDB Connection
mongoose
  .connect("mongodb://localhost:27017/mern-langchain", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});

// flow of the app
// when a user uploads a blog post - the post is saved in the database
// user asks questions in the context of that blog post - the que
