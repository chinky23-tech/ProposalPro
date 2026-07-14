import { useMemo, useState } from "react";

import { useProposals } from "../../../hooks/useProposals";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import ProposalToolbar from "../../../components/proposals/ProposalToolbar";
import ProposalTable from "../../../components/proposals/ProposalTable";
import ProposalModal from "../../../components/proposals/ProposalModal";
import ProposalStatus from "../../../components/proposals/ProposalStatusBadge";

import proposalsApi from "../../../api/proposals";
import { getStoredAuthSession } from "../../../api/auth";
import { toast } from "react-toastify";

export default function Proposals() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const location = useLocation();
const [isModalOpen, setIsModalOpen] = useState(false);
const [prefilledData, setPrefilledData] = useState(null);
  const [showModal, setShowModal] =
    useState(false);

  const [selectedProposal, setSelectedProposal] =
    useState(null);

  const {
    proposals,
    loading,
    error,
    refresh,
  } = useProposals();


  const getToken = () => {
  const session =
    getStoredAuthSession();

  return (
    session?.accessToken ||
    session?.token
  );
};
useEffect(() => {
  if (location.state?.openCreateModal && location.state?.prefilledTemplate) {
    setPrefilledData(location.state.prefilledTemplate);
    setIsModalOpen(true);
    
    // Clean up history state so it doesn't reopen on a page refresh
    window.history.replaceState({}, document.title);
  }
}, [location]);
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
    setShowModal(true);
  };

  const handleEdit = (proposal) => {
    setSelectedProposal(proposal);
    setShowModal(true);
  };

  const handleDelete = async (
  proposal
) => {
  const confirmed =
    window.confirm(
      `Delete "${proposal.title}"?`
    );

  if (!confirmed) return;

  try {
    await proposalsApi.deleteProposal(
      proposal.id,
      getToken()
    );

    toast.success(
      "Proposal deleted"
    );

    await refresh();
  } catch (error) {
    toast.error(error.message);
  }
};



const handleWon = async (
  proposal
) => {
  try {
    await proposalsApi.markWon(
      proposal.id,
      getToken()
    );

    toast.success(
      "Proposal marked as Won"
    );

    await refresh();
  } catch (error) {
    toast.error(error.message);
  }
};

  const handleLost = async (
  proposal
) => {
  try {
    await proposalsApi.markLost(
      proposal.id,
      getToken()
    );

    toast.success(
      "Proposal marked as Lost"
    );

    await refresh();
  } catch (error) {
    toast.error(error.message);
  }
};

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
      await proposalsApi.createProposal(
        formData,
        getToken()
      );

      toast.success("Proposal created successfully");
    }

    await refresh();

    setShowModal(false);
    setSelectedProposal(null);
  } catch (error) {
    console.error(error);
    toast.error(error.message || "Something went wrong");
  }
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

        <p className="mt-1 text-slate-400">
          Manage your proposal
          pipeline and track
          deal progress.
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
        onEdit={handleEdit}
        onDelete={handleDelete}
        onWon={handleWon}
        onLost={handleLost}
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