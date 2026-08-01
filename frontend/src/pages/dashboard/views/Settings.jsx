import React from "react";
import { useSettings } from "/src/hooks/useSettings";

// Icons
import {
  User,
  Briefcase,
  Bell,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";

// UI Components
import { Input } from "/src/components/ui/Input";
import { Button } from "/src/components/ui/Button";
import { Card } from "/src/components/ui/Card";
import { Select } from "/src/components/ui/Select";
import { Modal } from "/src/components/ui/Modal";

export default function SettingsPage() {
  const {
    activeTab,
    setActiveTab,
    loading,
    saving,
    feedback,
    isModalOpen,
    setIsModalOpen,
    profile,
    setProfile,
    workspace,
    setWorkspace,
    notifications,
    toggleNotification,
    security,
    setSecurity,
    handleProfileSubmit,
    handleWorkspaceSubmit,
    handleNotificationSubmit,
    handlePasswordSubmit,
    confirmPasswordChange,
  } = useSettings();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-slate-400 font-medium animate-pulse">
        Loading settings...
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User, desc: "Personal info & account" },
    { id: "workspace", label: "Workspace", icon: Briefcase, desc: "Branding & defaults" },
    { id: "notifications", label: "Notifications", icon: Bell, desc: "Email alerts & updates" },
    { id: "security", label: "Security", icon: ShieldCheck, desc: "Password & authentication" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Account Settings</h1>
        <p className="text-sm text-slate-400 mt-1">Manage your workspace options, security, and alert preferences.</p>
      </div>

      {feedback.message && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium transition-all ${
            feedback.type === "success"
              ? "bg-slate-900 text-emerald-400 border-slate-800"
              : "bg-red-950 text-red-300 border-red-900"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Navigation */}
        <div className="md:col-span-4 lg:col-span-3 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-start space-x-3.5 p-3 rounded-xl text-left transition-all ${
                  isActive
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold"
                    : "text-slate-400 hover:bg-slate-800/40 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 mt-0.5 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                <div>
                  <div className="text-sm">{tab.label}</div>
                  <div className="text-xs text-slate-500 font-normal hidden lg:block">{tab.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Dynamic Form Panel */}
        <div className="md:col-span-8 lg:col-span-9">
          <Card className="p-6 md:p-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm">
            {/* 1. Profile */}
            {activeTab === "profile" && (
              <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-lg">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-lg font-semibold text-white">Personal Profile</h2>
                  <p className="text-xs text-slate-400">Your basic information displayed across proposals.</p>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-600 text-white font-bold text-xl flex items-center justify-center shadow-sm">
                    {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                      Account Owner
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Full Name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                  />
                  <Input 
                    label="Email Address" 
                    value={profile.email} 
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    placeholder="name@example.com"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" isLoading={saving}>
                    Save Changes
                  </Button>
                </div>
              </form>
            )}

            {/* 2. Workspace */}
            {activeTab === "workspace" && (
              <form onSubmit={handleWorkspaceSubmit} className="space-y-6 max-w-lg">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-lg font-semibold text-white">Workspace & Branding</h2>
                  <p className="text-xs text-slate-400">Customize default colors and company details for client proposals.</p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Company Name"
                    value={workspace.companyName}
                    onChange={(e) => setWorkspace({ ...workspace, companyName: e.target.value })}
                    placeholder="e.g. Acme Studio"
                    required
                  />

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Brand Accent Color</label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="color"
                        value={workspace.brandColor}
                        onChange={(e) => setWorkspace({ ...workspace, brandColor: e.target.value })}
                        className="w-12 h-12 rounded-xl border-2 border-slate-700 bg-transparent cursor-pointer p-0.5"
                      />
                      <span className="text-sm font-mono font-medium text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
                        {workspace.brandColor}
                      </span>
                    </div>
                  </div>

                  <Select
                    label="Default Currency"
                    value={workspace.defaultCurrency}
                    options={[
                      { label: "USD ($)", value: "USD" },
                      { label: "EUR (€)", value: "EUR" },
                      { label: "GBP (£)", value: "GBP" },
                      { label: "INR (₹)", value: "INR" },
                    ]}
                    onChange={(e) => setWorkspace({ ...workspace, defaultCurrency: e.target.value })}
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" isLoading={saving}>
                    Save Workspace
                  </Button>
                </div>
              </form>
            )}

            {/* 3. Notifications */}
            {activeTab === "notifications" && (
              <div className="space-y-6 max-w-lg">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-lg font-semibold text-white">Email Preferences</h2>
                  <p className="text-xs text-slate-800">Choose when you want to get notified by email.</p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      key: "emailProposalOpened",
                      label: "Proposal Views",
                      desc: "Receive an email as soon as a client opens your proposal.",
                    },
                    {
                      key: "emailProposalAccepted",
                      label: "Proposal Acceptances",
                      desc: "Get notified immediately when a proposal is signed or accepted.",
                    },
                    {
                      key: "emailPaymentReceived",
                      label: "Payment Receipts",
                      desc: "Receive instant alerts when an invoice payment is cleared.",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      onClick={() => toggleNotification(item.key)}
                      className="flex items-center justify-between p-4 rounded-xl border border-white  transition-all cursor-pointer bg-emerald-800/40"
                    >
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium text-slate-800">{item.label}</div>
                        <div className="text-xs text-slate-900">{item.desc}</div>
                      </div>

                      <div
                        className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out ${
                          notifications[item.key] ? "bg-emerald-700" : "bg-slate-700"
                        }`}
                      >
                        <div
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                            notifications[item.key] ? "translate-x-5" : "translate-x-0"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2">
                  <Button onClick={handleNotificationSubmit} isLoading={saving}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}

            {/* 4. Security */}
            {activeTab === "security" && (
              <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-lg">
                <div className="border-b border-slate-800 pb-4">
                  <h2 className="text-lg font-semibold text-white">Security & Authentication</h2>
                  <p className="text-xs text-slate-400">Update your account password regularly to maintain security.</p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    value={security.currentPassword}
                    onChange={(e) => setSecurity({ ...security, currentPassword: e.target.value })}
                    required
                  />
                  <Input
                    label="New Password"
                    type="password"
                    value={security.newPassword}
                    onChange={(e) => setSecurity({ ...security, newPassword: e.target.value })}
                    required
                  />
                  <Input
                    label="Confirm New Password"
                    type="password"
                    value={security.confirmPassword}
                    onChange={(e) => setSecurity({ ...security, confirmPassword: e.target.value })}
                    required
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" isLoading={saving}>
                    Update Password
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Security Update">
        <div className="space-y-4">
          <div className="flex items-center space-x-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-lg text-xs">
            <Lock className="w-5 h-5 shrink-0 text-emerald-400" />
            <span>Changing your password will require you to log in with your new password next time.</span>
          </div>
          <p className="text-sm text-slate-300">Are you sure you want to proceed with this change?</p>
          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmPasswordChange} isLoading={saving}>
              Confirm Change
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}