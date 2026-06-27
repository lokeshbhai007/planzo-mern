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
import logo from "../../assets/logo.svg";
import ProfileStrip from "../sidebar-ui/ProfileStrip";
import NavItems from "../sidebar-ui/NavItems";
import ThemeToggle from "../sidebar-ui/ThemeToggle";



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
            <img src={logo} alt="Logo" className="w-8 h-8" />
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