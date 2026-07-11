import { useEffect, useState } from "react";

import { Modal } from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { toast } from "react-toastify";


const CATEGORY_OPTIONS = [
  {
    value: "Marketing",
    label: "Marketing",
  },
  {
    value: "Development",
    label: "Development",
  },
  {
    value: "Design",
    label: "Design",
  },
  {
    value: "Consulting",
    label: "Consulting",
  },
  {
    value: "General",
    label: "General",
  },
];

export default function TemplateModal({
  isOpen,
  onClose,
  onSubmit,
  template = null,
  loading = false,
}) {
  const [formData, setFormData] =
    useState({
      title: "",
      category: "General",
      description: "",
      content: "",
    });

  useEffect(() => {
    if (template) {
      setFormData({
        title:
          template.title ||
          "",

        category:
          template.category ||
          "General",

        description:
          template.description ||
          "",

        content:
          template.content ||
          "",
      });
    } else {
      setFormData({
        title: "",
        category: "General",
        description: "",
        content: "",
      });
    }
  }, [template, isOpen]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Template name is required");
      return;
    }

    onSubmit(formData);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        template
          ? "Edit Template"
          : "Create Template"
      }
      className="max-w-4xl"
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {/* Name */}

        <Input
          label="Template Name"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Website Proposal Template"
          required
        />

        {/* Category */}

        <Select
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          options={
            CATEGORY_OPTIONS
          }
        />

        {/* Description */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Description
          </label>

          <textarea
            name="description"
            value={
              formData.description
            }
            onChange={
              handleChange
            }
            rows={3}
            placeholder="Brief description of this template..."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-600 focus:outline-none"
          />
        </div>

        {/* Content */}

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Template Content
          </label>

          <textarea
            name="content"
            value={
              formData.content
            }
            onChange={
              handleChange
            }
            rows={12}
            placeholder="Write your reusable proposal template content here..."
            className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm focus:border-teal-600 focus:outline-none"
          />
        </div>

        {/* Footer */}

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
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
            {template
              ? "Update Template"
              : "Create Template"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}