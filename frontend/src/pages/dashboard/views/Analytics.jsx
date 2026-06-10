import { useEffect, useMemo, useState } from "react";
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

export default Analytics;
