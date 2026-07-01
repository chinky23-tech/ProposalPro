import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import {
Bell,
ChevronDown,
LogOut,
User,
} from "lucide-react";



export default function Header() {
const location = useLocation();
const navigate = useNavigate();
const { user: authUser, logout ,loading } = useAuth();
const [open, setOpen] = useState(false);


const handleLogout = () => {
  setOpen(false);
  logout();

  navigate("/login", {
    replace: true,
  });
};

const pageTitleMap = {
"/dashboard": "Dashboard",
"/dashboard/ai-builder":
"AI Builder",
"/dashboard/proposals":
"Proposals",
"/dashboard/templates":
"Templates",
"/dashboard/packages":
"Packages",
"/dashboard/documents":
"Documents",
"/dashboard/clients":
"Clients",
"/dashboard/analytics":
"Analytics",
"/dashboard/team": "Team",
"/dashboard/billing":
"Billing",
"/dashboard/settings":
"Settings",
};

useEffect(() => {
  const closeMenu = () => setOpen(false);

  window.addEventListener("click", closeMenu);

  return () =>
    window.removeEventListener(
      "click",
      closeMenu
    );
}, []);
const pageTitle =
pageTitleMap[location.pathname] ||
"ProposalPro AI";

return ( 
<header className="sticky top-0 z-50 h-16 bg-slate-950/80 backdrop-blur-md border-b border-emerald-900/20 flex items-center justify-between px-6 flex-shrink-0">
<div> 
  <h1 className="text-xl font-bold text-white">
{pageTitle} </h1> </div>

  <div className="flex items-center gap-4">
    <button className="relative p-2 rounded-xl hover:bg-white/5">
      <Bell className="w-5 h-5 text-emerald-300" />
    </button>

    <div className="relative z-9999">
      <button
        onClick={(e) => {
  e.stopPropagation();
  setOpen(!open);
}}
        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5"
      >
       {loading ? (
  <div className="w-9 h-9 rounded-lg bg-emerald-800/40 animate-pulse" />
) : (
  <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
    {authUser?.name?.charAt(0)?.toUpperCase() || "U"}
  </div>
)}

        <div className="text-left hidden md:block">
          <p className="text-sm font-semibold text-white">
            {authUser?.name ||
              "Active User"}
          </p>
          <p className="text-xs text-emerald-300/60">
            {authUser?.email || ""}
          </p>
        </div>

        <ChevronDown className="w-4 h-4 text-emerald-300" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-emerald-900/20 bg-slate-900 shadow-xl z-[9999]">
          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/5">
            <User className="w-4 h-4" />
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  </div>
</header>


);
}
