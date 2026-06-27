
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      className="
        w-9 h-9 flex items-center justify-center rounded-lg cursor-pointer
        text-gray-500 dark:text-gray-400
        hover:bg-gray-100 dark:hover:bg-gray-700
        transition-colors duration-200
      "
    >
      {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export default ThemeToggle