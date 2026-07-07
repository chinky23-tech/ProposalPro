import ProposalStatusBadge from "./ProposalStatusBadge";

export default function ProposalTable({
  proposals = [],
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
              proposals.map((proposal) => (
                <tr
                  key={proposal.id}
                  className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors"
                >
                  <td className="p-4 text-white">
                    {proposal.client}
                  </td>

                  <td className="p-4">
                    <div>
                      <p className="font-medium text-white">
                        {proposal.title}
                      </p>

                      <p className="text-xs text-slate-400">
                        ID #{proposal.id}
                      </p>
                    </div>
                  </td>

                  <td className="p-4 text-white">
                    ₹
                    {Number(
                      proposal.value
                    ).toLocaleString()}
                  </td>

                  <td className="p-4">
                    <span className="font-semibold text-emerald-400">
                      {proposal.score}
                    </span>
                  </td>

                  <td className="p-4">
                    <ProposalStatusBadge
                      status={proposal.status}
                    />
                  </td>

                  <td className="p-4">
                    <div className="flex flex-wrap gap-2">

                      <button
                        onClick={() =>
                          onEdit(proposal)
                        }
                        className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/20"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          onDelete(proposal)
                        }
                        className="rounded-lg bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20"
                      >
                        Delete
                      </button>

                      {proposal.status !==
                        "Won" && (
                        <button
                          onClick={() =>
                            onWon(
                              proposal
                            )
                          }
                          className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 hover:bg-emerald-500/20"
                        >
                          Won
                        </button>
                      )}

                      {proposal.status !==
                        "Lost" && (
                        <button
                          onClick={() =>
                            onLost(
                              proposal
                            )
                          }
                          className="rounded-lg bg-orange-500/10 px-3 py-1 text-xs font-medium text-orange-400 hover:bg-orange-500/20"
                        >
                          Lost
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}