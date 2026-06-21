import OpenAI from "openai";
import redis from "../lib/redis.js";

const groqAI = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const TTL_SECONDS = 6 * 60 * 60; // 6 hours

export const getAdvice = async (req, res) => {
  const { totalBudget, totalIncome, totalSpend } = req.body;

  // Build a cache key unique to this user + their financial values
  // So different users or different values get different cached advice
  const cacheKey = `ai:advice:${req.user.id}:${totalBudget}:${totalIncome}:${totalSpend}`;

  // Check Redis cache first
  const cached = await redis.get(cacheKey);

  if (cached) {
    console.log("Serving AI advice from Redis cache");
    return res.json({ advice: cached, fromCache: true });
  }

  // Not in cache — call Gemini
  console.log("Calling Groq API for new advice");

  const prompt = `
    You are a smart and friendly financial advisor. Based on the following data:
    - Total Budget: ${totalBudget} Rupees  
    - Total Expenses: ${totalSpend} Rupees  
    - Total Income: ${totalIncome} Rupees  
    Give practical financial advice in simple English in exactly 3 clear sentences.
    Include how much to save, a safe spending limit, and one good money habit.
  `;

  const response = await groqAI.responses.create({
    model: "openai/gpt-oss-20b",
    input: prompt,
  });

  const advice = response.output_text;

  console.log("advice : " + advice);
  

  // Save to Redis with 6 hour TTL
  await redis.setEx(cacheKey, TTL_SECONDS, advice);

  res.json({ advice, fromCache: false });
};
