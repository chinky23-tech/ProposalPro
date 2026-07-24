import ProposalStatusBadge from "./ProposalStatusBadge";

export default function ProposalTable({
  proposals = [],
  onView,
  onEdit,
  onDelete,
  onWon,
  onLost,
  onReview,
  onViewed,
  onSent,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-emerald-900/20 bg-slate-900">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-950">
            <tr>
              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Client
              </th>

              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Proposal
              </th>

              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Value
              </th>

              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Score
              </th>

              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Status
              </th>

              <th className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {proposals.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="py-10 text-center text-slate-500"
                >
                  No proposals found
                </td>
              </tr>
            ) : (
              proposals.map((proposal) => {
                // Circular calculations per row element
                const scoreNum = Math.min(Math.max(Number(proposal.score || 0), 0), 100);
                const radius = 12; 
                const circumference = 2 * Math.PI * radius;
                const strokeOffset = circumference - (scoreNum / 100) * circumference;

                return (
                  <tr
                    key={proposal.id}
                    className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="p-4 text-white font-medium">
                      {proposal.client}
                    </td>

                    <td className="p-4">
                      <div>
                        {/* 🛠️ 2. Wrapped the title with an onClick navigation trigger */}
                        <p 
                          onClick={() => onView?.(proposal.id)}
                          className="font-medium text-white hover:text-emerald-400 cursor-pointer transition-colors inline-block"
                        >
                          {proposal.title}
                        </p>

                        <p className="text-xs text-slate-400">
                          ID #{proposal.id}
                        </p>
                      </div>
                    </td>

                    <td className="p-4 text-white font-medium">
                      ₹{Number(proposal.value).toLocaleString()}
                    </td>
  
                    {/* Score Column: Progress Ring with Side-by-Side Label */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-7 h-7 shrink-0">
                          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
                            <circle
                              cx="16"
                              cy="16"
                              r={radius}
                              className="stroke-slate-800"
                              strokeWidth="3.5"
                              fill="transparent"
                            />
                            <circle
                              cx="16"
                              cy="16"
                              r={radius}
                              className={`transition-all duration-500 ease-out ${
                                scoreNum >= 80 ? "stroke-emerald-400" : scoreNum >= 50 ? "stroke-amber-400" : "stroke-rose-500"
                              }`}
                              strokeWidth="3.5"
                              fill="transparent"
                              strokeDasharray={circumference}
                              strokeDashoffset={strokeOffset}
                              strokeLinecap="round"
                            />
                          </svg>
                        </div>
                        
                        <span className={`text-sm font-semibold tracking-wide ${
                          scoreNum >= 80 ? "text-emerald-400" : scoreNum >= 50 ? "text-amber-400" : "text-rose-400"
                        }`}>
                          {scoreNum}%
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <ProposalStatusBadge
                        status={proposal.status}
                      />
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => onView?.(proposal.id)}
                          className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20"
                        >
                          View
                        </button>

                        <button
                          onClick={() => onEdit(proposal)}
                          className="rounded-lg border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-sm font-medium text-blue-400 transition-all hover:bg-blue-500/20"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => onDelete(proposal)}
                          className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-sm font-medium text-red-400 transition-all hover:bg-red-500/20"
                        >
                          Delete
                        </button>

                        {proposal.status === "Draft" && (
                          <button
                            onClick={() => onReview?.(proposal)}
                            className="rounded-lg border border-violet-500/20 bg-violet-500/10 px-3 py-1.5 text-sm font-medium text-violet-400 transition-all hover:bg-violet-500/20"
                          >
                            Review
                          </button>
                        )}

                        {proposal.status === "Review" && (
                          <button
                            onClick={() => onViewed?.(proposal)}
                            className="rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-sm font-medium text-cyan-400 transition-all hover:bg-cyan-500/20"
                          >
                            Viewed
                          </button>
                        )}

                        {proposal.status === "Viewed" && (
                          <button
                            onClick={() => onSent?.(proposal)}
                            className="rounded-lg border border-sky-500/20 bg-sky-500/10 px-3 py-1.5 text-sm font-medium text-sky-400 transition-all hover:bg-sky-500/20"
                          >
                            Sent
                          </button>
                        )}

                        {proposal.status !== "Won" && (
                          <button
                            onClick={() => onWon(proposal)}
                            className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400 transition-all hover:bg-emerald-500/20"
                          >
                            Won
                          </button>
                        )}

                        {proposal.status !== "Lost" && (
                          <button
                            onClick={() => onLost(proposal)}
                            className="rounded-lg border border-orange-500/20 bg-orange-500/10 px-3 py-1.5 text-sm font-medium text-orange-400 transition-all hover:bg-orange-500/20"
                          >
                            Lost
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}