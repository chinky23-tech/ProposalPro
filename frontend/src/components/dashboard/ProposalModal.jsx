import { useState } from "react";
import proposalsApi from "../../api/proposals";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

const statusOptions = [
  { value: "Draft", label: "Draft" },
  { value: "Review", label: "Review" },
  { value: "Sent", label: "Sent" },
];

const clampScore = (score) => {
  const numericScore = Number.parseInt(score, 10);

  if (Number.isNaN(numericScore)) {
    return 0;
  }

  return Math.min(100, Math.max(0, numericScore));
};

const ProposalModal = ({ proposal, token, onClose, onSaved }) => {
  const isEditMode = Boolean(proposal);
  const [form, setForm] = useState(() => ({
    client: proposal?.client || "",
    title: proposal?.title || "",
    value:
      proposal?.value === undefined || proposal?.value === null
        ? ""
        : String(proposal.value),
    status: proposal?.status || "Draft",
    score:
      proposal?.score === undefined || proposal?.score === null
        ? "0"
        : String(proposal.score),
  }));
  const [error, setError] = useState("");
  const [savingAction, setSavingAction] = useState("");

  const updateField = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const getPayload = () => ({
    client: form.client.trim(),
    title: form.title.trim(),
    value: form.value,
    status: form.status,
    score: clampScore(form.score),
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.client.trim() || !form.title.trim()) {
      setError("Client name and proposal title are required.");
      return;
    }

    try {
      setSavingAction("save");
      setError("");

      if (isEditMode) {
        await proposalsApi.updateProposal(proposal.id, getPayload(), token);
      } else {
        await proposalsApi.createProposal(getPayload(), token);
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to save proposal.");
    } finally {
      setSavingAction("");
    }
  };

  const handleDelete = async () => {
    if (!isEditMode) {
      return;
    }

    if (!window.confirm("Are you sure you want to delete this proposal?")) {
      return;
    }

    try {
      setSavingAction("delete");
      setError("");
      await proposalsApi.deleteProposal(proposal.id, token);
      onSaved();
      onClose();
    } catch (err) {
      setError(err.message || "Failed to delete proposal.");
    } finally {
      setSavingAction("");
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEditMode ? "Edit Proposal" : "New Proposal"}</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {error && <div className="form-alert">{error}</div>}

            <Input
              label="Client Name"
              value={form.client}
              onChange={updateField("client")}
              required
            />

            <Input
              label="Proposal Title"
              value={form.title}
              onChange={updateField("title")}
              required
            />

            <Input
              label="Estimated Value"
              value={form.value}
              onChange={updateField("value")}
              inputMode="decimal"
            />

            <Select
              label="Status"
              value={form.status}
              onChange={updateField("status")}
              options={statusOptions}
              placeholder=""
            />

            <Input
              label="Win Score (%)"
              type="number"
              min="0"
              max="100"
              value={form.score}
              onChange={updateField("score")}
            />

            <div className="modal-footer">
              {isEditMode && (
                <Button
                  type="button"
                  variant="danger"
                  className="btn-delete"
                  onClick={handleDelete}
                  isLoading={savingAction === "delete"}
                >
                  Delete
                </Button>
              )}
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={savingAction === "save"}>
                {isEditMode ? "Save Changes" : "Create Proposal"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProposalModal;
