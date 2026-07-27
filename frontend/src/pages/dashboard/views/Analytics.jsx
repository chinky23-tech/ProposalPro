/*import { useEffect, useMemo, useState } from "react";
import analyticsApi from "../../../api/analytics";
import EmptyState from "../../../components/dashboard/EmptyState";
import ErrorBar from "../../../components/dashboard/ErrorBar";
import LoadingState from "../../../components/dashboard/LoadingState";
import StatsGrid from "../../../components/dashboard/StatsGrid";
import { formatCurrency } from "../../../utils/formatters";

const Analytics = ({ token, refreshKey }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");

  useEffect(() => {
    let isCurrent = true;

    const loadAnalytics = async () => {
      try {
        const data = await analyticsApi.getAnalytics(token);

        if (!isCurrent) {
          return;
        }

        setAnalytics(data);
        setError("");
      } catch (err) {
        if (isCurrent) {
          setError(err.message || "Failed to load analytics.");
        }
      } finally {
        if (isCurrent) {
          setLoading(false);
        }
      }
    };

    if (token) {
      loadAnalytics();
    }

    return () => {
      isCurrent = false;
    };
  }, [token, refreshKey]);

  const analyticsStats = useMemo(() => {
    if (!analytics) {
      return [];
    }

    return [
      {
        label: "Total value",
        value: formatCurrency(analytics.total_value),
        detail: "All proposals",
      },
      {
        label: "Average score",
        value: `${analytics.average_score}%`,
        detail: "Win readiness",
      },
      {
        label: "Sent rate",
        value: `${analytics.win_rate}%`,
        detail: "Sent proposals",
      },
    ];
  }, [analytics]);

  const statusBreakdown = analytics?.status_breakdown || [];

  return (
    <section className="single-view">
      <ErrorBar message={error} onDismiss={() => setError("")} />
      {loading ? (
        <LoadingState message="Fetching analytics..." />
      ) : !analytics ? (
        <EmptyState>Analytics will appear after your proposals load.</EmptyState>
      ) : (
        <>
          <StatsGrid stats={analyticsStats} label="Analytics metrics" />

          <article className="proposal-table">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Status breakdown</p>
                <h2>Proposal movement</h2>
              </div>
            </div>
            {statusBreakdown.length === 0 ? (
              <EmptyState>No proposal status data yet.</EmptyState>
            ) : (
              <div className="analytics-list">
                {statusBreakdown.map((item) => (
                  <div key={item.status}>
                    <span>{item.status}</span>
                    <strong>{item.count}</strong>
                  </div>
                ))}
              </div>
            )}
          </article>
        </>
      )}
    </section>
  );
};

export default Analytics;*/

import React, { useState, useEffect } from "react";
import { 
  BarChart3, TrendingUp, Users, FileText, DollarSign, 
  ArrowUpRight, RefreshCw, AlertCircle, CheckCircle2, X 
} from "lucide-react";
import { useAnalytics } from "/src/hooks/useAnalytics.js";

export default function Analytics() {
  const { data, loading, error, refetch } = useAnalytics();

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error]);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Safe Extraction with Fallbacks
  const rawActivity = data?.recentActivity || data?.activities || [];
  const recentActivityList = Array.isArray(rawActivity) ? rawActivity : [];

  const metrics = {
    totalRevenue: data?.totalRevenue ?? data?.revenue ?? 0,
    totalClients: data?.totalClients ?? data?.clientsCount ?? 0,
    activeProposals: data?.activeProposals ?? data?.proposalsCount ?? 0,
    conversionRate: data?.conversionRate ?? 0,
    revenueGrowth: data?.revenueGrowth ?? 0,
    proposalsGrowth: data?.proposalsGrowth ?? 0,
    recentActivity: recentActivityList
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-8">
      
      {/* Toast Notification Popup */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300">
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs font-medium text-slate-200 pr-2">
            {toast.message}
          </span>
          <button
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Analytics Summary</h1>
          </div>
          <p className="text-xs text-slate-400 pl-13">
            Real-time performance overview, proposal conversions, and business growth.
          </p>
        </div>

        <button
          onClick={refetch}
          disabled={loading}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800/80 text-slate-300 text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Revenue</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {loading ? "..." : `$${Number(metrics.totalRevenue).toLocaleString()}`}
            </h3>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{metrics.revenueGrowth}% from last month</span>
            </div>
          </div>
        </div>

        {/* Active Proposals */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Proposals</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {loading ? "..." : metrics.activeProposals}
            </h3>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{metrics.proposalsGrowth}% increase</span>
            </div>
          </div>
        </div>

        {/* Total Clients */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Clients</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {loading ? "..." : metrics.totalClients}
            </h3>
            <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
              <span>Updated recently</span>
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Conversion Rate</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-white tracking-tight">
              {loading ? "..." : `${metrics.conversionRate}%`}
            </h3>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-400">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Win rate</span>
            </div>
          </div>
        </div>

      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Pipeline Status */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
          <div>
            <h2 className="font-bold text-white text-base">Proposal Status Distribution</h2>
            <p className="text-xs text-slate-400">Breakdown of proposals across key pipeline stages.</p>
          </div>

          <div className="space-y-4 pt-2">
            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-300">Accepted & Signed</span>
                <span className="text-emerald-400 font-bold">68%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-emerald-500 h-2 rounded-full w-[68%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-300">Under Review</span>
                <span className="text-blue-400 font-bold">22%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full w-[22%]" />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium mb-1.5">
                <span className="text-slate-300">Draft / Pending Send</span>
                <span className="text-amber-400 font-bold">10%</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full w-[10%]" />
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5">
          <h2 className="font-bold text-white text-base">Recent Activity</h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-slate-800/50 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : metrics.recentActivity.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">
              No recent activity found.
            </div>
          ) : (
            <div className="space-y-4">
              {metrics.recentActivity.map((activity, idx) => (
                <div key={activity.id || idx} className="flex items-start gap-3 border-b border-slate-800/50 pb-3 last:border-0 last:pb-0">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-xs font-medium text-slate-200">
                      {activity.title || activity.description || "System update"}
                    </p>
                    <span className="text-[10px] text-slate-500">
                      {activity.created_at ? new Date(activity.created_at).toLocaleDateString() : "Just now"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
}