import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getAdvice = async (req, res) => {
  const { totalBudget, totalIncome, totalSpend } = req.body;

  const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `
    You are a smart and friendly financial advisor. Based on the following data:
    - Total Budget: ${totalBudget} Rupees  
    - Total Expenses: ${totalSpend} Rupees  
    - Total Income: ${totalIncome} Rupees  
    Give practical financial advice in simple English in exactly 3 clear sentences.
    Include how much to save, a safe spending limit, and one good money habit.
  `;

  const result = await model.generateContent(prompt);
  const advice = result.response.text();

  res.json({ advice });
};