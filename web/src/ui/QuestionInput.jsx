"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, usePathname } from "next/navigation";

// In this file the question input will be created
// The user will be able to input the question
// The user will also be able to submit the question which will make a request to the backend with axios to generate the answer
// The answer will be displayed in this component as well

const QuestionInput = ({ onQuestionSubmit }) => {
  const params = useParams();
  const pathname = usePathname();
  const [postId, setPostId] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Try to get postId from params first
    if (params && params.postId) {
      setPostId(params.postId);
    }
    // If not available in params, extract from URL path
    else {
      const pathSegments = pathname?.split("/") || [];
      const urlPostId = pathSegments[pathSegments.length - 1];

      if (urlPostId) {
        setPostId(urlPostId);
      } else {
        // Last resort: try getting from window location if running on client
        if (typeof window !== "undefined") {
          const urlPath = window.location.pathname;
          const urlSegments = urlPath.split("/");
          const lastSegment = urlSegments[urlSegments.length - 1];
          if (lastSegment) {
            setPostId(lastSegment);
          }
        }
      }
    }
  }, [params, pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    // Check if postId exists
    if (!postId) {
      setError("No post ID found. Cannot submit question.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await axios.post(`${apiUrl}/qa/create`, {
        postId: postId,
        question,
      });

      setAnswer(response.data.answer);
      setQuestion("");
      if (onQuestionSubmit)
        onQuestionSubmit({
          question,
          answer: response.data.answer,
          id: response.data.id,
        });
    } catch (err) {
      setError("Failed to generate an answer. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-zinc-800 dark:text-zinc-100">
        Ask a Question
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Enter your question about this post..."
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
            rows="3"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-800 disabled:bg-blue-400 dark:disabled:bg-blue-500"
          disabled={loading}
        >
          {loading ? "Generating Answer..." : "Submit Question"}
        </button>
      </form>

      {error && <div className="mt-4 text-red-500">{error}</div>}

      {answer && (
        <div className="mt-6">
          <h4 className="font-medium mb-2 text-zinc-800 dark:text-zinc-200">
            Answer:
          </h4>
          <div className="bg-zinc-50 dark:bg-zinc-700 p-4 rounded-md border border-zinc-200 dark:border-zinc-600">
            <p className="whitespace-pre-wrap text-zinc-800 dark:text-zinc-200">
              {answer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionInput;
