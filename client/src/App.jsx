import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";
import DashboardLayout from "./components/common/DashboardLayout.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import BudgetsPage from "./pages/BudgetsPage.jsx";
import ExpensesPage from "./pages/ExpensesPage.jsx";
import BudgetDetailPage from "./pages/BudgetDetailPage.jsx";
import IncomePage from "./pages/IncomePage.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DashboardPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/budgets"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <BudgetsPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/budgets/:id"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <BudgetDetailPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/expenses"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ExpensesPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/incomes"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <IncomePage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;