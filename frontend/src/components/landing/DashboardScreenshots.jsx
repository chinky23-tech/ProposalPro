import React from "react";
import { ArrowRight, Sparkles, LayoutDashboard, FileText, Users, BarChart3, Layers, Settings, Bell, ChevronDown, TrendingUp, Eye, CheckCircle2, Clock, Package, FolderOpen, CreditCard } from "lucide-react";
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

        <div className="relative mt-16 mx-auto max-w-6xl">
          {/* Ambient Glow */}
          <div className="absolute inset-0 bg-linear-to-t from-emerald-500/20 via-teal-500/10 to-transparent blur-3xl rounded-full transform translate-y-1/3 scale-125 pointer-events-none" />
          
          <div className="relative rounded-2xl border border-slate-700/50 bg-slate-950 shadow-[0_0_80px_rgba(16,185,129,0.08)] overflow-hidden">
            
            {/* ═══════════ SIDEBAR ═══════════ */}
            <div className="flex">
              <div className="hidden md:flex w-56 bg-linear-to-b from-emerald-950 via-slate-950 to-slate-950 border-r border-emerald-900/20 flex-col shrink-0">
                {/* Logo */}
                <div className="p-5 flex items-center gap-2">
                  <div className="p-1.5 bg-emerald-500/10 rounded-lg border border-emerald-400/20">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <span className="font-black text-sm tracking-wider text-white uppercase">ProposalPro</span>
                </div>

                {/* Nav Label */}
                <div className="px-5 pt-2 pb-2 text-[9px] uppercase tracking-[0.2em] text-emerald-400/40 font-medium">Workspace</div>
                
                {/* Nav Items */}
                <nav className="px-3 space-y-0.5">
                  {[
                    { icon: LayoutDashboard, label: "Dashboard", active: true },
                    { icon: Sparkles, label: "Proposal Studio" },
                    { icon: FileText, label: "Proposals" },
                    { icon: Layers, label: "Templates" },
                    { icon: Package, label: "Packages" },
                    { icon: FolderOpen, label: "Documents" },
                    { icon: Users, label: "Clients" },
                    { icon: BarChart3, label: "Analytics" },
                    { icon: CreditCard, label: "Billing" },
                    { icon: Settings, label: "Settings" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.label}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold ${
                          item.active
                            ? "bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30"
                            : "text-emerald-100/50 hover:text-white"
                        }`}
                      >
                        <Icon className={`w-3.5 h-3.5 ${item.active ? "text-white" : "text-emerald-400/60"}`} />
                        {item.label}
                      </div>
                    );
                  })}
                </nav>
              </div>

              {/* ═══════════ MAIN CONTENT ═══════════ */}
              <div className="flex-1 flex flex-col min-w-0">
                
                {/* ── HEADER ── */}
                <div className="h-14 border-b border-slate-800 bg-slate-950 flex items-center justify-between px-6 shrink-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-sm font-bold text-white">Dashboard</h3>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-semibold border border-emerald-500/20">Pro Plan</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Bell className="w-4 h-4 text-slate-400" />
                      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-slate-950" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-[10px]">A</div>
                      <span className="text-xs text-slate-300 font-medium hidden lg:block">Alex Morgan</span>
                      <ChevronDown className="w-3 h-3 text-slate-500" />
                    </div>
                  </div>
                </div>

                {/* ── DASHBOARD BODY ── */}
                <div className="p-6 bg-slate-950 space-y-5 overflow-hidden">
                  
                  {/* KPI Row */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[
                      { title: "Total Proposals", value: "24", trend: "+12%", icon: FileText },
                      { title: "Pipeline Value", value: "₹4,85,000", trend: "+8%", icon: TrendingUp },
                      { title: "Average Score", value: "78", trend: "+5%", icon: BarChart3 },
                      { title: "Win Rate", value: "67%", trend: "+3%", icon: CheckCircle2 },
                    ].map((kpi) => {
                      const Icon = kpi.icon;
                      return (
                        <div key={kpi.title} className="bg-slate-900 border border-emerald-900/20 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{kpi.title}</span>
                            <Icon className="w-3.5 h-3.5 text-emerald-500/60" />
                          </div>
                          <div className="flex items-end gap-2">
                            <span className="text-xl font-black text-white leading-none">{kpi.value}</span>
                            <span className="text-[10px] font-bold text-emerald-400 mb-0.5">{kpi.trend}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Status Pills */}
                  <div className="grid grid-cols-3 lg:grid-cols-7 gap-2">
                    {[
                      { label: "Draft", count: 5, color: "text-slate-400" },
                      { label: "Review", count: 3, color: "text-amber-400" },
                      { label: "Sent", count: 8, color: "text-blue-400" },
                      { label: "Viewed", count: 4, color: "text-purple-400" },
                      { label: "Accepted", count: 2, color: "text-emerald-400" },
                      { label: "Rejected", count: 1, color: "text-rose-400" },
                      { label: "Won", count: 1, color: "text-emerald-300" },
                    ].map((s) => (
                      <div key={s.label} className="bg-slate-900 border border-emerald-900/20 rounded-lg px-3 py-2.5 text-center">
                        <div className={`text-base font-bold ${s.color}`}>{s.count}</div>
                        <div className="text-[9px] text-slate-500 font-semibold uppercase tracking-wider">{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Recent Proposals Table */}
                  <div className="rounded-xl border border-emerald-900/20 bg-slate-900 p-4">
                    <h4 className="text-xs font-bold text-white mb-3">Recent Proposals</h4>
                    <div className="space-y-2">
                      {[
                        { title: "Enterprise Redesign — Acme Corp", status: "Sent", statusColor: "text-blue-400 bg-blue-500/10", value: "₹1,20,000" },
                        { title: "Mobile App MVP — TechVista", status: "Accepted", statusColor: "text-emerald-400 bg-emerald-500/10", value: "₹2,50,000" },
                        { title: "Brand Identity — Starter Inc", status: "Draft", statusColor: "text-slate-400 bg-slate-500/10", value: "₹45,000" },
                        { title: "SaaS Dashboard — CloudSync", status: "Viewed", statusColor: "text-purple-400 bg-purple-500/10", value: "₹80,000" },
                      ].map((p, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-b-0">
                          <span className="text-xs text-white font-medium truncate max-w-[50%]">{p.title}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">{p.value}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.statusColor}`}>{p.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Clients Row */}
                  <div className="rounded-xl border border-emerald-900/20 bg-slate-900 p-4">
                    <h4 className="text-xs font-bold text-white mb-3">Recent Clients</h4>
                    <div className="space-y-2">
                      {[
                        { name: "Acme Corporation", email: "contact@acme.io" },
                        { name: "TechVista Labs", email: "hello@techvista.com" },
                        { name: "CloudSync Inc", email: "team@cloudsync.dev" },
                      ].map((c, i) => (
                        <div key={i} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-b-0">
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[9px]">
                              {c.name.charAt(0)}
                            </div>
                            <span className="text-xs text-white font-medium">{c.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-500">{c.email}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
