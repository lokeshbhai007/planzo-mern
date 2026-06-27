import { SignInButton } from "@clerk/react";
import { IndianRupee } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "../../assets/logo.svg";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 px-6 sm:px-12 lg:px-24 py-4 flex justify-between items-center ${
        scrolled
          ? "bg-white/80 backdrop-blur-lg shadow-md"
          : "bg-transparent shadow-sm "
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg  flex items-center justify-center shadow">
          <img src={logo} alt="Logo" className="w-8 h-8" />
        </div>
        <span className="text-blue-800 font-bold text-xl tracking-tight">
          Planzo
        </span>
      </div>

      {/* CTA */}
      <SignInButton mode="modal">
        <button className="px-5 py-2 cursor-pointer bg-blue-600 text-white text-sm font-semibold rounded-full hover:bg-blue-700 active:scale-95 transition-all shadow-sm">
          Get Started →
        </button>
      </SignInButton>
    </header>
  );
}

export default Navbar;
