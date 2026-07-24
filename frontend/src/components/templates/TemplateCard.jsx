
import React from "react";
import {
  FileText,
  Sparkles,
  Clock3,
  Play,
  Eye,
  Copy,
  Pencil,
  Trash2,
} from "lucide-react";

import Button from "../ui/Button";

export default function TemplateCard({
  template,
  onView,
  onEdit,
  onDelete,
  onDuplicate,
  onUse,
}) {
 
  const getDynamicCategory = (title = "") => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("web") || lowerTitle.includes("development") || lowerTitle.includes("code")) {
      return "Web Development";
    }
    if (lowerTitle.includes("design") || lowerTitle.includes("ui") || lowerTitle.includes("ux")) {
      return "UI/UX Design";
    }
    if (lowerTitle.includes("marketing") || lowerTitle.includes("seo")) {
      return "Marketing";
    }
    return "General";
  };

  // 🛠️ DYNAMIC TIMESTAMP: Safely format the database snake_case timestamps
  const getFormattedTime = () => {
    const rawTime = template.updated_at || template.created_at;
    if (!rawTime) return "Recently";
    
    return new Date(rawTime).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  // Strip markdown markers to clean up the card's text preview block
  const cleanSnippet = template.content
    ? template.content.replace(/[#*`_-]/g, "").substring(0, 120) + "..."
    : "No content available";

  const handleUseClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    onUse?.(template);
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 transition-all hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-950/30 flex flex-col justify-between">
      
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-500/10 p-3 shrink-0 border border-emerald-500/20">
              <FileText className="h-6 w-6 text-emerald-400" />
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold text-white break-words whitespace-normal leading-snug">
                {template.title || template.name}
              </h3>

              <p className="text-xs text-slate-500">
                ID #{template.id}
              </p>
            </div>
          </div>
        </div>

        {/* Description Preview */}
        <p className="mt-5 line-clamp-3 text-sm text-slate-400 min-h-60px">
          {cleanSnippet}
        </p>

        {/* Meta Labels */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400 border border-violet-500/10">
            {template.category || getDynamicCategory(template.title)}
          </span>

          <span className="flex items-center gap-1 rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-400 border border-slate-700/30">
            <Clock3 className="h-3 w-3 text-slate-500" />
            Updated {getFormattedTime()}
          </span>
        </div>
      </div>

      {/* Footer & Direct Action Controls */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-4">
        
        {/* Direct Action Icon Toolbar */}
        <div className="flex items-center gap-1.5">
          {/* View / Preview */}
          <button
            type="button"
            onClick={() => onView?.(template)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={() => onDuplicate?.(template)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-emerald-400 transition-colors"
            title="Duplicate Template"
          >
            <Copy className="w-4 h-4" />
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={() => onEdit?.(template)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-emerald-400 transition-colors"
            title="Edit Template"
          >
            <Pencil className="w-4 h-4" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDelete?.(template.id || template._id)}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-rose-400 transition-colors ml-auto"
            title="Delete Template"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Ready to use
          </div>

          <Button
            onClick={handleUseClick}
            className="transition-all active:scale-95"
          >
            <Play className="mr-2 h-3.5 w-3.5 fill-current" />
            Use Template
          </Button>
        </div>

      </div>
    </div>
  );
}