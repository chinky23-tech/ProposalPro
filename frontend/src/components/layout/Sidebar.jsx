import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import {
  LayoutDashboard,
  Sparkles,
  FileText,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Layers,
  User,
  Package,
  FolderOpen,
  CreditCard,
  UsersRound,
} from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  




const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
  name: "Proposal Studio",
  path: "/dashboard/proposal-studio",
  icon: Sparkles,
  },
  {
    name: "Proposals",
    path: "/dashboard/proposals",
    icon: FileText,
  },
  {
    name: "Templates",
    path: "/dashboard/templates",
    icon: Layers,
  },
  {
    name: "Packages",
    path: "/dashboard/packages",
    icon: Package,
  },
  {
    name: "Documents",
    path: "/dashboard/documents",
    icon: FolderOpen,
  },
  {
    name: "Clients",
    path: "/dashboard/clients",
    icon: Users,
  },
  {
    name: "Analytics",
    path: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Team",
    path: "/dashboard/team",
    icon: UsersRound,
  },
  {
    name: "Billing",
    path: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    name: "Settings",
    path: "/dashboard/settings",
    icon: Settings,
  },
];
  return (
<div className="w-64 h-screen bg-linear-to-b from-emerald-950 via-slate-950 to-slate-950 border-r border-emerald-900/20 flex flex-col text-emerald-100/80 fixed left-0 top-0 z-30 font-sans">
      <div className="flex overflow-y-auto p-6">
        <div className="flex flex-col gap-5">
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-800/40">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-400/20">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="font-black text-lg tracking-wider text-white uppercase">ProposalPro</span>
        </div>

        {/* Navigation Routes */}
        <nav className="flex flex-col gap-1.5">
              {/* Workspace Section */}
  <div className="px-4 pt-5 pb-2 text-[10px] uppercase tracking-[0.2em] text-emerald-400/40">
    Workspace
  </div>

          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
  item.path === "/dashboard"
    ? location.pathname === "/dashboard"
    : location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30' 
                    : 'hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-emerald-400/70'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>


    </div>
    </div>
    </div>
  );
}