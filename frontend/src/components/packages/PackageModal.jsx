import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, Package } from "lucide-react";
import Select from "../ui/Select.jsx";

const BILLING_OPTIONS = [
  { label: "One-Time", value: "one_time" },
  { label: "Monthly", value: "monthly" },
  { label: "Hourly", value: "hourly" },
  { label: "Annually", value: "annually" },
];

export default function PackageModal({ isOpen, onClose, onSubmit, initialData = null, loading = false }) {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    billing_type: "one_time",
    description: "",
    features: [],
  });

  const [featureInput, setFeatureInput] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        price: initialData.price || "",
        billing_type: initialData.billing_type || initialData.billingType || "one_time",
        description: initialData.description || "",
        features: Array.isArray(initialData.features) ? initialData.features : [],
      });
    } else {
      setFormData({
        name: "",
        price: "",
        billing_type: "one_time",
        description: "",
        features: [],
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, featureInput.trim()],
    }));
    setFeatureInput("");
  };

  const handleRemoveFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      price: parseFloat(formData.price) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-9999 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-6 p-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Package className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-lg">
              {initialData ? "Update Package Tier" : "Create New Package"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Package Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Standard Web Development"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {/* Pricing & Billing Type */}
          <div className="grid grid-cols-2 gap-3 items-end">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Price ($)</label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="499.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            {/* Custom Select Component */}
            <div>
              <Select
                label="Billing Type"
                name="billing_type"
                options={BILLING_OPTIONS}
                value={formData.billing_type}
                placeholder="Select billing frequency"
                variant="dark"
                onChange={(e) => setFormData({ ...formData, billing_type: e.target.value })}
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Description</label>
            <textarea
              rows={2}
              placeholder="Brief summary of what this package covers..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none"
            />
          </div>

          {/* Features Dynamic List Input */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Included Deliverables / Features</label>
            
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Responsive Design & SEO Setup"
                value={featureInput}
                onChange={(e) => setFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>

            {/* Features Tags */}
            <div className="max-h-32 overflow-y-auto space-y-1.5 pt-1">
              {formData.features.map((feat, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-950/60 border border-slate-800/80 rounded-lg px-3 py-1.5 text-xs text-slate-300">
                  <span className="truncate pr-2">{feat}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(index)}
                    className="text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Form Controls */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-2"
            >
              {loading ? "Saving..." : initialData ? "Save Changes" : "Create Package"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}