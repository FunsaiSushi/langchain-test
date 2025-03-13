"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import QuestionInput from "@/ui/QuestionInput";
import Link from "next/link";

const FullPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      const postResponse = await axios.get(`/api/posts/${slug}`);
      setPost(postResponse.data);

      const questionsResponse = await axios.get(
        `/api/questions?postId=${postResponse.data.id}`
      );
      setQuestions(questionsResponse.data);
    } catch (err) {
      setError("Failed to load post. The post might not exist.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionSubmit = (newQuestion) => {
    setQuestions((prev) => [...prev, newQuestion]);
  };

  if (loading) return <div className="text-center py-10">Loading post...</div>;
  if (error)
    return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!post) return <div className="text-center py-10">Post not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 hover:underline mb-6 block">
        ← Back to all posts
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Questions sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Questions</h2>

            {questions.length === 0 ? (
              <p className="text-gray-500">
                No questions yet. Be the first to ask!
              </p>
            ) : (
              <div className="space-y-4">
                {questions.map((q, index) => (
                  <div key={q.id || index} className="border-b pb-4">
                    <p className="font-medium">Q: {q.question}</p>
                    <p className="text-gray-700 mt-2">A: {q.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <QuestionInput
            postId={post.id}
            onQuestionSubmit={handleQuestionSubmit}
          />
        </div>

        {/* Full post content */}
        <div className="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
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
