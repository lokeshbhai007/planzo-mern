import prisma from "../lib/prisma.js";

export const getAllExpenses = async (req, res) => {
  const budgets = await prisma.budget.findMany({
    where: { userId: req.user.id },
    include: { expenses: true },
  });

  const expenses = budgets
    .flatMap((b) => b.expenses)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json(expenses);
};

