import { createSlice } from "@reduxjs/toolkit";

const incomeSlice = createSlice({
  name: "income",
  initialState: {
    incomes: [],
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
    setIncomes(state, action) {
      state.incomes = action.payload;
    },
    addIncome(state, action) {
      state.incomes.unshift(action.payload);
    },
    removeIncome(state, action) {
      state.incomes = state.incomes.filter((i) => i.id !== action.payload);
    },
  },
});

export const {
  setLoading,
  setError,
  setIncomes,
  addIncome,
  removeIncome,
} = incomeSlice.actions;

export default incomeSlice.reducer;