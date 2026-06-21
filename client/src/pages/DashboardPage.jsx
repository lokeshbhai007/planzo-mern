import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/react";
import { setBudgets, setLoading as setBudgetLoading } from "../features/budget/budgetSlice.js";
import { setIncomes } from "../features/income/incomeSlice.js";
import { setExpenses } from "../features/expense/expenseSlice.js";
import apiFetch from "../utils/apiFetch.js";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Sparkles, PiggyBank, ReceiptText, Wallet, CircleDollarSign,
} from "lucide-react";

function DashboardPage() {
  const dispatch = useDispatch();
  const { getToken } = useAuth();

  const { budgets, loading } = useSelector((s) => s.budget);
  const { incomes } = useSelector((s) => s.income);
  const { expenses } = useSelector((s) => s.expense);

  const [advice, setAdvice] = useState("You're managing your expenses well. This is dummy");
  const [aiLoading, setAiLoading] = useState(false);

  // Load all data on mount
  useEffect(() => {
    const load = async () => {
      dispatch(setBudgetLoading(true));
      try {
        const token = await getToken();
        const [budgetData, incomeData, expenseData] = await Promise.all([
          apiFetch("/budgets", token),
          apiFetch("/incomes", token),
          apiFetch("/expenses", token),
        ]);
        dispatch(setBudgets(budgetData));
        dispatch(setIncomes(incomeData));
        dispatch(setExpenses(expenseData));
      } catch (err) {
        console.error(err.message);
      } finally {
        dispatch(setBudgetLoading(false));
      }
    };
    load();
  }, []);

  // Calculate totals
  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpend = budgets.reduce((s, b) => s + b.totalSpend, 0);
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);



  const chartData = budgets.map((b) => ({
    name: b.name,
    Spent: b.totalSpend,
    Remaining: Math.max(0, b.amount - b.totalSpend),
  }));

  const statCards = [
    { label: "Total Budget", value: `₹${totalBudget}`, icon: PiggyBank, color: "text-blue-600" },
    { label: "Total Spend", value: `₹${totalSpend}`, icon: ReceiptText, color: "text-red-500" },
    { label: "No. of Budgets", value: budgets.length, icon: Wallet, color: "text-purple-600" },
    { label: "Total Income", value: `₹${totalIncome}`, icon: CircleDollarSign, color: "text-green-600" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 bg-gray-200 animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-gray-200 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>

      {/* AI Advice Card */}
      <div className="p-5 border rounded-2xl bg-white flex items-start gap-3">
        <Sparkles className="text-pink-500 mt-1 shrink-0" size={20} />
        <p className="text-gray-600">
          {aiLoading
            ? "Generating advice..."
            : advice || "Loading financial advice..."}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="p-5 border rounded-2xl bg-white flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold text-gray-800">{card.value}</p>
            </div>
            <card.icon className={card.color} size={36} />
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="p-5 border rounded-2xl bg-white">
        <h3 className="font-bold text-gray-800 mb-4">Budget Activity</h3>
        <ResponsiveContainer width="100%" height={280}>
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
      <div className="p-5 border rounded-2xl bg-white">
        <h3 className="font-bold text-gray-800 mb-4">Recent Expenses</h3>
        <div className="grid grid-cols-3 bg-gray-100 rounded-lg p-2 font-semibold text-sm text-gray-600">
          <span>Name</span>
          <span>Amount</span>
          <span>Date</span>
        </div>
        {expenses.slice(0, 5).map((e) => (
          <div
            key={e.id}
            className="grid grid-cols-3 p-2 border-b text-sm text-gray-700"
          >
            <span>{e.name}</span>
            <span>₹{e.amount}</span>
            <span>{new Date(e.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
        {expenses.length === 0 && (
          <p className="text-center py-6 text-gray-400 text-sm">
            No expenses yet
          </p>
        )}
      </div>

      {/* Latest Budgets */}
      <div className="p-5 border rounded-2xl bg-white">
        <h3 className="font-bold text-gray-800 mb-4">Latest Budgets</h3>
        <div className="space-y-3">
          {budgets.slice(0, 4).map((b) => {
            const perc = Math.min(
              (b.totalSpend / b.amount) * 100, 100
            ).toFixed(0);
            return (
              <div key={b.id} className="flex items-center gap-4">
                <span className="text-xl bg-gray-100 p-2 rounded-full">
                  {b.icon}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-800">{b.name}</span>
                    <span className="text-gray-500">₹{b.amount}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 rounded-full">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${perc}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          {budgets.length === 0 && (
            <p className="text-center py-4 text-gray-400 text-sm">
              No budgets yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;