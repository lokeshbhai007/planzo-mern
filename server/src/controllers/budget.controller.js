import prisma from "../lib/prisma.js";

export const getBudgets = async (req, res) => {
  const budgets = await prisma.budget.findMany({
    where: { userId: req.user.id },
    include: { expenses: true },
    orderBy: { createdAt: "desc" },
  });

  const result = budgets.map((b) => ({
    ...b,
    totalSpend: b.expenses.reduce((sum, e) => sum + e.amount, 0),
    totalItems: b.expenses.length,
  }));

  res.json(result);
};

export const createBudget = async (req, res) => {
  const { name, amount, icon } = req.body;
  const budget = await prisma.budget.create({
    data: {
      name,
      amount: parseFloat(amount),
      icon,
      userId: req.user.id,
    },
  });
  res.status(201).json(budget);
};

export const updateBudget = async (req, res) => {
  const { name, amount, icon } = req.body;
  const budget = await prisma.budget.update({
    where: {
      id: parseInt(req.params.id),
      userId: req.user.id,
    },
    data: { name, amount: parseFloat(amount), icon },
  });
  res.json(budget);
};

export const deleteBudget = async (req, res) => {
  await prisma.budget.delete({
    where: {
      id: parseInt(req.params.id),
      userId: req.user.id,
    },
  });
  res.json({ message: "Budget deleted" });
};