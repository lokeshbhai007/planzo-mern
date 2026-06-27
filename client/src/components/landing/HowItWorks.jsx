import {
  UserPlus,
  Wallet,
  Brain,
  Shield,
  TrendingUp,
  BarChart3,
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
  Badge,
} from "lucide-react";

/* ─── How It Works ────────────────────────────────────────────── */
const steps = [
  {
    icon: UserPlus,
    iconColor: "text-blue-600",
    bg: "bg-blue-50",
    gradient: "from-blue-500 to-blue-600",
    title: "Sign Up Securely",
    description: "Clerk-powered auth gets you in within seconds. Your data is protected from day one.",
    detail: "Instant account creation",
  },
  {
    icon: Wallet,
    iconColor: "text-green-600",
    bg: "bg-green-50",
    gradient: "from-green-500 to-green-600",
    title: "Track & Budget",
    description: "Add income, set smart budgets, and log expenses with our intuitive interface.",
    detail: "Real-time expense tracking",
  },
  {
    icon: Brain,
    iconColor: "text-indigo-600",
    bg: "bg-indigo-50",
    gradient: "from-indigo-500 to-indigo-600",
    title: "AI-Powered Insights",
    description: "Get personalized financial advice tailored to your spending patterns.",
    detail: "Smart recommendations",
  },
];

function HowItWorks() {
  return (
    <section className="py-20 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <Badge icon={<Sparkles className="w-3 h-3 text-blue-600" />} label="Simple & Powerful" colors="from-blue-100 to-indigo-100 text-blue-700" />
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">How It Works</h2>
        <p className="text-gray-500 mt-3 max-w-md mx-auto">Three steps to financial clarity</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 relative">
        {/* connector lines */}
        <div className="hidden md:block absolute top-1/2 left-[33%] right-[33%] h-0.5 bg-gradient-to-r from-blue-200 via-green-200 to-indigo-200 -translate-y-1/2" />

        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="relative group z-10">
              {/* step number */}
              <div className={`absolute -top-3 -left-3 bg-gradient-to-br ${s.gradient} text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md`}>
                {i + 1}
              </div>
              <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 text-center">
                <div className={`${s.bg} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform shadow-sm`}>
                  <Icon className={`w-7 h-7 ${s.iconColor}`} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{s.description}</p>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{s.detail}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}


export default HowItWorks