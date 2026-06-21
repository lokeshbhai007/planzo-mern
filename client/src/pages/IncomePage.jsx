import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/react";
import {
  setIncomes, addIncome, removeIncome, setLoading,
} from "../features/income/incomeSlice.js";
import apiFetch from "../utils/apiFetch.js";

const inputCls = "border border-gray-200 dark:border-gray-600 rounded-xl p-3 w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-colors";

function IncomePage() {
  const dispatch     = useDispatch();
  const { getToken } = useAuth();
  const { incomes, loading } = useSelector((s) => s.income);

  const [name, setName]         = useState("");
  const [amount, setAmount]     = useState("");
  const [icon, setIcon]         = useState("💵");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const load = async () => {
      dispatch(setLoading(true));
      try {
        const token = await getToken();
        const data  = await apiFetch("/incomes", token);
        dispatch(setIncomes(data));
      } catch (err) {
        console.error(err.message);
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
      const data  = await apiFetch("/incomes", token, {
        method: "POST",
        body: JSON.stringify({ name, amount, icon }),
      });
      dispatch(addIncome(data));
      setName(""); setAmount(""); setIcon("💵"); setShowForm(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await getToken();
      await apiFetch(`/incomes/${id}`, token, { method: "DELETE" });
      dispatch(removeIncome(id));
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="space-y-6 md:my-6 -my-12">
      <h2 className="text-3xl  font-bold text-gray-800 dark:text-gray-100 text-center md:text-left">My Income Streams</h2>

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
          <span className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Add Income Source</span>
        </div>

        {loading
          ? [1, 2, 3].map((i) => (
              <div key={i} className="h-32 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ))
          : incomes.map((inc) => (
              <div
                key={inc.id}
                className="p-5 border border-gray-200 dark:border-gray-700
                           rounded-2xl bg-white dark:bg-gray-800
                           flex justify-between items-center
                           hover:shadow-md dark:hover:shadow-gray-900/40
                           transition-all duration-200"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl bg-gray-100 dark:bg-gray-700 p-2 rounded-full">
                    {inc.icon}
                  </span>
                  <p className="font-bold text-gray-800 text-xl dark:text-gray-100">{inc.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-green-600 text-lg dark:text-green-400">₹{inc.amount}</p>
                  <button
                    onClick={() => handleDelete(inc.id)}
                    className="text-red-400 cursor-pointer dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 text-lg transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
      </div>

      {/* Create Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-xl transition-colors duration-300">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">Add Income Source</h3>
            <input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="border border-gray-200 dark:border-gray-600 rounded-xl p-2 w-16 text-2xl text-center bg-white dark:bg-gray-700"
            />
            <input
              placeholder="Source name e.g. Freelancing"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
            />
            <input
              type="number"
              placeholder="Monthly amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={inputCls}
            />
            <div className="flex gap-3">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 border border-gray-200 dark:border-gray-600 rounded-full py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={!name || !amount}
                className="flex-1 bg-blue-600 text-white rounded-full py-2 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default IncomePage;