/*import React, { useEffect, useState } from "react";
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
"/dashboard/proposal-studio":
"Proposal Studio",
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
<header className="sticky top-0 z-50 h-16 bg-slate-950/80 backdrop-blur-md border-b border-emerald-900/20 flex items-center justify-between px-6 shrink-0">
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
        <div className="absolute right-0 mt-2 w-56 rounded-xl border border-emerald-900/20 bg-slate-900 shadow-xl z-9999">
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
}*/


import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, LogOut, CheckCircle2, ChevronDown } from "lucide-react";
import { clearAuthSession, getStoredAuthSession } from "/src/api/auth"; 

export default function Header() {
  const navigate = useNavigate();

  // State initialized from stored session
  const [user, setUser] = useState(() => getStoredAuthSession()?.user || null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Sync state when 'user-updated' event fires from Settings
  useEffect(() => {
    const syncUser = () => {
      const session = getStoredAuthSession();
      if (session?.user) {
        setUser(session.user);
      }
    };

    window.addEventListener("user-updated", syncUser);
    return () => window.removeEventListener("user-updated", syncUser);
  }, []);

  // Dropdown click outside references
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    clearAuthSession();
    navigate("/login");
  };

  // Fixed Navigation Handler
  const handleNavigateToProfile = () => {
    setShowProfileMenu(false);
    navigate("/dashboard/settings");
  };

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-[#0a0f1d] text-white border-b border-slate-800">
      <h1 className="text-xl font-bold tracking-tight">Settings</h1>

      <div className="flex items-center space-x-4">
        
        {/* NOTIFICATIONS BELL */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-slate-800/60 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 py-3">
              <div className="px-4 pb-2 border-b border-slate-800 text-sm font-semibold text-slate-200">
                Notifications
              </div>
              <div className="p-4 text-center text-xs text-slate-400">
                No new notifications
              </div>
            </div>
          )}
        </div>

        {/* PROFILE DROPDOWN */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="text-left hidden sm:block">
              <div className="text-xs font-semibold text-slate-200">{user?.name || "User"}</div>
              <div className="text-[11px] text-slate-400">{user?.email || "user@example.com"}</div>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-3 w-56 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 py-2">
              <button
                type="button"
                onClick={handleNavigateToProfile}
                className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors text-left"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span>Profile</span>
              </button>

              <div className="my-1 border-t border-slate-800" />

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full flex items-center space-x-3 px-4 py-2.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left font-medium"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

