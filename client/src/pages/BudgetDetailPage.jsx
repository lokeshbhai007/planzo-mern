import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/react";
import { useParams, useNavigate } from "react-router-dom";
import {
  setBudgets,
  editBudget,
  removeBudget,
} from "../features/budget/budgetSlice.js";
import {
  setExpenses,
  addExpense,
  removeExpense,
} from "../features/expense/expenseSlice.js";
import apiFetch from "../utils/apiFetch.js";
import { ArrowLeft, Trash } from "lucide-react";

// ── Shared dark-mode input class ──────────────────────────────────────────
const inputCls =
  "border border-gray-200 dark:border-gray-600 rounded-xl p-3 w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors";

function BudgetDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const budget = useSelector((s) =>
    s.budget.budgets.find((b) => b.id === parseInt(id)),
  );
  const { expenses } = useSelector((s) => s.expense);

  const [expName, setExpName] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editIcon, setEditIcon] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const token = await getToken();
        const [budgetData, expenseData] = await Promise.all([
          apiFetch("/budgets", token),
          apiFetch(`/expenses/${id}`, token),
        ]);
        dispatch(setBudgets(budgetData));
        dispatch(setExpenses(expenseData));
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  useEffect(() => {
    if (budget) {
      setEditName(budget.name);
      setEditAmount(budget.amount);
      setEditIcon(budget.icon);
    }
  }, [budget]);

  const handleAddExpense = async () => {
    if (!expName || !expAmount) return;
    try {
      const token = await getToken();
      const data = await apiFetch("/expenses", token, {
        method: "POST",
        body: JSON.stringify({
          name: expName,
          amount: expAmount,
          budgetId: parseInt(id),
        }),
      });
      dispatch(addExpense(data));
      if (budget) {
        dispatch(
          editBudget({
            ...budget,
            totalSpend: budget.totalSpend + parseFloat(expAmount),
            totalItems: budget.totalItems + 1,
          }),
        );
      }
      setExpName("");
      setExpAmount("");
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDeleteExpense = async (expId, amount) => {
    try {
      const token = await getToken();
      await apiFetch(`/expenses/${expId}`, token, { method: "DELETE" });
      dispatch(removeExpense(expId));
      if (budget) {
        dispatch(
          editBudget({
            ...budget,
            totalSpend: budget.totalSpend - parseFloat(amount),
            totalItems: budget.totalItems - 1,
          }),
        );
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleEditBudget = async () => {
    try {
      const token = await getToken();
      const data = await apiFetch(`/budgets/${id}`, token, {
        method: "PUT",
        body: JSON.stringify({
          name: editName,
          amount: editAmount,
          icon: editIcon,
        }),
      });
      dispatch(editBudget({ ...budget, ...data }));
      setShowEditForm(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDeleteBudget = async () => {
    try {
      const token = await getToken();
      await apiFetch(`/budgets/${id}`, token, { method: "DELETE" });
      dispatch(removeBudget(parseInt(id)));
      navigate("/dashboard/budgets");
    } catch (err) {
      console.error(err.message);
    }
  };

  const perc = Math.min((budget.totalSpend / budget.amount) * 100, 100).toFixed(
    0,
  );

  return (
    <div className="space-y-6 md:my-6 -my-12 ">
      {/* Header */}
      {/* <div className="flex items-center gap-3"> */}
      {/* <ArrowLeft
            onClick={() => navigate(-1)}
            className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            /> */}
      <h2 className="text-3xl  font-bold text-gray-800 dark:text-gray-100 text-center md:text-left">
        My Expenses
      </h2>
      <div className="flex items-center justify-center md:justify-between flex-wrap gap-3">
        {/* </div> */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowEditForm(true)}
            className="px-4 py-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-full text-sm transition-colors"
          >
            Edit Budget
          </button>
          <button
            onClick={handleDeleteBudget}
            className="flex items-center cursor-pointer gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm transition-colors"
          >
            <Trash size={14} /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Budget Card */}
        <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 transition-colors duration-300">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                {budget.icon}
              </span>
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-100">
                  {budget.name}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {budget.totalItems} items
                </p>
              </div>
            </div>
            <p className="font-bold text-blue-600 dark:text-blue-400">
              ₹{budget.amount}
            </p>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1">
              <span>₹{budget.totalSpend} spent</span>
              <span>₹{budget.amount - budget.totalSpend} left</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${perc}%` }}
              />
            </div>
          </div>
        </div>

        {/* Add Expense */}
        <div className="p-5 border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 space-y-3 transition-colors duration-300">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 ">
            Add Expense
          </h3>
          <input
            placeholder="Expense name"
            value={expName}
            onChange={(e) => setExpName(e.target.value)}
            className={inputCls}
          />
          <input
            type="number"
            placeholder="Amount"
            value={expAmount}
            onChange={(e) => setExpAmount(e.target.value)}
            className={inputCls}
          />
          <button
            onClick={handleAddExpense}
            disabled={!expName || !expAmount}
            className="w-full bg-blue-600 cursor-pointer text-white rounded-full py-2 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            Add Expense
          </button>
        </div>
      </div>

      {/* Expense Table */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 p-5 transition-colors duration-300">
        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-4">
          Expenses
        </h3>
        <div className="grid grid-cols-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 font-semibold text-sm text-gray-600 dark:text-gray-300">
          <span>Name</span>
          <span>Amount</span>
          <span>Date</span>
          <span>Action</span>
        </div>
        {expenses.map((e) => (
          <div
            key={e.id}
            className="grid grid-cols-4 p-2 border-b border-gray-100 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
          >
            <span>{e.name}</span>
            <span>₹{e.amount}</span>
            <span>{new Date(e.createdAt).toLocaleDateString()}</span>
            <button
              onClick={() => handleDeleteExpense(e.id, e.amount)}
              className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-left transition-colors"
            >
              Delete
            </button>
          </div>
        ))}
        {expenses.length === 0 && (
          <p className="text-center py-6 text-gray-400 dark:text-gray-500 text-sm">
            No expenses yet
          </p>
        )}
      </div>

      {/* Edit Budget Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl transition-colors duration-300">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
              Edit Budget
            </h3>
            <input
              value={editIcon}
              onChange={(e) => setEditIcon(e.target.value)}
              className="border border-gray-200 dark:border-gray-600 rounded-xl p-2 w-16 text-2xl text-center bg-white dark:bg-gray-700"
            />
            <input
              placeholder="Budget name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className={inputCls}
            />
            <input
              type="number"
              placeholder="Amount"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              className={inputCls}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditForm(false)}
                className="flex-1 border cursor-pointer border-gray-200 dark:border-gray-600 rounded-full py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditBudget}
                className="flex-1 cursor-pointer bg-blue-600 text-white rounded-full py-2 hover:bg-blue-700 transition-colors"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetDetailPage;
