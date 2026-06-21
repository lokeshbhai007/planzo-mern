import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { UserButton } from "@clerk/react";
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
import { useTheme } from "../../context/ThemeContext";

const menuList = [
  { id: 1, name: "Dashboard", path: "/dashboard", icon: LayoutGrid },
  { id: 2, name: "Incomes",   path: "/dashboard/incomes", icon: CircleDollarSign },
  { id: 3, name: "Budgets",   path: "/dashboard/budgets", icon: PiggyBank },
  { id: 4, name: "Expenses",  path: "/dashboard/expenses", icon: ReceiptText },
];

// ── Small toggle button shared by both desktop and mobile ──────────────────
function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="
        w-9 h-9 flex items-center justify-center rounded-lg
        text-gray-500 dark:text-gray-400
        hover:bg-gray-100 dark:hover:bg-gray-700
        transition-colors duration-200
      "
    >
      {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

// ── Nav items (reused in both sidebars) ────────────────────────────────────
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

// ── Profile strip (reused in both sidebars) ───────────────────────────────
function ProfileStrip() {
  return (
    <div className="
      flex items-center gap-3 px-3 py-3 rounded-xl
      border border-gray-200 dark:border-gray-700
      bg-gray-50 dark:bg-gray-800
      hover:bg-gray-100 dark:hover:bg-gray-700
      transition-colors duration-200 cursor-pointer
    ">
      <UserButton />
      <span className="text-gray-700 dark:text-gray-200 font-medium text-sm">
        Profile
      </span>
    </div>
  );
}

// ── Main Sidebar component ─────────────────────────────────────────────────
function Sidebar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close on outside click
  useEffect(() => {
    if (!isMobileOpen) return;
    const handler = (e) => {
      if (
        !e.target.closest("#planzo-mobile-sidebar") &&
        !e.target.closest("#planzo-hamburger")
      ) {
        setIsMobileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMobileOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMobileOpen]);

  return (
    <>
      {/* ── Hamburger button (mobile only) ─────────────────────────────── */}
      <button
        id="planzo-hamburger"
        onClick={() => setIsMobileOpen((v) => !v)}
        aria-label="Open menu"
        className="
          md:hidden fixed top-4 left-4 z-50
          p-2 rounded-lg
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          shadow-md text-gray-700 dark:text-gray-200
          hover:bg-gray-50 dark:hover:bg-gray-700
          transition-all duration-200
        "
      >
        {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* ── Overlay (mobile only) ──────────────────────────────────────── */}
      <div
        onClick={() => setIsMobileOpen(false)}
        className={`
          md:hidden fixed inset-0 z-40
          bg-black/50 dark:bg-black/70
          transition-opacity duration-300
          ${isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* ── Desktop Sidebar ────────────────────────────────────────────── */}
      <aside className="
        hidden md:flex flex-col
        fixed top-0 left-0 h-screen w-64
        bg-white dark:bg-gray-900
        border-r border-gray-200 dark:border-gray-700
        p-5 z-30
        transition-colors duration-300
      ">
        {/* Logo + Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
              className="text-blue-600 dark:text-blue-400" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              <path d="M8 12h8M12 8v8"/>
            </svg>
            <span className="text-blue-700 dark:text-blue-400 font-bold text-2xl tracking-tight">
              Planzo
            </span>
          </div>
          <ThemeToggle />
        </div>

        <NavItems />

        {/* Profile pinned to bottom */}
        <div className="mt-4">
          <ProfileStrip />
        </div>
      </aside>

      {/* ── Mobile Sidebar (slide-in drawer) ──────────────────────────── */}
      <aside
        id="planzo-mobile-sidebar"
        className={`
          md:hidden fixed top-0 left-0 h-screen w-72
          bg-white dark:bg-gray-900
          border-r border-gray-200 dark:border-gray-700
          z-50 flex flex-col p-5
          transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo + Toggle (with top padding for hamburger button space) */}
        <div className="flex items-center justify-between mb-6 mt-12">
          <div className="flex items-center gap-2">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
              className="text-blue-600 dark:text-blue-400" stroke="currentColor" strokeWidth="2">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/>
              <path d="M8 12h8M12 8v8"/>
            </svg>
            <span className="text-blue-700 dark:text-blue-400 font-bold text-2xl tracking-tight">
              Planzo
            </span>
          </div>
          <ThemeToggle />
        </div>

        <NavItems onItemClick={() => setIsMobileOpen(false)} />

        <div className="mt-4">
          <ProfileStrip />
        </div>
      </aside>
    </>
  );
}

export default Sidebar;