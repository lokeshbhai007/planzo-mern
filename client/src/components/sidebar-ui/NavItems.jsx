import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  PiggyBank,
  ReceiptText,
  CircleDollarSign,
  Menu,
  X,
  Sun,
  Moon,
} from "lucide-react";

const menuList = [
  { id: 1, name: "Dashboard", path: "/dashboard", icon: LayoutGrid },
  { id: 2, name: "Incomes",   path: "/dashboard/incomes", icon: CircleDollarSign },
  { id: 3, name: "Budgets",   path: "/dashboard/budgets", icon: PiggyBank },
  { id: 4, name: "Expenses",  path: "/dashboard/expenses", icon: ReceiptText },
];


function NavItems({ onItemClick }) {
  return (
    <nav className="flex flex-col gap-1 flex-1 mt-2">
      {menuList.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          end={item.path === "/dashboard"}
          onClick={onItemClick}
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm
             transition-all duration-200
             ${
               isActive
                 ? "bg-blue-50 dark:bg-blue-900/25 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800/40"
                 : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:text-gray-900 dark:hover:text-gray-100"
             }`
          }
        >
          <item.icon size={19} />
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
}

export default NavItems