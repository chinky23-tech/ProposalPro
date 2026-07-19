import { Award } from "lucide-react";
import ProposalStatusBadge from "./ProposalStatusBadge";

export default function ProposalTable({
  proposals = [],
  onView, // 🛠️ 1. Catch the new onView trigger prop here
  onEdit,
  onDelete,
  onWon,
  onLost,
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
                        {/* 🛠️ 3. Added a clean explicit Preview button right next to Edit */}
                        <button
                          onClick={() => onView?.(proposal.id)}
                          className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-all"
                        >
                          Preview
                        </button>

                        <button
                          onClick={() => onEdit(proposal)}
                          className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/20 transition-all"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => onDelete(proposal)}
                          className="rounded-lg bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-all"
                        >
                          Delete
                        </button>

                        {proposal.status !== "Won" && (
                          <button
                            onClick={() => onWon(proposal)}
                            className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20 transition-all"
                          >
                            Won
                          </button>
                        )}

                        {proposal.status !== "Lost" && (
                          <button
                            onClick={() => onLost(proposal)}
                            className="rounded-lg bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400 hover:bg-orange-500/20 transition-all"
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