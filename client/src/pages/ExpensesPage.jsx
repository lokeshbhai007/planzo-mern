import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "@clerk/react";
import { setExpenses, removeExpense, setLoading } from "../features/expense/expenseSlice.js";
import apiFetch from "../utils/apiFetch.js";

function ExpensesPage() {
  const dispatch     = useDispatch();
  const { getToken } = useAuth();
  const { expenses, loading } = useSelector((s) => s.expense);

  useEffect(() => {
    const load = async () => {
      dispatch(setLoading(true));
      try {
        const token = await getToken();
        const data  = await apiFetch("/expenses", token);
        dispatch(setExpenses(data));
      } catch (err) {
        console.error(err.message);
      } finally {
        dispatch(setLoading(false));
      }
    };
    load();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = await getToken();
      await apiFetch(`/expenses/${id}`, token, { method: "DELETE" });
      dispatch(removeExpense(id));
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="space-y-6 md:my-6 -my-12">
      <h2 className="text-3xl  font-bold text-gray-800 dark:text-gray-100 text-center md:text-left">My Expenses</h2>

      <div className="border border-gray-200 dark:border-gray-700 rounded-2xl bg-white dark:bg-gray-800 p-5 transition-colors duration-300">
        {/* Table Header */}
        <div className="grid grid-cols-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-2 font-semibold text-sm text-gray-600 dark:text-gray-300">
          <span>Name</span>
          <span>Amount</span>
          <span>Date</span>
          <span>Action</span>
        </div>

        {loading ? (
          <div className="space-y-2 mt-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-10 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : expenses.length === 0 ? (
          <p className="text-center py-10 text-gray-400 dark:text-gray-500 text-sm">
            No expenses yet
          </p>
        ) : (
          expenses.map((e) => (
            <div
              key={e.id}
              className="grid grid-cols-4 p-2 border-b border-gray-100 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <span>{e.name}</span>
              <span>₹{e.amount}</span>
              <span>{new Date(e.createdAt).toLocaleDateString()}</span>
              <button
                onClick={() => handleDelete(e.id)}
                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-left transition-colors"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ExpensesPage;