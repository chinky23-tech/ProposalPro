import { useMemo, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProposals } from "../../../hooks/useProposals";
import ProposalToolbar from "../../../components/proposals/ProposalToolbar";
import ProposalTable from "../../../components/proposals/ProposalTable";
import ProposalModal from "../../../components/proposals/ProposalModal";

import proposalsApi from "../../../api/proposals";
import { getStoredAuthSession } from "../../../api/auth";
import { toast } from "react-toastify";

export default function Proposals() {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState(null);

  const { proposals, loading, error, refresh } = useProposals();

  const getToken = () => {
    const session = getStoredAuthSession();
    return session?.accessToken || session?.token;
  };

  // Handle template redirection logic
  useEffect(() => {
    if (location.state?.openEditModal && location.state?.proposalData) {
      setSelectedProposal(location.state.proposalData);
      setShowModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Filter proposals by search and status
  const filteredProposals = useMemo(() => {
    return proposals.filter((proposal) => {
      const matchesSearch =
        proposal.title?.toLowerCase().includes(search.toLowerCase()) ||
        proposal.client?.toLowerCase().includes(search.toLowerCase()) ||
        proposal.client_name?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        status === "All" ||
        proposal.status?.toLowerCase() === status.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [proposals, search, status]);

  // Modal Handlers
  const handleCreate = () => {
    setSelectedProposal(null);
    setShowModal(true);
  };

  const handleEdit = (proposal) => {
    setSelectedProposal(proposal);
    setShowModal(true);
  };

  // Modern Toast Delete Action
  const handleDelete = (proposal) => {
    toast(
      ({ closeToast }) => (
        <div className="space-y-3 p-1">
          <div className="space-y-1">
            <p className="text-xs font-bold text-white">Delete Proposal?</p>
            <p className="text-[11px] text-slate-400">
              This action cannot be undone. Are you sure you want to proceed?
            </p>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={closeToast}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors flex-1"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                closeToast();
                try {
                  await proposalsApi.deleteProposal(proposal.id, getToken());
                  toast.success("Proposal deleted successfully");
                  await refresh();
                } catch (err) {
                  toast.error(err.message || "Failed to delete proposal");
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold transition-colors flex-1 shadow-md shadow-rose-900/30"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        icon: false,
        style: {
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "1rem",
        },
      }
    );
  };

  // Status Action Handlers
  const handleWon = async (proposal) => {
    try {
      await proposalsApi.markWon(proposal.id, getToken());
      toast.success("Proposal marked as Won!");
      await refresh();
    } catch (err) {
      toast.error(err.message || "Failed to mark as Won");
    }
  };

  const handleLost = async (proposal) => {
    try {
      await proposalsApi.markLost(proposal.id, getToken());
      toast.success("Proposal marked as Lost");
      await refresh();
    } catch (err) {
      toast.error(err.message || "Failed to mark as Lost");
    }
  };

  const handleReview = async (proposal) => {
    try {
      await proposalsApi.updateProposal(
        proposal.id,
        { ...proposal, status: "Review" },
        getToken()
      );
      toast.success("Proposal moved to Review");
      await refresh();
    } catch (err) {
      toast.error(err.message || "Failed to update proposal status");
    }
  };

  const handleViewed = async (proposal) => {
    try {
      await proposalsApi.updateProposal(
        proposal.id,
        { ...proposal, status: "Viewed" },
        getToken()
      );
      toast.success("Proposal marked as Viewed");
      await refresh();
    } catch (err) {
      toast.error(err.message || "Failed to update proposal status");
    }
  };

  // Share / Send Email Handler
  const handleSent = async (proposal) => {
    try {
      const recipientEmail =
        proposal.client_email || proposal.email || proposal.client;

      if (!recipientEmail || !recipientEmail.includes("@")) {
        toast.error("Please add a valid client email to send this proposal");
        return;
      }

      await proposalsApi.shareProposal(
        proposal.id,
        { clientEmail: recipientEmail },
        getToken()
      );

      toast.success(`Proposal dispatched to ${recipientEmail}`);
      await refresh();
    } catch (err) {
      toast.error(err.message || "Failed to send proposal");
    }
  };

  // Modal Submit (Create / Update)
  const handleModalSubmit = async (formData) => {
    try {
      if (selectedProposal) {
        await proposalsApi.updateProposal(
          selectedProposal.id,
          formData,
          getToken()
        );
        toast.success("Proposal updated successfully");
      } else {
        await proposalsApi.createProposal(formData, getToken());
        toast.success("Proposal created successfully");
      }

      await refresh();
      setShowModal(false);
      setSelectedProposal(null);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-400px text-slate-400 text-sm">
        Loading proposals...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-400px text-rose-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Proposals</h1>
        <p className="mt-1 text-slate-400">
          Manage your proposal pipeline and track deal progress.
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
      <ProposalTable
        proposals={filteredProposals}
        onView={(id) => navigate(`/dashboard/proposals/preview/${id}`)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onWon={handleWon}
        onLost={handleLost}
        onReview={handleReview}
        onViewed={handleViewed}
        onSent={handleSent}
      />

      {/* Modal */}
      <ProposalModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedProposal(null);
        }}
        proposal={selectedProposal}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
}