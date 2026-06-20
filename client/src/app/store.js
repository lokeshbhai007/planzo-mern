import { configureStore } from "@reduxjs/toolkit";
import budgetReducer from "../features/budget/budgetSlice.js";
import expenseReducer from "../features/expense/expenseSlice.js";
import incomeReducer from "../features/income/incomeSlice.js";

const store = configureStore({
  reducer: {
    budget: budgetReducer,
    expense: expenseReducer,
    income: incomeReducer,
  },
});

export default store;