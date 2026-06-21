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

export const getExpensesByBudget = async (req, res) => {
  // First verify this budget belongs to the user
  const budget = await prisma.budget.findUnique({
    where: {
      id: parseInt(req.params.budgetId),
      userId: req.user.id,
    },
  });

  if (!budget) {
    return res.status(404).json({ error: "Budget not found" });
  }

  const expenses = await prisma.expense.findMany({
    where: { budgetId: parseInt(req.params.budgetId) },
    orderBy: { createdAt: "desc" },
  });

  res.json(expenses);
};

export const createExpense = async (req, res) => {
  const { name, amount, budgetId } = req.body;

  // Verify this budget belongs to the user before adding expense
  const budget = await prisma.budget.findUnique({
    where: {
      id: parseInt(budgetId),
      userId: req.user.id,
    },
  });

  if (!budget) {
    return res.status(404).json({ error: "Budget not found" });
  }

  const expense = await prisma.expense.create({
    data: {
      name,
      amount: parseFloat(amount),
      budgetId: parseInt(budgetId),
    },
  });

  res.status(201).json(expense);
};

export const deleteExpense = async (req, res) => {
  // First find the expense and verify ownership through budget
  const expense = await prisma.expense.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {
      budget: {
        select: { userId: true },
      },
    },
  });

  if (!expense || expense.budget.userId !== req.user.id) {
    return res.status(404).json({ error: "Expense not found" });
  }

  await prisma.expense.delete({
    where: { id: parseInt(req.params.id) },
  });

  res.json({ message: "Expense deleted" });
};