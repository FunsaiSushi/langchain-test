// createQA
// the req must have a question and the postId
// get the post content using the postId
// answer will be generated with the help of langchain and groq
// after generating the answer, create the qa document with the answer
// return the answer

// getQAs
// the req must have a postId
// get all the qa documents with the given postId
// return the qa documents

import QA from "../models/qa.js";
import Post from "../models/post.js";
