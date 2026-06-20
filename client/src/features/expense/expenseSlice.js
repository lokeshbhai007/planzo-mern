import { createSlice } from "@reduxjs/toolkit";

const expenseSlice = createSlice({
  name: "expense",
  initialState: {
    expenses: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setExpenses(state, action) {
      state.expenses = action.payload;
    },
    addExpense(state, action) {
      state.expenses.unshift(action.payload);
    },
    removeExpense(state, action) {
      state.expenses = state.expenses.filter((e) => e.id !== action.payload);
    },
  },
});

export const {
  setLoading,
  setError,
  setExpenses,
  addExpense,
  removeExpense,
} = expenseSlice.actions;

export default expenseSlice.reducer;