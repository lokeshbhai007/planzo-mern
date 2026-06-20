import prisma from "../lib/prisma.js";

export const getIncomes = async (req, res) => {
  const incomes = await prisma.income.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: "desc" },
  });
  res.json(incomes);
};

export const createIncome = async (req, res) => {
  const { name, amount, icon } = req.body;
  const income = await prisma.income.create({
    data: {
      name,
      amount: parseFloat(amount),
      icon,
      userId: req.user.id,
    },
  });
  res.status(201).json(income);
};

export const deleteIncome = async (req, res) => {
  await prisma.income.delete({
    where: {
      id: parseInt(req.params.id),
      userId: req.user.id,
    },
  });
  res.json({ message: "Income deleted" });
};