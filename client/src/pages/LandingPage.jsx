import { SignInButton, SignUpButton, useAuth } from "@clerk/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import bannerImg from "../assets/hero.png";
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
} from "lucide-react";

/* ─── ContainerScroll (inline — no extra file needed) ────────── */
function ContainerScroll({ titleComponent, children }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const rotate   = useTransform(scrollYProgress, [0, 1], [20, 0]);
  const scale    = useTransform(scrollYProgress, [0, 1], isMobile ? [0.7, 0.9] : [1.05, 1]);
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <div
      ref={containerRef}
      className="h-[60rem] md:h-[80rem] flex items-center justify-center relative p-2 md:p-20"
    >
      <div className="py-10 md:py-40 w-full relative" style={{ perspective: "1000px" }}>
        {/* Title */}
        <motion.div style={{ translateY: translate }} className="max-w-5xl mx-auto text-center">
          {titleComponent}
        </motion.div>

        {/* Scroll-animated card */}
        <motion.div
          style={{
            rotateX: rotate,
            scale,
            boxShadow:
              "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
          }}
          className="max-w-5xl -mt-12 mx-auto h-[30rem] md:h-[40rem] w-full border-4 border-[#6C6C6C] p-2 md:p-6 bg-[#222222] rounded-[30px] shadow-2xl"
        >
          <div className="h-full w-full overflow-hidden rounded-2xl bg-gray-100 md:rounded-2xl md:p-4">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Navbar ─────────────────────────────────────────────────── */
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
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow">
          <IndianRupee className="w-4 h-4 text-white" />
        </div>
        <span className="text-blue-800 font-bold text-xl tracking-tight">Planzo</span>
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

/* ─── Hero ────────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative bg-gray-50 flex flex-col items-center overflow-hidden pt-6">
      {/* Ambient blobs */}
      <div className="pointer-events-none absolute top-24 left-1/4 w-80 h-80 rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse" />
      <div className="pointer-events-none absolute top-40 right-1/4 w-80 h-80  rounded-full mix-blend-multiply filter blur-3xl opacity-25 animate-pulse" style={{ animationDelay: "1s" }} />

      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center">
            {/* Sparkle badge */}
            <div className="relative inline-flex items-center bg-gradient-to-r from-blue-100 to-indigo-100 px-4 py-1.5 rounded-full mb-5 border border-blue-200/60 cursor-default group overflow-hidden">
              {/* mini ping dots */}
              {[
                { color: "#facc15", l: "12%", t: "20%" },
                { color: "#f472b6", l: "28%", t: "60%" },
                { color: "#34d399", l: "50%", t: "15%" },
                { color: "#818cf8", l: "70%", t: "65%" },
                { color: "#60a5fa", l: "85%", t: "25%" },
              ].map((d, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full animate-ping opacity-60"
                  style={{ backgroundColor: d.color, left: d.l, top: d.t, animationDelay: `${i * 0.35}s` }}
                />
              ))}
              <Sparkles className="w-3.5 h-3.5 text-blue-600 mr-2 z-10 animate-pulse" />
              <span className="text-xs font-semibold text-indigo-700 z-10">Smart &amp; AI-Powered</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl font-semibold text-gray-900  ">
              Manage your Money with AI-Driven Personal
            </h1>
            <span className="text-5xl md:text-[6rem] font-bold text-blue-800 leading-none mb-2">
              Finance Advisor
            </span>
          </div>
        }
      >
        {/* Banner image inside the scroll card */}
        <img
          src={bannerImg}
          alt="Planzo dashboard preview"
          className="mx-auto rounded-2xl object-cover h-full w-full object-left-top"
          draggable={false}
        />
      </ContainerScroll>
    </section>
  );
}

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

/* ─── Why Planzo ──────────────────────────────────────────────── */
const valueProps = [
  { icon: Lock, iconColor: "text-white", gradient: "from-blue-500 to-cyan-500", title: "Privacy-First", description: "Your financial data never leaves secure servers" },
  { icon: Brain, iconColor: "text-white", gradient: "from-purple-500 to-pink-500", title: "Intelligent Advice", description: "Not just numbers — actionable insights for your goals" },
  { icon: IndianRupee, iconColor: "text-white", gradient: "from-green-500 to-emerald-500", title: "Built for India", description: "PPF, SIP, and Indian financial instruments supported" },
  { icon: Zap, iconColor: "text-white", gradient: "from-yellow-500 to-orange-500", title: "Student & Pro Ready", description: "From internship earnings to full career planning" },
];

const useCases = [
  "Track internship earnings & rent expenses",
  "Plan savings for college fees and education",
  "Manage family budget and household expenses",
  "Build emergency funds with AI guidance",
];

function WhyPlanzo() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <Badge icon={<CheckCircle className="w-3 h-3 text-green-600" />} label="Why Choose Us" colors="from-green-100 to-emerald-100 text-green-700" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">Why Choose Planzo?</h2>
          <p className="text-gray-500 mt-3 max-w-md mx-auto">Built with your privacy, intelligence, and success in mind</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {valueProps.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 text-center group hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
                <div className={`bg-gradient-to-br ${p.gradient} w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-md`}>
                  <Icon className={`w-5 h-5 ${p.iconColor}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.description}</p>
              </div>
            );
          })}
        </div>

        {/* Use cases banner */}
        <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_top_right,_white,_transparent)]" />
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
            <Target className="w-5 h-5" /> Perfect For Every Financial Goal
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 relative z-10">
            {useCases.map((uc, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-3 hover:bg-white/20 transition-colors">
                <CheckCircle className="w-4 h-4 text-green-300 flex-shrink-0" />
                <span className="text-sm font-medium">{uc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─────────────────────────────────────────────────────── */
const faqs = [
  { q: "Is Planzo free to use?", a: "Yes! Planzo offers a comprehensive free tier with all essential features. Premium analytics are coming soon.", icon: "💰" },
  { q: "How is my data stored?", a: "Your data is encrypted with bank-grade security. We never share or sell your personal financial information.", icon: "🔒" },
  { q: "Do I need finance knowledge?", a: "Not at all! Our AI explains everything in simple terms and guides you step by step through every decision.", icon: "🧠" },
  { q: "Does it work on mobile?", a: "Absolutely! Planzo is fully responsive and works seamlessly on all devices — desktop, tablet, and mobile.", icon: "📱" },
];

function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <Badge icon={<span className="text-sm">❓</span>} label="Got Questions?" colors="from-orange-100 to-red-100 text-orange-700" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="text-lg">{f.icon}</span>
                  <span className="font-semibold text-gray-900">{f.q}</span>
                </span>
                <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${open === i ? "rotate-180" : ""}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-400 ${open === i ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-6 pb-5">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-2 border-blue-400">
                    <p className="text-gray-600 text-sm leading-relaxed">{f.a}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ──────────────────────────────────────────────────── */
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

/* ─── Shared Badge component ──────────────────────────────────── */
function Badge({ icon, label, colors }) {
  return (
    <div className={`inline-flex items-center bg-gradient-to-r ${colors} px-4 py-1.5 rounded-full gap-1.5`}>
      {icon}
      <span className="text-xs font-semibold">{label}</span>
    </div>
  );
}

/* ─── Root LandingPage ────────────────────────────────────────── */
function LandingPage() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isSignedIn) navigate("/dashboard");
  }, [isSignedIn]);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <HowItWorks />
      <Features />
      {/* <WhyPlanzo /> */}
      <FAQ />
      <Footer />
    </div>
  );
}

export default LandingPage;
