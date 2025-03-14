"use client";
import React from "react";
import { usePathname } from "next/navigation";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import QuestionInput from "@/ui/QuestionInput";
import Link from "next/link";

// Fetch post function
const fetchPost = async (postId) => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const postResponse = await axios.get(`${apiBaseUrl}/post/${postId}`);
  if (!postResponse.data || !postResponse.data.id) {
    throw new Error("Invalid post data");
  }
  return postResponse.data;
};

// Fetch questions function
const fetchQuestions = async (postId) => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const questionsResponse = await axios.get(
    `${apiBaseUrl}/qa/all?postId=${postId}`
  );
  return questionsResponse.data;
};

// Submit a new question function
const submitQuestion = async ({ postId, question }) => {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;
  const response = await axios.post(`${apiBaseUrl}/qa`, {
    postId,
    question,
  });
  return response.data;
};

const FullPost = () => {
  const pathname = usePathname();
  console.log("Pathname:", pathname); // Debugging output

  // Extract postId from pathname using regex
  const postId = pathname.match(/\/post\/([^\/]+)/)?.[1];

  console.log("Extracted postId:", postId); // Debugging output

  // Fetch post data using react-query
  const {
    data: post,
    isLoading: isPostLoading,
    error: postError,
  } = useQuery({
    queryKey: ["post", postId],
    queryFn: () => fetchPost(postId),
    enabled: !!postId, // Only run the query if postId is available
  });

  // Fetch questions data using react-query
  const {
    data: questions,
    isLoading: isQuestionsLoading,
    error: questionsError,
    refetch: refetchQuestions,
  } = useQuery({
    queryKey: ["questions", postId],
    queryFn: () => fetchQuestions(postId),
    enabled: !!postId, // Only run the query if postId is available
    refetchOnWindowFocus: false, // Prevent refetching on window focus
  });

  // Query Client to update the cached questions list after submission
  const queryClient = useQueryClient();

  // Mutation for submitting a new question
  const { mutate: submitNewQuestion, isLoading: isSubmitting } = useMutation({
    mutationFn: submitQuestion,
    onSuccess: () => {
      // Refetch the questions after successful submission
      refetchQuestions();
    },
    onError: (error) => {
      console.error("Error submitting question", error);
    },
  });

  const handleQuestionSubmit = (newQuestion) => {
    if (postId) {
      submitNewQuestion({ postId, question: newQuestion });
    }
  };

  if (!postId) return <div className="text-center py-10">Invalid post URL</div>;
  if (isPostLoading || isQuestionsLoading)
    return (
      <div className="text-center py-10 bg-zinc-800 text-white rounded-lg">
        Loading post...
      </div>
    );
  if (postError || questionsError)
    return (
      <div className="text-red-500 text-center py-10">Failed to load data</div>
    );
  if (!post) return <div className="text-center py-10">Post not found</div>;

  const sortedQuestions = [...questions].reverse(); // To show the newest questions last

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/" className="text-blue-600 hover:underline mb-6 block">
        ← Back to all posts
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="bg-zinc-800 p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-bold mb-4">Questions</h2>
            {sortedQuestions.length === 0 ? (
              <p className="text-gray-500">
                No questions yet. Be the first to ask!
              </p>
            ) : (
              <div className="space-y-4">
                {sortedQuestions.map((q, index) => (
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
            isSubmitting={isSubmitting}
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
