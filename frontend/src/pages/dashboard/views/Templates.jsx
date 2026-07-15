import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, FileText, Layers, Clock, Loader2 } from "lucide-react";
import useTemplates from "../../../hooks/useTemplates"; 
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

  const { templates, loading, error, createTemplate, updateTemplate, deleteTemplate, refresh } = useTemplates();




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
        description: template.description,
        category: template.category,
        value: template.value || template.defaultValue || "0"
      };
      await createTemplate(duplicatedData);
      refresh();
    } catch (err) {
      console.error("Failed to duplicate template:", err);
    }
  };

const handleUseTemplate = (template) => {
  // 🚀 Switch tabs smoothly to the AI Proposal Studio instead of the list pipeline
  navigate("/dashboard/proposal-studio", { 
    state: { 
      prefilledTemplate: {
        templateId: template.id,
        title: template.title,
        content: template.content || template.description || ""
      }
    } 
  });
};
  const handleModalSubmit = async (formData) => {
    setFormSubmitting(true);
    try {
      if (selectedTemplate) {
        await updateTemplate(selectedTemplate.id, formData);
      } else {
        await createTemplate(formData);
      }
      setIsModalOpen(false);
      refresh(); 
    } catch (err) {
      console.error("Template persistence transaction error:", err);
    } finally {
      setFormSubmitting(false);
    }
  };

  const totalTemplates = templates?.length || 0;
  
  const uniqueCategoriesCount = templates 
    ? new Set(templates.map(t => t.category).filter(Boolean)).size 
    : 0;

  const lastUpdatedText = templates && templates.length > 0
    ? new Date(Math.max(...templates.map(t => new Date(t.updatedAt || t.createdAt)))).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
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

      {/* Analytics Metrics HUD */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Templates</p>
              <h3 className="text-3xl font-bold mt-0.5 text-white">
                {loading ? <span className="text-xl text-slate-500">...</span> : totalTemplates}
              </h3>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Categories</p>
              <h3 className="text-3xl font-bold mt-0.5 text-white">
                {loading ? <span className="text-xl text-slate-500">...</span> : uniqueCategoriesCount}
              </h3>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-6 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Last Modified</p>
              <h3 className="text-sm font-bold mt-2 text-slate-200 truncate max-w-220px">
                {loading ? "Syncing timeline..." : lastUpdatedText}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* Control Layout Wrapper */}
      <div className="flex items-center justify-between gap-4 bg-slate-900/30 p-4 rounded-xl border border-slate-800/40 backdrop-blur-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search titles or attributes..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-slate-950 border border-slate-800 focus:border-emerald-500/50 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all focus:ring-1 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Error Bound Banner */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400">
          Failed to synchronize template configurations: {error}
        </div>
      )}

      {/* Central View Router State Tree */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          <p className="text-xs text-slate-500 tracking-wider font-medium">FETCHING DATA SCHEMAS...</p>
        </div>
      ) : totalTemplates === 0 ? (
        <TemplateEmptyState onCreateClick={handleOpenCreateModal} />
      ) : (
        /* 🛠️ FIX: Mapped exact prop-names to match TemplateGrid's expectations */
        <TemplateGrid 
          templates={filteredTemplates} 
          onEdit={handleOpenEditModal}
          onDelete={deleteTemplate}
 
  
          onDuplicate={handleDuplicateTemplate}
          onUse={handleUseTemplate}
          onCreate={handleOpenCreateModal}
        />
      )}

      {/* Template Document Form Modal */}
      <TemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        template={selectedTemplate}
        loading={formSubmitting}
      />
    </div>
  ); 
}