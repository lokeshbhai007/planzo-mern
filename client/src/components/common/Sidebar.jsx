import { NavLink } from "react-router-dom";
import { UserButton } from "@clerk/react";
import { LayoutGrid, PiggyBank, ReceiptText, CircleDollarSign } from "lucide-react";

const menuList = [
  { id: 1, name: "Dashboard", path: "/dashboard", icon: LayoutGrid },
  { id: 2, name: "Incomes", path: "/dashboard/incomes", icon: CircleDollarSign },
  { id: 3, name: "Budgets", path: "/dashboard/budgets", icon: PiggyBank },
  { id: 4, name: "Expenses", path: "/dashboard/expenses", icon: ReceiptText },
];

function Sidebar() {
  return (
    <div className="h-screen w-64 border-r bg-white flex flex-col p-5 fixed">
      <h1 className="text-2xl font-bold text-blue-700 mb-8">Planzo</h1>

      <nav className="flex flex-col gap-2 flex-1">
        {menuList.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            end={item.path === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors
              ${isActive
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="flex items-center gap-3 px-3 py-3 rounded-xl border">
        <UserButton />
        <span className="text-gray-700 font-medium">Profile</span>
      </div>
    </div>
  );
}

export default Sidebar;