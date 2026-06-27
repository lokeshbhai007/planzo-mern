import { useEffect, useState } from "react";
import {
  UserPlus,
  Wallet,
  Brain,
  Shield,
  TrendingUp,
  BarChart3,
  Badge,
  Lightbulb,
  Lock,
  Smartphone,
  CheckCircle,
  IndianRupee,
  Target,
  PieChart,
  Zap,
  ChevronDown,
  Star,
  Sparkles,
} from "lucide-react";

/* ─── Features ────────────────────────────────────────────────── */
const features = [
  { icon: BarChart3, color: "text-blue-600", gradient: "from-blue-500 to-blue-600", title: "Expense Tracker", description: "Real-time updates and smart categorization", highlight: "Live", demo: "Track ₹2,450 spent on groceries this week" },
  { icon: Target, color: "text-green-600", gradient: "from-green-500 to-green-600", title: "Budget Planning", description: "Set limits and get alerts before overspending", highlight: "Smart", demo: "Budget alert: 80% of dining limit reached" },
  { icon: PieChart, color: "text-orange-500", gradient: "from-orange-500 to-orange-600", title: "Financial Summary", description: "Visual insights into where your money goes", highlight: "Insights", demo: "40% food · 25% rent · 20% fun · 15% savings" },
  { icon: Lightbulb, color: "text-yellow-500", gradient: "from-yellow-500 to-amber-500", title: "AI Insights", description: "Personalised savings advice powered by AI", highlight: "AI", demo: "💡 Save ₹300/month by cooking twice a week" },
  { icon: Shield, color: "text-red-500", gradient: "from-red-500 to-rose-600", title: "Secure Login", description: "Clerk-powered enterprise authentication", highlight: "Secure", demo: "🔒 256-bit encryption protecting your data" },
  { icon: Smartphone, color: "text-indigo-600", gradient: "from-indigo-500 to-purple-600", title: "Modern UI", description: "Responsive, dark-mode ready, smooth animations", highlight: "Premium", demo: "✨ Works great on mobile & desktop" },
];

function Features() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % features.length), 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <Badge icon={<Star className="w-3 h-3 text-purple-600" />} label="Feature Rich" colors="from-purple-100 to-pink-100 text-purple-700" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">Powerful Features</h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">Everything you need to take control of your finances</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            const isActive = active === i;
            return (
              <div
                key={i}
                onMouseEnter={() => setActive(i)}
                className={`bg-white/90 backdrop-blur-sm rounded-xl p-5 shadow-md cursor-pointer transition-all duration-400 border ${
                  isActive
                    ? "border-blue-300 shadow-xl -translate-y-1 ring-2 ring-blue-200"
                    : "border-gray-100 hover:-translate-y-1 hover:shadow-lg"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-gray-50 rounded-xl p-2.5 shadow-sm">
                    <Icon className={`w-5 h-5 ${f.color}`} />
                  </div>
                  <span className={`bg-gradient-to-r ${f.gradient} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>
                    {f.highlight}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{f.description}</p>
                <div className={`bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600 transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-60"}`}>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse inline-block" />
                    {f.demo}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
 

export default Features