"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

// In this file the post input will be created
// The user will be able to input the post content and title
// The user will also be able to submit the post which will make a request to the backend with axios to create the post

const PostInput = ({ onPostSubmit }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Load userId from localStorage on component mount
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/post/create`,
        {
          content,
          userId, // Include userId if it exists
        }
      );

      // If a new userId was generated, store it
      if (response.data.userIdGenerated) {
        localStorage.setItem("userId", response.data.userId);
        setUserId(response.data.userId);
      }

      setContent("");
      if (onPostSubmit) onPostSubmit();
    } catch (err) {
      setError("Failed to create post. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-bold mb-4 text-zinc-800 dark:text-zinc-100">
        Create a New Post
      </h2>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
          >
            {/* Content */}
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md h-32 bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 resize-none focus:outline-none focus:ring focus:ring-blue-400 dark:focus:ring-blue-600"
            placeholder="What's on your mind?"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-400 dark:hover:bg-blue-800 dark:disabled:bg-blue-500"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
};

export default PostInput;
