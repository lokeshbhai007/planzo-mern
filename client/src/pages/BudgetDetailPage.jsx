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

function BudgetDetailPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  const budget = useSelector((s) =>
    s.budget.budgets.find((b) => b.id === parseInt(id))
  );
  const { expenses } = useSelector((s) => s.expense);

  const [expName, setExpName] = useState("");
  const [expAmount, setExpAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editName, setEditName] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editIcon, setEditIcon] = useState("");

  // Load budget + expenses for this page
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

  // Pre-fill edit form when budget loads
  useEffect(() => {
    if (budget) {
      setEditName(budget.name);
      setEditAmount(budget.amount);
      setEditIcon(budget.icon);
    }
  }, [budget]);

  // ADD expense
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
      // Update budget totalSpend and totalItems in store
      if (budget) {
        dispatch(
          editBudget({
            ...budget,
            totalSpend: budget.totalSpend + parseFloat(expAmount),
            totalItems: budget.totalItems + 1,
          })
        );
      }
      setExpName("");
      setExpAmount("");
    } catch (err) {
      console.error(err.message);
    }
  };

  // DELETE expense
  const handleDeleteExpense = async (expId, expAmount) => {
    try {
      const token = await getToken();
      await apiFetch(`/expenses/${expId}`, token, { method: "DELETE" });
      dispatch(removeExpense(expId));
      if (budget) {
        dispatch(
          editBudget({
            ...budget,
            totalSpend: budget.totalSpend - parseFloat(expAmount),
            totalItems: budget.totalItems - 1,
          })
        );
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  // EDIT budget
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

  // DELETE budget
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

  if (loading || !budget) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-gray-200 animate-pulse rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="h-44 bg-gray-200 animate-pulse rounded-2xl" />
          <div className="h-44 bg-gray-200 animate-pulse rounded-2xl" />
        </div>
      </div>
    );
  }

  const perc = Math.min(
    (budget.totalSpend / budget.amount) * 100, 100
  ).toFixed(0);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ArrowLeft
            onClick={() => navigate(-1)}
            className="cursor-pointer text-gray-600 hover:text-blue-600"
          />
          <h2 className="text-2xl font-bold text-gray-800">My Expenses</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowEditForm(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm"
          >
            Edit Budget
          </button>
          <button
            onClick={handleDeleteBudget}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 text-sm"
          >
            <Trash size={14} /> Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* Budget Card */}
        <div className="p-5 border rounded-2xl bg-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="text-2xl bg-gray-100 p-2 rounded-full">
                {budget.icon}
              </span>
              <div>
                <p className="font-bold text-gray-800">{budget.name}</p>
                <p className="text-xs text-gray-400">{budget.totalItems} items</p>
              </div>
            </div>
            <p className="font-bold text-blue-600">₹{budget.amount}</p>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>₹{budget.totalSpend} spent</span>
              <span>₹{budget.amount - budget.totalSpend} left</span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${perc}%` }}
              />
            </div>
          </div>
        </div>

        {/* Add Expense */}
        <div className="p-5 border rounded-2xl bg-white space-y-3">
          <h3 className="font-bold text-gray-800">Add Expense</h3>
          <input
            placeholder="Expense name"
            value={expName}
            onChange={(e) => setExpName(e.target.value)}
            className="border rounded-xl p-3 w-full"
          />
          <input
            type="number"
            placeholder="Amount"
            value={expAmount}
            onChange={(e) => setExpAmount(e.target.value)}
            className="border rounded-xl p-3 w-full"
          />
          <button
            onClick={handleAddExpense}
            disabled={!expName || !expAmount}
            className="w-full bg-blue-600 text-white rounded-full py-2 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Add Expense
          </button>
        </div>
      </div>

      {/* Expense Table */}
      <div className="border rounded-2xl bg-white p-5">
        <h3 className="font-bold text-gray-800 mb-4">Expenses</h3>
        <div className="grid grid-cols-4 bg-gray-100 rounded-lg p-2 font-semibold text-sm text-gray-600">
          <span>Name</span>
          <span>Amount</span>
          <span>Date</span>
          <span>Action</span>
        </div>
        {expenses.map((e) => (
          <div
            key={e.id}
            className="grid grid-cols-4 p-2 border-b text-sm text-gray-700 hover:bg-gray-50"
          >
            <span>{e.name}</span>
            <span>₹{e.amount}</span>
            <span>{new Date(e.createdAt).toLocaleDateString()}</span>
            <button
              onClick={() => handleDeleteExpense(e.id, e.amount)}
              className="text-red-500 hover:text-red-700 text-left"
            >
              Delete
            </button>
          </div>
        ))}
        {expenses.length === 0 && (
          <p className="text-center py-6 text-gray-400 text-sm">
            No expenses yet
          </p>
        )}
      </div>

      {/* Edit Budget Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-bold text-lg">Edit Budget</h3>
            <input
              value={editIcon}
              onChange={(e) => setEditIcon(e.target.value)}
              className="border rounded-xl p-2 w-16 text-2xl text-center"
            />
            <input
              placeholder="Budget name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="border rounded-xl p-3 w-full"
            />
            <input
              type="number"
              placeholder="Amount"
              value={editAmount}
              onChange={(e) => setEditAmount(e.target.value)}
              className="border rounded-xl p-3 w-full"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowEditForm(false)}
                className="flex-1 border rounded-full py-2 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditBudget}
                className="flex-1 bg-blue-600 text-white rounded-full py-2 hover:bg-blue-700"
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