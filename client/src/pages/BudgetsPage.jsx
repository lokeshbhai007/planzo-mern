import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/react";
import {
  setBudgets,
  addBudget,
  removeBudget,
  setLoading,
  setError,
} from "../features/budget/budgetSlice.js";
import apiFetch from "../utils/apiFetch.js";
import { useNavigate } from "react-router-dom";

function BudgetsPage() {
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { budgets, loading } = useSelector((s) => s.budget);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [icon, setIcon] = useState("💰");
  const [showForm, setShowForm] = useState(false);

  // FETCH all budgets
  useEffect(() => {
    const load = async () => {
      dispatch(setLoading(true));
      try {
        const token = await getToken();
        const data = await apiFetch("/budgets", token);
        dispatch(setBudgets(data));
      } catch (err) {
        dispatch(setError(err.message));
      } finally {
        dispatch(setLoading(false));
      }
    };
    load();
  }, []);

  // CREATE budget
  const handleCreate = async () => {
    if (!name || !amount) return;
    try {
      const token = await getToken();
      const data = await apiFetch("/budgets", token, {
        method: "POST",
        body: JSON.stringify({ name, amount, icon }),
      });
      dispatch(addBudget({ ...data, totalSpend: 0, totalItems: 0 }));
      setName(""); setAmount(""); setIcon("💰"); setShowForm(false);
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  // DELETE budget
  const handleDelete = async (id) => {
    try {
      const token = await getToken();
      await apiFetch(`/budgets/${id}`, token, { method: "DELETE" });
      dispatch(removeBudget(id));
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">My Budgets</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <div
          onClick={() => setShowForm(true)}
          className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <span className="text-3xl">+</span>
          <span className="text-gray-500 mt-1">Create New Budget</span>
        </div>

        {loading
          ? [1, 2, 3].map((i) => (
              <div key={i} className="h-44 rounded-2xl bg-gray-200 animate-pulse" />
            ))
          : budgets.map((b) => {
              const perc = Math.min(
                (b.totalSpend / b.amount) * 100, 100
              ).toFixed(0);
              return (
                <div
                  key={b.id}
                  onClick={() => navigate(`/dashboard/budgets/${b.id}`)}
                  className="p-5 border rounded-2xl bg-white cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl bg-gray-100 p-2 rounded-full">
                        {b.icon}
                      </span>
                      <div>
                        <p className="font-bold text-gray-800">{b.name}</p>
                        <p className="text-xs text-gray-400">{b.totalItems} items</p>
                      </div>
                    </div>
                    <p className="font-bold text-blue-600">₹{b.amount}</p>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>₹{b.totalSpend} spent</span>
                      <span>₹{b.amount - b.totalSpend} left</span>
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
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-bold text-lg">Create Budget</h3>
            <input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="border rounded-xl p-2 w-16 text-2xl text-center"
            />
            <input
              placeholder="Budget name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-xl p-3 w-full"
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="border rounded-xl p-3 w-full"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border rounded-full py-2 text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 bg-blue-600 text-white rounded-full py-2 hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BudgetsPage;