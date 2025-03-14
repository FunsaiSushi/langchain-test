"use client";
import React, { useState } from "react";
import PostInput from "@/ui/PostInput";
import Posts from "@/ui/Posts";
import QuestionInput from "@/ui/QuestionInput";

const Home = () => {
  const [refresh, setRefresh] = useState(false);

  const handlePostSubmit = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Upload any text and then ask questions!
      </h1>
      <div className="max-w-2xl mx-auto">
        <PostInput onPostSubmit={handlePostSubmit} />
        {/* <QuestionInput /> */}
        <Posts key={refresh} />
      </div>
    </div>
  );
};

export default Home;
