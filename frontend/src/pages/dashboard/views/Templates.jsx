import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, FileText, Layers, Clock, Loader2, Sparkles, X } from "lucide-react";
import { toast } from "react-toastify";

// Hooks & API
import useTemplates from "../../../hooks/useTemplates"; 
import proposalsApi from "../../../api/proposals";
import { getStoredAuthSession } from "../../../api/auth";

// Components
import TemplateGrid from "../../../components/templates/TemplateGrid";
import TemplateModal from "../../../components/templates/TemplateModal";
import TemplateEmptyState from "../../../components/templates/TemplateEmptyState";
import Button from "../../../components/ui/Button";

export default function Templates() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // States for the clean "Use Template" flow
  const [isUseModalOpen, setIsUseModalOpen] = useState(false);
  const [templateToUse, setTemplateToUse] = useState(null);
  const [clientName, setClientName] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [customValue, setCustomValue] = useState("");
  const [isCreatingProposal, setIsCreatingProposal] = useState(false);

  const { 
    templates, 
    loading, 
    error, 
    createTemplate, 
    updateTemplate, 
    deleteTemplate, 
    refresh 
  } = useTemplates();

  const getToken = () => {
    const session = getStoredAuthSession();
    return session?.accessToken || session?.token;
  };

  const handleOpenCreateModal = () => {
    setSelectedTemplate(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (template) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleDuplicateTemplate = async (template) => {
    try {
      const duplicatedData = {
        title: `${template.title} (Copy)`,
        content: template.content || template.description || "",
        category: template.category,
        value: template.value || "0"
      };
      await createTemplate(duplicatedData);
      toast.success("Template duplicated successfully!");
      refresh();
    } catch (err) {
      console.error("Failed to duplicate template:", err);
      toast.error(err.message || "Failed to duplicate template");
    }
  };

  // Opens the clean generation modal
  const handleUseTemplateClick = (template) => {
    setTemplateToUse(template);
    setClientName("");
    setCustomTitle(template.title || ""); // 🛠️ FIX: Uses exact template title instead of hardcoded "- Draft"
    setCustomValue(template.value || "0");
    setIsUseModalOpen(true);
  };

  // Submits data and cleanly redirects without opening any subsequent edit modals
  const handleConfirmUseTemplate = async (e) => {
    e.preventDefault();
    if (!clientName.trim()) {
      toast.error("Client name is required");
      return;
    }

    try {
      setIsCreatingProposal(true);
      const proposalPayload = {
        title: customTitle,
        content: templateToUse.content || "",
        client: clientName, 
        value: Number(customValue) || 0,
        status: "Draft"
      };

      await proposalsApi.createProposal(proposalPayload, getToken());
      
      toast.success("Proposal created successfully!");
      setIsUseModalOpen(false);

      // 🛠️ UX FIX: Navigates straight to the dashboard overview; no post-redirect edit modal triggers
      navigate("/dashboard/proposals");
    } catch (err) {
      console.error("Failed to utilize template:", err);
      toast.error(err.message || "Failed to create proposal from template");
    } finally {
      setIsCreatingProposal(false);
    }
  };

  const handleModalSubmit = async (formData) => {
    setFormSubmitting(true);
    try {
      if (selectedTemplate) {
        await updateTemplate(selectedTemplate.id, formData);
        toast.success("Template updated successfully!");
      } else {
        await createTemplate(formData);
        toast.success("Template created successfully!");
      }
      setIsModalOpen(false);
      refresh(); 
    } catch (err) {
      console.error("Template save error:", err);
      toast.error(err.message || "Failed to save template");
    } finally {
      setFormSubmitting(false);
    }
  };

  const totalTemplates = templates?.length || 0;
  const uniqueCategoriesCount = templates ? new Set(templates.map(t => t.category).filter(Boolean)).size : 0;

  const lastUpdatedText = templates && templates.length > 0
    ? new Date(Math.max(...templates.map(t => {
        const timestamp = t.updatedAt || t.updated_at || t.createdAt || t.created_at;
        return timestamp ? new Date(timestamp).getTime() : new Date().getTime();
      }))).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
    : "No modifications";

  const filteredTemplates = templates?.filter(t => 
    t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-8 p-6 max-w-[1600px] mx-auto text-slate-100">
      
      {/* Header Container */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Template Library
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Create reusable proposal templates and standardize your sales workflow.
          </p>
        </div>
        
        {!loading && totalTemplates > 0 && (
          <Button
            onClick={handleOpenCreateModal}
            className="bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-lg shadow-emerald-950/20 px-4 h-11 rounded-xl transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Template</span>
          </Button>
        )}
      </div>

      {/* Analytics HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Templates</p>
              <h3 className="text-3xl font-bold mt-0.5 text-white">{loading ? "..." : totalTemplates}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Categories</p>
              <h3 className="text-3xl font-bold mt-0.5 text-white">{loading ? "..." : uniqueCategoriesCount}</h3>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Last Modified</p>
              <h3 className="text-sm font-bold mt-2 text-slate-200 truncate max-w-[220px]">{loading ? "Syncing..." : lastUpdatedText}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center justify-between gap-4 bg-slate-900/30 p-4 rounded-xl border border-slate-800/40 backdrop-blur-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500/50 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          Error sync: {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs text-slate-500 tracking-wider font-medium">LOADING TEMPLATES...</p>
        </div>
      ) : totalTemplates === 0 ? (
        <TemplateEmptyState onCreateClick={handleOpenCreateModal} />
      ) : (
        <TemplateGrid 
          templates={filteredTemplates} 
          onEdit={handleOpenEditModal}
          onDelete={deleteTemplate}
          onDuplicate={handleDuplicateTemplate}
          onUse={handleUseTemplateClick}
          onCreate={handleOpenCreateModal}
        />
      )}

      {/* Main Template Form Modal */}
      <TemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        template={selectedTemplate}
        loading={formSubmitting}
      />

      {/* 💎 Streamlined "Use Template" Modal */}
      {isUseModalOpen && templateToUse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <Sparkles className="w-5 h-5" />
                <h3 className="text-lg font-bold text-white">Create Proposal</h3>
              </div>
              <button onClick={() => setIsUseModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmUseTemplate} className="mt-4 space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Template Preview</label>
                <div className="mt-1.5 max-h-24 overflow-y-auto w-full p-3 rounded-xl bg-slate-950 border border-slate-800/60 text-xs text-slate-500 whitespace-pre-wrap italic scrollbar-none">
                  {templateToUse.content || "No pre-written text inside."}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Client Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className="mt-1.5 w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-emerald-500 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Proposal Title</label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder="Proposal title..."
                  className="mt-1.5 w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-emerald-500 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">Deal Value</label>
                <input
                  type="number"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  placeholder="0"
                  className="mt-1.5 w-full h-11 px-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 outline-none focus:border-emerald-500 transition-all text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800 mt-6">
                <button type="button" onClick={() => setIsUseModalOpen(false)} className="h-11 px-5 rounded-xl border border-slate-800 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-all">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingProposal || !clientName.trim()}
                  className="flex items-center gap-2 h-11 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-sm font-semibold text-white shadow-lg shadow-emerald-950/25 transition-all"
                >
                  {isCreatingProposal ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Create Proposal</span>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  ); 
}