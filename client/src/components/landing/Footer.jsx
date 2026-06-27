import { IndianRupee } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 px-6 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
          <IndianRupee className="w-3 h-3 text-white" />
        </div>
        <span className="text-white font-bold text-lg">Planzo</span>
      </div>
      <p className="text-sm">Smart personal finance tracker &mdash; built for India.</p>
      <p className="text-xs mt-2 text-gray-600">&copy; 2026 Planzo. All rights reserved.</p>
    </footer>
  );
}

export default Footer