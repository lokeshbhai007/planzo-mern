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

// ── Reusable dark-mode modal ───────────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl transition-colors duration-300">
        <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">
          {title}
        </h3>
        {children}
      </div>
    </div>
  );
}

// ── Reusable dark-mode input ───────────────────────────────────────────────
const inputCls =
  "border border-gray-200 dark:border-gray-600 rounded-xl p-3 w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors";

function BudgetsPage() {
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const { budgets, loading } = useSelector((s) => s.budget);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [icon, setIcon] = useState("💰");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Skip fetch if Redux already has data
    if (budgets.length > 0) return;

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

  const handleCreate = async () => {
    if (!name || !amount) return;
    try {
      const token = await getToken();
      const data = await apiFetch("/budgets", token, {
        method: "POST",
        body: JSON.stringify({ name, amount, icon }),
      });
      dispatch(addBudget({ ...data, totalSpend: 0, totalItems: 0 }));
      setName("");
      setAmount("");
      setIcon("💰");
      setShowForm(false);
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation(); // don't navigate when deleting
    try {
      const token = await getToken();
      await apiFetch(`/budgets/${id}`, token, { method: "DELETE" });
      dispatch(removeBudget(id));
    } catch (err) {
      dispatch(setError(err.message));
    }
  };

  return (
    <div className="space-y-6 md:my-6 -my-12">
      <h2 className="text-3xl  font-bold text-gray-800 dark:text-gray-100 text-center md:text-left">
        My Budgets
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Create card */}
        <div
          onClick={() => setShowForm(true)}
          className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-8
                     flex flex-col items-center justify-center cursor-pointer
                     hover:border-blue-400 dark:hover:border-blue-500
                     hover:bg-blue-50 dark:hover:bg-blue-900/20
                     transition-colors duration-200"
        >
          <span className="text-3xl text-gray-400 dark:text-gray-500">+</span>
          <span className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Create New Budget
          </span>
        </div>

        {loading
          ? [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-44 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse"
              />
            ))
          : budgets.map((b) => {
              const perc = Math.min(
                (b.totalSpend / b.amount) * 100,
                100,
              ).toFixed(0);
              return (
                <div
                  key={b.id}
                  onClick={() => navigate(`/dashboard/budgets/${b.id}`)}
                  className="p-5 border border-gray-200 dark:border-gray-700
                             rounded-2xl bg-white dark:bg-gray-800
                             cursor-pointer hover:shadow-md dark:hover:shadow-gray-900/40
                             transition-all duration-200"
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                        {b.icon}
                      </span>
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-100">
                          {b.name}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {b.totalItems} items
                        </p>
                      </div>
                    </div>
                    <p className="font-bold text-blue-600 dark:text-blue-400">
                      ₹{b.amount}
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-1">
                      <span>₹{b.totalSpend} spent</span>
                      <span>₹{b.amount - b.totalSpend} left</span>
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
      </div>

      {showForm && (
        <Modal title="Create Budget" onClose={() => setShowForm(false)}>
          <input
            value={icon}
            onChange={(e) => setIcon(e.target.value)}
            className="border border-gray-200 dark:border-gray-600 rounded-xl p-2 w-16 text-2xl text-center bg-white dark:bg-gray-700"
          />
          <input
            placeholder="Budget name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputCls}
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className={inputCls}
          />
          <div className="flex gap-3">
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 border cursor-pointer border-gray-200 dark:border-gray-600 rounded-full py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!name || !amount}
              className="flex-1 bg-blue-600 cursor-pointer text-white rounded-full py-2 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              Create
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export default BudgetsPage;
