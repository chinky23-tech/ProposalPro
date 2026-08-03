import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";

import Hero from "../../components/landing/Hero";
import Features from "../../components/landing/Features";
import AIGeneration from "../../components/landing/AIGeneration";
import Analytics from "../../components/landing/Analytics";
import ProposalBuilder from "../../components/landing/ProposalBuilder";
import DashboardScreenshots from "../../components/landing/DashboardScreenshots";
import Pricing from "../../components/landing/Pricing";
import FAQ from "../../components/landing/FAQ";
import Footer from "../../components/landing/Footer";

export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "AI Engine", href: "#ai" },
    { name: "Builder", href: "#builder" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Sticky Navbar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-slate-950/80 backdrop-blur-md border-b border-white/10 py-3 shadow-2xl shadow-emerald-900/10"
            : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-1.5 bg-emerald-500/20 backdrop-blur-md rounded-lg border border-emerald-400/20 group-hover:bg-emerald-500/30 transition-colors">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white group-hover:text-emerald-100 transition-colors">
                ProposalPro
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <div className="flex gap-6">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    className="text-sm font-medium text-slate-300 hover:text-emerald-400 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-white hover:text-emerald-300 transition-colors px-4 py-2"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="text-sm font-semibold bg-white text-slate-950 hover:bg-emerald-50 px-5 py-2 rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-2 group"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-white focus:outline-none"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-slate-900 border-b border-white/10 shadow-2xl py-4 px-4 flex flex-col gap-4">
            {navLinks.map((link) => (
               <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-medium text-slate-300 hover:text-emerald-400 transition-colors block py-2"
              >
                {link.name}
              </a>
            ))}
            <div className="border-t border-slate-800 pt-4 flex flex-col gap-3">
              <Link
                to="/login"
                className="text-center w-full py-2.5 rounded-lg text-slate-200 font-semibold border border-slate-700 hover:bg-slate-800 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-center w-full py-2.5 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-400 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>
        <Hero />
        <Features />
        <AIGeneration />
        <Analytics />
        <ProposalBuilder />
        <DashboardScreenshots />
        <Pricing />
        <FAQ />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
