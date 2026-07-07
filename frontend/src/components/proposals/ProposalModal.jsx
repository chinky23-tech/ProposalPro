import { useEffect, useState } from "react";

import {Modal} from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";

const STATUS_OPTIONS = [
  {
    value: "Draft",
    label: "Draft",
  },
  {
    value: "Review",
    label: "Review",
  },
  {
    value: "Sent",
    label: "Sent",
  },
  {
    value: "Viewed",
    label: "Viewed",
  },
  {
    value: "Accepted",
    label: "Accepted",
  },
  {
    value: "Rejected",
    label: "Rejected",
  },
  {
    value: "Won",
    label: "Won",
  },
  {
    value: "Lost",
    label: "Lost",
  },
];

export default function ProposalModal({
  isOpen,
  onClose,
  onSubmit,
  proposal = null,
  loading = false,
}) {
  const [formData, setFormData] =
    useState({
      client: "",
      title: "",
      value: "",
      score: "",
      status: "Draft",
    });

  useEffect(() => {
    if (proposal) {
      setFormData({
        client:
          proposal.client || "",
        title:
          proposal.title || "",
        value:
          proposal.value || "",
        score:
          proposal.score || "",
        status:
          proposal.status ||
          "Draft",
      });
    } else {
      setFormData({
        client: "",
        title: "",
        value: "",
        score: "",
        status: "Draft",
      });
    }
  }, [proposal, isOpen]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        proposal
          ? "Edit Proposal"
          : "Create Proposal"
      }
      className="max-w-2xl"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        <Input
          label="Client"
          name="client"
          value={formData.client}
          onChange={handleChange}
          placeholder="Northstar Studios"
          required
        />

        <Input
          label="Proposal Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Brand Refresh Proposal"
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Value"
            type="number"
            name="value"
            value={formData.value}
            onChange={handleChange}
            placeholder="25000"
          />

          <Input
            label="Score"
            type="number"
            name="score"
            value={formData.score}
            onChange={handleChange}
            placeholder="85"
          />
        </div>

        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={STATUS_OPTIONS}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            isLoading={loading}
          >
            {proposal
              ? "Update Proposal"
              : "Create Proposal"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}