import { useState, useEffect } from "react";
import { X, Loader2, FilePlus2 } from "lucide-react";

export default function TemplateModal({ isOpen, onClose, onSubmit, template, loading }) {
  const [formData, setFormData] = useState({
    title: "",
    category: "General",
    description: "",
    content: ""
  });

  useEffect(() => {
    if (template) {
      setFormData({
        title: template.title || "",
        category: template.category || "General",
        description: template.description || "",
        content: template.content || ""
      });
    } else {
      setFormData({
        title: "",
        category: "General",
        description: "",
        content: ""
      });
    }
  }, [template, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-emerald-400">
            <FilePlus2 className="w-5 h-5" />
            <h3 className="text-lg font-bold text-white">
              {template ? "Edit Template" : "Create Template"}
            </h3>
          </div>
          <button 
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-left">
          
          {/* Template Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Template Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Website Proposal Template"
              className="mt-1.5 w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 outline-none focus:border-emerald-500 transition-all text-sm"
            />
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-1.5 w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-emerald-500 transition-all text-sm"
            >
              <option value="General">General</option>
              <option value="Web Development">Web Development</option>
              <option value="UI/UX Design">UI/UX Design</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Description
            </label>
            <textarea
              name="description"
              rows={2}
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of this template..."
              className="mt-1.5 w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 outline-none focus:border-emerald-500 transition-all text-sm resize-none"
            />
          </div>

          {/* Template Content */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Template Content <span className="text-red-500">*</span>
            </label>
            <textarea
              name="content"
              required
              rows={6}
              value={formData.content}
              onChange={handleChange}
              placeholder="Write your reusable proposal template content here..."
              className="mt-1.5 w-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-600 outline-none focus:border-emerald-500 transition-all text-sm font-mono scrollbar-thin"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="h-11 px-5 rounded-xl border border-slate-800 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.title.trim() || !formData.content.trim()}
              className="flex items-center gap-2 h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-sm font-semibold text-white shadow-lg shadow-emerald-950/25 transition-all"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>{template ? "Save Changes" : "Save Template"}</span>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}