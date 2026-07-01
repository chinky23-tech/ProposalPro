import KpiCard from "../../dashboard/KpiCard";
import { useDashboard } from "../../../hooks/useDashboard";

export default function Overview() {
  const {
    loading,
    error,
    analytics,
    proposals,
    clients,
  } = useDashboard();

  if (loading) {
    return (
      <div className="text-white">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KpiCard
          title="Total Proposals"
          value={
            analytics?.total_proposals || 0
          }
        />

        <KpiCard
          title="Pipeline Value"
          value={`₹${analytics?.total_value || 0}`}
        />

        <KpiCard
          title="Average Score"
          value={
            analytics?.average_score || 0
          }
        />

        <KpiCard
          title="Win Rate"
          value={`${analytics?.win_rate || 0}%`}
        />
      </div>

      {/* STATUS CARDS */}

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        <KpiCard
          title="Draft"
          value={
            analytics?.draft_count || 0
          }
        />

        <KpiCard
          title="Review"
          value={
            analytics?.review_count || 0
          }
        />

        <KpiCard
          title="Sent"
          value={
            analytics?.sent_count || 0
          }
        />

        <KpiCard
          title="Viewed"
          value={
            analytics?.viewed_count || 0
          }
        />

        <KpiCard
          title="Accepted"
          value={
            analytics?.accepted_count || 0
          }
        />
       
       <KpiCard
          title="Rejected"
          value={
            analytics?.rejected_count || 0
          }
        />
        <KpiCard
          title="Won"
          value={
            analytics?.won_count || 0
          }
        />
      </div>

      {/* RECENT PROPOSALS */}

      <div className="rounded-2xl border border-emerald-900/20 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Recent Proposals
        </h2>

        <div className="space-y-3">
          {proposals
            .slice(0, 5)
            .map((proposal) => (
              <div
                key={proposal.id}
                className="flex justify-between border-b border-slate-800 pb-2"
              >
                <span className="text-white">
                  {proposal.title}
                </span>

                <span className="text-emerald-400">
                  {proposal.status}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* RECENT CLIENTS */}

      <div className="rounded-2xl border border-emerald-900/20 bg-slate-900 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Recent Clients
        </h2>

        <div className="space-y-3">
          {clients
            .slice(0, 5)
            .map((client) => (
              <div
                key={client.id}
                className="flex justify-between border-b border-slate-800 pb-2"
              >
                <span className="text-white">
                  {client.name}
                </span>

                <span className="text-slate-400">
                  {client.email}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}