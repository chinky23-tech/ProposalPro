import { useMemo, useState } from "react";

import { useProposals } from "../../../hooks/useProposals";

import ProposalToolbar from "../../../components/proposals/ProposalToolbar";

export default function Proposals() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [selectedProposal, setSelectedProposal] =
    useState(null);

  const {
    proposals,
    loading,
    error,
  } = useProposals();

  const filteredProposals = useMemo(() => {
    return proposals.filter((proposal) => {
      const matchesSearch =
        proposal.title
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        proposal.client
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        status === "All" ||
        proposal.status === status;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [proposals, search, status]);

  const handleCreate = () => {
    setSelectedProposal(null);
    setShowCreateModal(true);
  };

  const handleEdit = (proposal) => {
    setSelectedProposal(proposal);
    setShowCreateModal(true);
  };

  const handleDelete = (proposal) => {
    console.log(
      "Delete Proposal:",
      proposal.id
    );

    // connect delete api later
  };

  const handleMarkWon = (proposal) => {
    console.log(
      "Mark Won:",
      proposal.id
    );

    // connect api later
  };

  const handleMarkLost = (proposal) => {
    console.log(
      "Mark Lost:",
      proposal.id
    );

    // connect api later
  };

  if (loading) {
    return (
      <div className="text-white">
        Loading proposals...
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
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold text-white">
          Proposals
        </h1>

        <p className="text-slate-400 mt-1">
          Manage your proposals and
          deal pipeline.
        </p>
      </div>

      {/* Toolbar */}

      <ProposalToolbar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        onCreate={handleCreate}
      />

      {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-emerald-900/20 bg-slate-900">
        <table className="w-full">
          <thead className="bg-slate-950">
            <tr>
              <th className="p-4 text-left text-slate-400">
                Client
              </th>

              <th className="p-4 text-left text-slate-400">
                Title
              </th>

              <th className="p-4 text-left text-slate-400">
                Value
              </th>

              <th className="p-4 text-left text-slate-400">
                Score
              </th>

              <th className="p-4 text-left text-slate-400">
                Status
              </th>

              <th className="p-4 text-left text-slate-400">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredProposals.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="p-10 text-center text-slate-500"
                >
                  No proposals found
                </td>
              </tr>
            ) : (
              filteredProposals.map(
                (proposal) => (
                  <tr
                    key={proposal.id}
                    className="border-t border-slate-800"
                  >
                    <td className="p-4 text-white">
                      {proposal.client}
                    </td>

                    <td className="p-4 text-white">
                      {proposal.title}
                    </td>

                    <td className="p-4 text-white">
                      ₹
                      {Number(
                        proposal.value
                      ).toLocaleString()}
                    </td>

                    <td className="p-4 text-emerald-400 font-semibold">
                      {proposal.score}
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                        {proposal.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() =>
                            handleEdit(
                              proposal
                            )
                          }
                          className="rounded-lg bg-blue-500/10 px-3 py-1 text-xs text-blue-400 hover:bg-blue-500/20"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            handleDelete(
                              proposal
                            )
                          }
                          className="rounded-lg bg-red-500/10 px-3 py-1 text-xs text-red-400 hover:bg-red-500/20"
                        >
                          Delete
                        </button>

                        <button
                          onClick={() =>
                            handleMarkWon(
                              proposal
                            )
                          }
                          className="rounded-lg bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400 hover:bg-emerald-500/20"
                        >
                          Won
                        </button>

                        <button
                          onClick={() =>
                            handleMarkLost(
                              proposal
                            )
                          }
                          className="rounded-lg bg-orange-500/10 px-3 py-1 text-xs text-orange-400 hover:bg-orange-500/20"
                        >
                          Lost
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Future Modal */}

      {showCreateModal && (
        <div className="rounded-xl border border-emerald-900/20 bg-slate-900 p-6 text-white">
          {selectedProposal
            ? `Editing: ${selectedProposal.title}`
            : "Create Proposal Modal"}

          <button
            onClick={() =>
              setShowCreateModal(false)
            }
            className="ml-4 rounded-lg bg-red-500 px-3 py-1 text-sm"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}