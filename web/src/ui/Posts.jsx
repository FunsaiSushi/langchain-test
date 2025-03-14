"use client";
import React from "react";
import axios from "axios";
import Link from "next/link";
import { useInfiniteQuery } from "@tanstack/react-query";

const fetchPosts = async ({ pageParam = 1 }) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/post/all`,
    {
      params: {
        userId: localStorage.getItem("userId"),
        page: pageParam,
        limit: 10,
      },
    }
  );
  return data.posts;
};

const Posts = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    error,
    status,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });

  if (status === "loading") return <div>Loading posts...</div>;
  if (error) return <div className="text-red-500">Failed to load posts</div>;

  // Check if data.pages exists and is not empty
  const posts = data?.pages?.flat() || [];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-zinc-800 dark:text-zinc-100">
        Recent Posts
      </h2>
      {posts.length === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">
          No posts available. Create your first post!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <Link href={`/post/${post._id}`} key={post._id}>
              <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2 text-zinc-800 dark:text-zinc-100">
                  {post.title}
                </h3>
                <p className="text-zinc-700 dark:text-zinc-300">
                  {post.content.slice(0, 100)}...
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {hasNextPage && (
        <div className="mt-8 text-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-800 dark:text-zinc-200 py-2 px-4 rounded-md disabled:opacity-50"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default Posts;
