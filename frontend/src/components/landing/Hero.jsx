import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] animate-pulse pointer-events-none" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-teal-500/20 rounded-full blur-[100px] animate-pulse pointer-events-none" style={{ animationDuration: '12s', animationDelay: '1s' }} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-emerald-500/30 text-emerald-300 text-sm font-medium backdrop-blur-md hover:bg-slate-800/50 transition-colors cursor-default animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            <span>ProposalPro AI 2.0 is now live</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight text-white animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Win clients faster with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-300">
              AI precision.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            The intelligent proposal generation platform that helps businesses, freelancers, and agencies create professional, winning proposals in minutes instead of days.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2 group text-lg"
            >
              Start for free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="#features"
              className="w-full sm:w-auto px-8 py-4 bg-slate-900/70 text-white font-semibold rounded-full border border-emerald-400/30 hover:bg-slate-800/80 hover:border-emerald-400/50 transition-all text-lg flex items-center justify-center"
            >
              See how it works
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-slate-400 font-medium animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>14-day free trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Cancel anytime</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
