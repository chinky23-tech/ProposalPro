import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Bell, 
  User, 
  LogOut, 
  ChevronDown, 
  CheckCheck, 
  Eye, 
  CheckCircle2, 
  Trophy, 
  Clock 
} from "lucide-react";
import { clearAuthSession, getStoredAuthSession } from "../../api/auth";
import { useNotifications } from "../../hooks/useNotifications"; 

export default function Header() {
  const navigate = useNavigate();

  // State initialized from stored session
  const [user, setUser] = useState(() => getStoredAuthSession()?.user || null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Hook for real-time notifications
  const { notifications, unreadCount, loading, markAllAsRead } = useNotifications();

  // Sync user state when 'user-updated' event fires from Settings
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

  // Dropdown click-outside references
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

  const handleNavigateToProfile = () => {
    setShowProfileMenu(false);
    navigate("/dashboard/settings");
  };

  // Icon mapper based on notification event type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "proposal_viewed":
        return <Eye className="w-4 h-4 text-blue-400" />;
      case "proposal_accepted":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case "proposal_won":
        return <Trophy className="w-4 h-4 text-amber-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <header className="flex items-center justify-end px-8 py-4 bg-[#0a0f1d] text-white border-b border-slate-800">
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
            
            {/* Unread Badge Counter */}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-4 h-4 px-1 bg-emerald-500 text-slate-950 text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* NOTIFICATIONS DROPDOWN */}
          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-200">
                  Notifications
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium transition-colors"
                  >
                    <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              {/* LIST BODY */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/50">
                {loading && notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-500">
                    Loading updates...
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 flex items-start gap-3 transition-colors ${
                        !item.isRead ? "bg-slate-800/40" : "hover:bg-slate-800/20"
                      }`}
                    >
                      <div className="mt-0.5 p-2 bg-slate-800/80 rounded-lg shrink-0">
                        {getNotificationIcon(item.type)}
                      </div>
                      <div className="flex-1 space-y-1 text-left">
                        <p className="text-xs font-semibold text-slate-200">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-400 leading-snug">
                          {item.message}
                        </p>
                        {item.createdAt && (
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 pt-1">
                            <Clock className="w-3 h-3" />
                            {new Date(item.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
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