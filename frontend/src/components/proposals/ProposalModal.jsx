import { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import Input from "../ui/Input";
import Select from "../ui/Select";
import Button from "../ui/Button";
import { Sparkles } from "lucide-react";

export default function ProposalModal({
  isOpen,
  onClose,
  onSubmit,
  proposal = null,
  loading = false,
  clients = [],     
  templates = [],   
}) {
  const [formData, setFormData] = useState({
    client: "",
    title: "",
    value: "",
    score: "0",
    status: "Draft",
    templateId: "",
  });
  
  const [isCalculatingScore, setIsCalculatingScore] = useState(false);

  // Synchronize or reset state data structures safely when modal cycles
  useEffect(() => {
    if (proposal) {
      setFormData({
        client: proposal.client || "",
        title: proposal.title || "",
        value: proposal.value || "",
        score: proposal.score || "0",
        status: proposal.status || "Draft",
        templateId: proposal.templateId || "",
      });
    } else {
      setFormData({
        client: "",
        title: "",
        value: "",
        score: "0",
        status: "Draft",
        templateId: "",
      });
    }
  }, [proposal, isOpen]);

  // 🤖 Dynamic Debounced Scoring Pipeline Engine
  useEffect(() => {
    if (proposal || (!formData.title && !formData.value)) return;

    const delayDebounce = setTimeout(() => {
      setIsCalculatingScore(true);
      
      let calculatedScore = 30; // Reliable baseline value anchor
      
      if (formData.title && formData.title.length > 15) {
        calculatedScore += 35;
      }
      if (formData.value && Number(formData.value) > 20000) {
        calculatedScore += 35;
      }
      
      setFormData((prev) => ({
        ...prev,
        score: String(Math.min(calculatedScore, 100)),
      }));
      setIsCalculatingScore(false);
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [formData.title, formData.value, proposal]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const clientOptions = clients.map(c => ({ value: c.name, label: c.name }));
  const templateOptions = templates.map(t => ({ value: t.id, label: t.title }));

  // Circular Layout Vector Calculations
  const scoreNum = Math.min(Math.max(Number(formData.score || 0), 0), 100);
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = circumference - (scoreNum / 100) * circumference;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={proposal ? "Edit Proposal" : "Create Proposal"}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Template Selector Options */}
        {!proposal && templates.length > 0 && (
          <Select
            label="Use Template (Optional)"
            name="templateId"
            variant="light"
            value={formData.templateId}
            onChange={handleChange}
            options={templateOptions}
            placeholder="Select a template..."
          />
        )}

        {/* Client Picker Logic */}
        <div>
          {clientOptions.length > 0 ? (
            <Select
              label="Client"
              name="client"
              variant="light"
              value={formData.client}
              onChange={handleChange}
              options={clientOptions}
              placeholder="Select a client..."
              required
            />
          ) : (
            <Input
              label="Client"
              name="client"
              value={formData.client}
              onChange={handleChange}
              placeholder="e.g. Northstar Studios"
              required
            />
          )}
        </div>

        {/* Proposal Title Context */}
        <Input
          label="Proposal Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Website Redesign Proposal"
          required
        />

        {/* Financials & Circular Progress Metadata HUD Metric Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <Input
            label="Value (₹)"
            type="number"
            name="value"
            value={formData.value}
            onChange={handleChange}
            placeholder="25000"
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Proposal Health Score
            </label>
            
            <div className="flex items-center gap-4 h-[54px] px-4 rounded-xl bg-slate-50 border border-slate-200">
              {/* Radial Progress Graphic */}
              <div className="relative flex items-center justify-center w-11 h-11 shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 44 44">
                  <circle
                    cx="22"
                    cy="22"
                    r={radius}
                    className="stroke-slate-200"
                    strokeWidth="3.5"
                    fill="transparent"
                  />
                  <circle
                    cx="22"
                    cy="22"
                    r={radius}
                    className={`transition-all duration-500 ease-out ${
                      scoreNum >= 80 ? "stroke-emerald-500" : scoreNum >= 50 ? "stroke-amber-500" : "stroke-rose-500"
                    }`}
                    strokeWidth="3.5"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-xs font-bold text-slate-800">
                  {scoreNum}%
                </span>
              </div>

              <div className="flex flex-col justify-center">
                <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                  {isCalculatingScore ? "Analyzing parameters..." : scoreNum >= 80 ? "High Win Chance" : scoreNum >= 50 ? "Medium Potential" : "Needs Optimization"}
                </span>
                <span className="text-[11px] text-slate-500">
                  {isCalculatingScore ? "Reading text vectors..." : "Pipeline rating metrics"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Administrative Status Pipeline Navigation Picker */}
        <Select
          label="Status"
          name="status"
          variant="light"
          value={formData.status}
          onChange={handleChange}
          options={[
            { value: "Draft", label: "Draft" },
            { value: "Review", label: "Review" },
            { value: "Sent", label: "Sent" },
            { value: "Viewed", label: "Viewed" },
            { value: "Accepted", label: "Accepted" },
            { value: "Rejected", label: "Rejected" },
            { value: "Won", label: "Won" },
            { value: "Lost", label: "Lost" },
          ]}
        />

        {/* Interactive Action Control Footer */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            isLoading={loading}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow-sm transition-all"
          >
            {proposal ? "Update Proposal" : "Create Proposal"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}