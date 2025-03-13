"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";

// In this file the posts will be displayed with a load more button
// The posts will be fetched from the backend with axios
// The posts will be displayed in a grid with the title and content (first 100 characters)
// The user will be able to click on a post to view the full post along with questions and answers for that post

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/posts?page=${page}`);
      const newPosts = response.data.posts;

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
        setPage((prev) => prev + 1);
      }
    } catch (err) {
      setError("Failed to load posts.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) return content;
    return `${content.substring(0, maxLength)}...`;
  };

  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-zinc-800 dark:text-zinc-100">
        Recent Posts
      </h2>
      {posts.length === 0 && !loading ? (
        <p className="text-zinc-500 dark:text-zinc-400">
          No posts available. Create your first post!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link href={`/post/${post.slug}`} key={post.id}>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2 text-zinc-800 dark:text-zinc-100">
                  {post.title}
                </h3>
                <p className="text-zinc-700 dark:text-zinc-300">
                  {truncateContent(post.content)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={fetchPosts}
            disabled={loading}
            className="bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200 py-2 px-4 rounded-md disabled:opacity-50"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Posts;
