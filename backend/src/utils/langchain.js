// this file is responsible for using @langchain/groq and @langchain/core to generate the answer. I already have the GROQ_API_KEY in my env

import { ChatGroq } from "@langchain/groq";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Initialize Groq model
const groqModel = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "mixtral-8x7b-32768",
});

const outputParser = new StringOutputParser();

/**
 * Generate an answer to a question based on the post content
 * @param {string} question - The question to answer
 * @param {string} postContent - The content of the post to reference
 * @returns {Promise<string>} - The generated answer
 */
export const generateAnswer = async (question, postContent) => {
  try {
    // Create a prompt template
    const prompt = PromptTemplate.fromTemplate(`
    You are a helpful assistant. Answer the following question based only on the provided context.
    
    Context: {postContent}
    
    Question: {question}
    
    Answer:
    `);

    // Create the chain
    const chain = prompt.pipe(groqModel).pipe(outputParser);

    // Run the chain
    const result = await chain.invoke({
      question,
      postContent,
    });

    return result;
  } catch (error) {
    console.error("Error generating answer with LangChain:", error);
    throw new Error("Failed to generate answer");
  }
};
