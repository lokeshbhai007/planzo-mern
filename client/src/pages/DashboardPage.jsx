//v2
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import {
  setBudgets,
  setLoading as setBudgetLoading,
} from "../features/budget/budgetSlice.js";
import { setIncomes } from "../features/income/incomeSlice.js";
import { setExpenses } from "../features/expense/expenseSlice.js";
import apiFetch from "../utils/apiFetch.js";
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
  TrendingUp,
} from "lucide-react";

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg text-sm">
      <p className="font-medium text-gray-800 dark:text-gray-100 mb-1">
        {label}
      </p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color }}>
          {entry.name}: ₹{entry.value}
        </p>
      ))}
      <p className="text-xs text-red-500 dark:text-red-400 mt-2 pt-1 border-t border-gray-100 dark:border-gray-700">
        Click to add expenses →
      </p>
    </div>
  );
}

function DashboardPage() {
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const { budgets, loading } = useSelector((s) => s.budget);
  const { incomes } = useSelector((s) => s.income);
  const { expenses } = useSelector((s) => s.expense);

  const [advice, setAdvice] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const lastAdviceValues = useRef({
    budget: 0,
    income: 0,
    spend: 0,
  });

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

  const totalBudget = budgets.reduce((s, b) => s + b.amount, 0);
  const totalSpend = budgets.reduce((s, b) => s + b.totalSpend, 0);
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);

  const savingsRate =
    totalIncome > 0
      ? (((totalIncome - totalSpend) / totalIncome) * 100).toFixed(0)
      : 0;

  const chartData = budgets.map((b) => ({
    name: b.name,
    budgetId: b.id,
    Spent: b.totalSpend,
    Remaining: Math.max(0, b.amount - b.totalSpend),
  }));

  // Fetch AI advice only when totals change meaningfully
  useEffect(() => {
    if (totalBudget === 0 && totalIncome === 0) return;

    const last = lastAdviceValues.current;

    const hasChanged =
      last.budget !== totalBudget ||
      last.income !== totalIncome ||
      last.spend !== totalSpend;

    if (!hasChanged) return;

    const loadAdvice = async () => {
      setAiLoading(true);

      try {
        const token = await getToken();

        const data = await apiFetch("/ai/advice", token, {
          method: "POST",
          body: JSON.stringify({
            totalBudget,
            totalIncome,
            totalSpend,
          }),
        });

        setAdvice(data.advice);

        lastAdviceValues.current = {
          budget: totalBudget,
          income: totalIncome,
          spend: totalSpend,
        };
      } catch (err) {
        console.error(err.message);
      } finally {
        setAiLoading(false);
      }
    };

    loadAdvice();
  }, [totalBudget, totalIncome, totalSpend]);

  const handleBarClick = (data) => {
    if (data?.budgetId) {
      navigate(`/dashboard/budgets/${data.budgetId}`);
    }
  };

  const statCards = [
    {
      label: "Total Budget",
      value: `₹${totalBudget}`,
      icon: PiggyBank,
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      label: "Total Spend",
      value: `₹${totalSpend}`,
      icon: ReceiptText,
      color: "text-red-500  dark:text-red-400",
    },
    {
      label: "Remaining Amount",
      value: `₹${totalIncome - totalSpend}`,
      icon: Wallet,
      color: "text-purple-600 dark:text-purple-400",
    },
    {
      label: "Total Income",
      value: `₹${totalIncome}`,
      icon: CircleDollarSign,
      color: "text-green-600 dark:text-green-400",
    },
  ];

  return (
    <div className="space-y-6 md:my-6 -my-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:justify-between gap-2">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center md:text-left">
          Dashboard
        </h2>
        {totalIncome > 0 && (
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <TrendingUp
              size={14}
              className="text-green-600 dark:text-green-400"
            />
            <span className="text-xs font-medium text-green-700 dark:text-green-400">
              {savingsRate}% savings rate
            </span>
          </div>
        )}
      </div>

      {/* AI Advice Card */}
      <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 flex items-start gap-3 transition-colors duration-300">
        <Sparkles
          className="text-pink-500 dark:text-pink-400 mt-1 shrink-0"
          size={20}
        />
        <p className="text-gray-600 dark:text-gray-300">
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
            className="p-5 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-between transition-colors duration-300"
          >
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {card.label}
              </p>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {card.value}
              </p>
            </div>
            <card.icon className={card.color} size={36} />
          </div>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 transition-colors duration-300">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-1">
          Budget Activity
        </h3>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
          Click a bar to view budget · Spent vs remaining across all budgets
        </p>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="name"
              tick={{ fill: "currentColor" }}
              className="text-gray-500 dark:text-gray-400"
            />
            <YAxis
              tick={{ fill: "currentColor" }}
              className="text-gray-500 dark:text-gray-400"
            />
            <Tooltip content={<DarkTooltip />} />
            <Legend wrapperStyle={{ color: "currentColor" }} />
            <Bar
              dataKey="Spent"
              stackId="a"
              fill="#3b82f6"
              onClick={handleBarClick}
              style={{ cursor: "pointer" }}
            />
            <Bar
              dataKey="Remaining"
              stackId="a"
              fill="#93c5fd"
              onClick={handleBarClick}
              style={{ cursor: "pointer" }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Expenses */}
      <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 transition-colors duration-300">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">
          Recent Expenses
        </h3>
        <div className="grid grid-cols-3 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 font-semibold text-sm text-gray-600 dark:text-gray-300">
          <span>Name</span>
          <span>Amount</span>
          <span>Date</span>
        </div>
        {expenses.slice(0, 5).map((e) => (
          <div
            key={e.id}
            className="grid grid-cols-3 p-2 border-b border-gray-100 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <span>{e.name}</span>
            <span>₹{e.amount}</span>
            <span>{new Date(e.createdAt).toLocaleDateString()}</span>
          </div>
        ))}
        {expenses.length === 0 && (
          <p className="text-center py-6 text-gray-400 dark:text-gray-500 text-sm">
            No expenses yet
          </p>
        )}
      </div>

      {/* Latest Budgets */}
      <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 transition-colors duration-300">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">
          Latest Budgets
        </h3>
        <div className="space-y-3">
          {budgets.slice(0, 4).map((b) => {
            const perc = Math.min((b.totalSpend / b.amount) * 100, 100).toFixed(
              0,
            );
            return (
              <div key={b.id} className="flex items-center gap-4">
                <span className="text-xl bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                  {b.icon}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {b.name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      ₹{b.amount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
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
            <p className="text-center py-4 text-gray-400 dark:text-gray-500 text-sm">
              No budgets yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
