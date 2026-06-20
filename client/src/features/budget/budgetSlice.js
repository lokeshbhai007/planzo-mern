import { createSlice } from "@reduxjs/toolkit";

const budgetSlice = createSlice({
  name: "budget",
  initialState: {
    budgets: [],
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
    setBudgets(state, action) {
      state.budgets = action.payload;
    },
    addBudget(state, action) {
      state.budgets.unshift(action.payload);
    },
    editBudget(state, action) {
      const index = state.budgets.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) state.budgets[index] = action.payload;
    },
    removeBudget(state, action) {
      state.budgets = state.budgets.filter((b) => b.id !== action.payload);
    },
  },
});

export const {
  setLoading,
  setError,
  setBudgets,
  addBudget,
  editBudget,
  removeBudget,
} = budgetSlice.actions;

export default budgetSlice.reducer;