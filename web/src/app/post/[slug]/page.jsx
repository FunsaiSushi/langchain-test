"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import QuestionInput from "@/ui/QuestionInput";
import Link from "next/link";

const FullPost = () => {
  const pathname = usePathname();
  console.log("Pathname:", pathname); // Debugging output

  // Extract postId from pathname using regex
  const postId = pathname.match(/\/post\/([^\/]+)/)?.[1];

  console.log("Extracted postId:", postId); // Debugging output

  const [post, setPost] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      const postResponse = await axios.get(`${apiBaseUrl}/post/${postId}`);

      if (!postResponse.data || !postResponse.data.id) {
        throw new Error("Invalid post data");
      }

      setPost(postResponse.data);

      // Use postResponse.data.id instead of _id
      fetchQuestions(postResponse.data.id);
    } catch (err) {
      setError("Failed to load post. The post might not exist.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuestions = async (postId) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
      const questionsResponse = await axios.get(
        `${apiBaseUrl}/qa/all?postId=${postId}`
      );
      setQuestions(questionsResponse.data);
    } catch (err) {
      console.error("Failed to load questions", err);
    }
  };

  const handleQuestionSubmit = (newQuestion) => {
    setQuestions((prev) => [...prev, newQuestion]);
  };

  if (!postId) return <div className="text-center py-10">Invalid post URL</div>;
  if (loading)
    return (
      <div className="text-center py-10 bg-zinc-800 text-white rounded-lg">
        Loading post...
      </div>
    );
  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!post) return <div className="text-center py-10">Post not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 hover:underline mb-6 block">
        ← Back to all posts
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-zinc-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Questions</h2>
            {questions.length === 0 ? (
              <p className="text-gray-500">
                No questions yet. Be the first to ask!
              </p>
            ) : (
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div
                    key={q._id || index}
                    className="border-b border-zinc-700 pb-4"
                  >
                    <p className="font-medium text-white">
                      <span className="text-blue-400">Q:</span> {q.que}
                    </p>
                    <p className="text-gray-300 mt-2">
                      <span className="text-green-400">A:</span> {q.ans}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
          <QuestionInput
            postId={post._id}
            onQuestionSubmit={handleQuestionSubmit}
          />
        </div>

        <div className="md:col-span-2 bg-zinc-800 p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{post.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPost;
