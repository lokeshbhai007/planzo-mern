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
import Navbar from "../components/landing/Navbar";
import ContainerScroll from "../components/landing/ContainerScroll";
import HowItWorks from "../components/landing/HowItWorks";
import Footer from "../components/landing/Footer";
import FAQ from "../components/landing/FAQ";
import Features from "../components/landing/Features";



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
      <FAQ />
      <Footer />
    </div>
  );
}

export default LandingPage;
