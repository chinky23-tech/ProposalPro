import React from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardScreenshots() {
  return (
    <section className="py-24 bg-slate-950 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
            A workspace you'll actually love using
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Manage all your proposals, templates, and client interactions from one beautiful, lightning-fast dashboard.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors group"
          >
            Start your free trial today
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="relative mt-16 mx-auto max-w-5xl perspective-1000">
          <div className="absolute inset-0 bg-linear-to-t from-emerald-500/30 to-transparent blur-3xl rounded-full transform translate-y-1/2 scale-150" />
          
          <div className="relative rounded-2xl border border-slate-700/50 bg-slate-900 shadow-2xl overflow-hidden transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out">
            {/* Fake Dashboard Header */}
            <div className="h-14 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6">
              <div className="flex gap-4">
                <div className="w-24 h-4 rounded bg-slate-800" />
                <div className="w-16 h-4 rounded bg-slate-800/50" />
                <div className="w-20 h-4 rounded bg-slate-800/50" />
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30" />
            </div>
            
            {/* Fake Dashboard Body */}
            <div className="p-8 grid grid-cols-12 gap-6 bg-slate-900">
              <div className="col-span-3 space-y-4">
                <div className="h-8 rounded bg-slate-800/80 w-full" />
                <div className="h-8 rounded bg-slate-800/40 w-5/6" />
                <div className="h-8 rounded bg-slate-800/40 w-4/6" />
                <div className="h-8 rounded bg-slate-800/40 w-5/6" />
              </div>
              <div className="col-span-9 space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-24 rounded-xl bg-slate-800/50 border border-slate-700/50" />
                  <div className="h-24 rounded-xl bg-slate-800/50 border border-slate-700/50" />
                  <div className="h-24 rounded-xl bg-slate-800/50 border border-slate-700/50" />
                </div>
                <div className="h-64 rounded-xl bg-slate-800/30 border border-slate-700/50" />
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
