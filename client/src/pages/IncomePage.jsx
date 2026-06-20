import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/react";
import {
  setIncomes,
  addIncome,
  removeIncome,
  setLoading,
} from "../features/income/incomeSlice.js";
import apiFetch from "../utils/apiFetch.js";

function IncomePage() {
  const dispatch = useDispatch();
  const { getToken } = useAuth();
  const { incomes, loading } = useSelector((s) => s.income);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [icon, setIcon] = useState("💵");
  const [showForm, setShowForm] = useState(false);

  // FETCH all incomes
  useEffect(() => {
    const load = async () => {
      dispatch(setLoading(true));
      try {
        const token = await getToken();
        const data = await apiFetch("/incomes", token);
        dispatch(setIncomes(data));
      } catch (err) {
        console.error(err.message);
      } finally {
        dispatch(setLoading(false));
      }
    };
    load();
  }, []);

  // CREATE income
  const handleCreate = async () => {
    if (!name || !amount) return;
    try {
      const token = await getToken();
      const data = await apiFetch("/incomes", token, {
        method: "POST",
        body: JSON.stringify({ name, amount, icon }),
      });
      dispatch(addIncome(data));
      setName("");
      setAmount("");
      setIcon("💵");
      setShowForm(false);
    } catch (err) {
      console.error(err.message);
    }
  };

  // DELETE income
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
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-800">My Income Streams</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {/* Create Card */}
        <div
          onClick={() => setShowForm(true)}
          className="border-2 border-dashed border-gray-300 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
        >
          <span className="text-3xl">+</span>
          <span className="text-gray-500 mt-1">Add Income Source</span>
        </div>

        {loading
          ? [1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-gray-200 animate-pulse"
              />
            ))
          : incomes.map((inc) => (
              <div
                key={inc.id}
                className="p-5 border rounded-2xl bg-white flex justify-between items-center hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl bg-gray-100 p-2 rounded-full">
                    {inc.icon}
                  </span>
                  <p className="font-bold text-gray-800">{inc.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-bold text-green-600">₹{inc.amount}</p>
                  <button
                    onClick={() => handleDelete(inc.id)}
                    className="text-red-400 hover:text-red-600 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
      </div>

      {/* Create Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
            <h3 className="font-bold text-lg">Add Income Source</h3>
            <input
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
              className="border rounded-xl p-2 w-16 text-2xl text-center"
            />
            <input
              placeholder="Source name e.g. Freelancing"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-xl p-3 w-full"
            />
            <input
              type="number"
              placeholder="Monthly amount"
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
                disabled={!name || !amount}
                className="flex-1 bg-blue-600 text-white rounded-full py-2 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
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