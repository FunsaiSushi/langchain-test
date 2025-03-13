import { useEffect, useState } from "react";
import "./style.css";

export default function BlogInput() {
  const [blog, setBlog] = useState(null);
  const [ans, setAns] = useState("no ans");
  const [loading, setLoading] = useState(true);
  const [question, setQuestion] = useState(null);

  async function postBlog() {
    setLoading(true);
  }
  function handleSubmit() {
    postBlog();
  }

  useEffect(() => {
    postBlog();
  }, []);

  async function postQuestion() {
    setLoading(true);
  }
  function handleSubmit() {
    postQuestion();
  }

  useEffect(() => {
    postQuestion();
  }, []);

  return (
    <div className="blog-container">
      <div className="input-wrapper">
        <input
          name="Blog"
          type="text"
          placeholder="upload blogs"
          value={blog}
          onChange={(event) => setBlog(event.target.value)}
        />
        <button className=".input-wrapper-button" onClick={handleSubmit}>
          Upload
        </button>
      </div>
      <div className="input-wrapper">
        <input
          name="Question"
          type="text"
          placeholder="Ask Questions"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
        />
        <button className=".input-wrapper-button" onClick={handleSubmit}>
          Ask
        </button>
      </div>
      <answer answer={ans} />
    </div>
  );
}
