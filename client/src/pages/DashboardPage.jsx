import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  Sparkles,
  PiggyBank,
  ReceiptText,
  Wallet,
  CircleDollarSign,
} from "lucide-react";

function DashboardPage() {
  const budgets = [
    { id: 1, name: "Food", amount: 10000, totalSpend: 4500 },
    { id: 2, name: "Shopping", amount: 8000, totalSpend: 3200 },
    { id: 3, name: "Travel", amount: 15000, totalSpend: 7200 },
  ];

  const incomes = [
    { id: 1, source: "Salary", amount: 45000 },
    { id: 2, source: "Freelancing", amount: 8000 },
  ];

  const expenses = [
    {
      id: 1,
      name: "Burger",
      amount: 350,
      createdAt: "2026-06-18",
      budget: "Food",
    },
    {
      id: 2,
      name: "Shoes",
      amount: 2500,
      createdAt: "2026-06-17",
      budget: "Shopping",
    },
    {
      id: 3,
      name: "Train Ticket",
      amount: 1200,
      createdAt: "2026-06-16",
      budget: "Travel",
    },
    {
      id: 4,
      name: "Pizza",
      amount: 600,
      createdAt: "2026-06-15",
      budget: "Food",
    },
    {
      id: 5,
      name: "T-shirt",
      amount: 900,
      createdAt: "2026-06-14",
      budget: "Shopping",
    },
  ];

  const advice =
    "You're managing your expenses well. Consider saving 20% of your monthly income for emergencies.";

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpend = budgets.reduce((sum, b) => sum + b.totalSpend, 0);
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

  const chartData = budgets.map((b) => ({
    name: b.name,
    Spent: b.totalSpend,
    Remaining: b.amount - b.totalSpend,
  }));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>

      {/* AI Advice */}
      <div className="flex gap-3 rounded-2xl border bg-white p-5">
        <Sparkles className="mt-1 text-pink-500" size={20} />
        <p className="text-gray-600">{advice}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Budget",
            value: `₹${totalBudget}`,
            icon: PiggyBank,
            color: "text-blue-600",
          },
          {
            label: "Total Spend",
            value: `₹${totalSpend}`,
            icon: ReceiptText,
            color: "text-red-500",
          },
          {
            label: "Budgets",
            value: budgets.length,
            icon: Wallet,
            color: "text-purple-600",
          },
          {
            label: "Total Income",
            value: `₹${totalIncome}`,
            icon: CircleDollarSign,
            color: "text-green-600",
          },
        ].map((card) => (
          <div
            key={card.label}
            className="flex items-center justify-between rounded-2xl border bg-white p-5"
          >
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>

            <card.icon className={card.color} size={36} />
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="rounded-2xl border bg-white p-5">
        <h3 className="mb-4 font-bold text-gray-800">Budget Activity</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Spent" stackId="a" fill="#3b82f6" />
            <Bar dataKey="Remaining" stackId="a" fill="#93c5fd" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Expenses */}
      <div className="rounded-2xl border bg-white p-5">
        <h3 className="mb-4 font-bold text-gray-800">Recent Expenses</h3>

        <div className="grid grid-cols-4 rounded-lg bg-gray-100 p-3 font-semibold text-gray-600">
          <span>Name</span>
          <span>Amount</span>
          <span>Date</span>
          <span>Budget</span>
        </div>

        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="grid grid-cols-4 border-b p-3 text-sm"
          >
            <span>{expense.name}</span>
            <span>₹{expense.amount}</span>
            <span>{expense.createdAt}</span>
            <span>{expense.budget}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;