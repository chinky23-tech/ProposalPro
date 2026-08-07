import { useState, useEffect, useCallback } from "react";
import {
  fetchSettingsAPI,
  updateProfileAPI,
  updateWorkspaceAPI,
  updateNotificationsAPI,
  updatePasswordAPI,
} from "../api/settings";
import { saveAuthSession, getStoredAuthSession } from "../api/auth";

export function useSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Feedback Toast State
  const [feedback, setFeedback] = useState({ type: "", message: "" });

  // Settings State
  const [profile, setProfile] = useState({ name: "", email: "" });
  const [workspace, setWorkspace] = useState({
    companyName: "",
    brandColor: "#10b981",
    defaultCurrency: "USD",
  });
  const [notifications, setNotifications] = useState({
    emailProposalOpened: true,
    emailProposalAccepted: true,
    emailPaymentReceived: true,
  });
  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const showFeedback = useCallback((type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: "", message: "" }), 4000);
  }, []);

  // Fetch Settings Data
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetchSettingsAPI();
      if (res && (res.data || res.success)) {
        const data = res.data || res;
        setProfile({ name: data.name || "", email: data.email || "" });
        setWorkspace({
          companyName: data.company_name || "",
          brandColor: data.brand_color || "#10b981",
          defaultCurrency: data.default_currency || "USD",
        });
        setNotifications({
          emailProposalOpened: data.email_proposal_opened ?? true,
          emailProposalAccepted: data.email_proposal_accepted ?? true,
          emailPaymentReceived: data.email_payment_received ?? true,
        });
      }
    } catch (err) {
      showFeedback("error", "Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }, [showFeedback]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Submit Profile Form
  const handleProfileSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfileAPI(profile);

      // Update localStorage session & notify Header
      const currentSession = getStoredAuthSession() || {};
      const updatedSession = {
        ...currentSession,
        user: {
          ...(currentSession.user || {}),
          name: profile.name,
          email: profile.email,
        },
      };
      saveAuthSession(updatedSession);
      window.dispatchEvent(new Event("user-updated"));

      showFeedback("success", res?.message || "Profile details saved!");
    } catch (err) {
      showFeedback(
        "error",
        err.response?.data?.message || err.message || "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // Submit Workspace Form
  const handleWorkspaceSubmit = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await updateWorkspaceAPI(workspace);
      showFeedback("success", res?.message || "Workspace branding updated!");
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Failed to update workspace.");
    } finally {
      setSaving(false);
    }
  };

  // Toggle Notification Checkboxes & Submit
  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleNotificationSubmit = async () => {
    setSaving(true);
    try {
      const res = await updateNotificationsAPI(notifications);
      showFeedback("success", res?.message || "Preferences saved!");
    } catch (err) {
      showFeedback("error", "Failed to save notification preferences.");
    } finally {
      setSaving(false);
    }
  };

  // Handle Password Submit & Confirmation
  const handlePasswordSubmit = (e) => {
    if (e) e.preventDefault();
    if (security.newPassword !== security.confirmPassword) {
      showFeedback("error", "New passwords do not match.");
      return;
    }
    setIsModalOpen(true);
  };

  const confirmPasswordChange = async () => {
    setIsModalOpen(false);
    setSaving(true);
    try {
      const res = await updatePasswordAPI(security);
      showFeedback("success", res?.message || "Password updated successfully!");
      setSecurity({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showFeedback("error", err.response?.data?.message || "Failed to update password.");
    } finally {
      setSaving(false);
    }
  };

  return {
    // State
    activeTab,
    setActiveTab,
    loading,
    saving,
    feedback,
    isModalOpen,
    setIsModalOpen,

    // Form Data States & Setters
    profile,
    setProfile,
    workspace,
    setWorkspace,
    notifications,
    toggleNotification,
    security,
    setSecurity,

    // Handlers
    handleProfileSubmit,
    handleWorkspaceSubmit,
    handleNotificationSubmit,
    handlePasswordSubmit,
    confirmPasswordChange,
  };
}