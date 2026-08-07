import { useState, useEffect, useCallback, useRef } from "react";
import { request, getStoredAuthSession } from "../api/auth";

export function notifyNotificationChanged() {
  window.dispatchEvent(new CustomEvent("notification-updated"));
}

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const isFetchingRef = useRef(false);
  const initialFetchDone = useRef(false);

  const fetchNotifications = useCallback(async (isBackground = false) => {
    const session = getStoredAuthSession();
    if (!session?.token) return;
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;

    try {
      if (!isBackground && !initialFetchDone.current) {
        setLoading(true);
      }

      const res = await request("/notifications", {
        method: "GET",
        token: session.token,
        showErrorToast: false,
      });

      if (res?.success && res?.data) {
        setNotifications(res.data.notifications || []);
        setUnreadCount(res.data.unreadCount || 0);
        initialFetchDone.current = true;
      }
    } catch {
      // Catch errors silently for background operations
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, []);

  useEffect(() => {
    // Initial fetch deferred microtask to avoid synchronous setState in effect
    Promise.resolve().then(() => fetchNotifications(false));

    const handleUpdate = () => {
      fetchNotifications(true);
    };

    const handleFocus = () => {
      fetchNotifications(true);
    };

    window.addEventListener("notification-updated", handleUpdate);
    window.addEventListener("focus", handleFocus);

    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 30000);

    return () => {
      window.removeEventListener("notification-updated", handleUpdate);
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  const markAllAsRead = async () => {
    const session = getStoredAuthSession();
    if (!session?.token) return;

    try {
      await request("/notifications/read-all", {
        method: "PUT",
        token: session.token,
      });
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Failed to mark all as read:", err.message);
    }
  };

  return { 
    notifications, 
    unreadCount, 
    loading, 
    markAllAsRead, 
    refresh: () => fetchNotifications(false) 
  };
}