import {
  FileText,
  Sparkles,
  Clock3,
  Play,
} from "lucide-react";

import TemplateActions from "./TemplateActions";
import Button from "../ui/Button";

export default function TemplateCard({
  template,
  onEdit,
  onDelete,
  onDuplicate,
  onUse,
}) {
  // 🛠️ SMART FALLBACK: Infer category dynamically from title keywords
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

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 p-6 transition-all hover:border-emerald-500/40 hover:shadow-lg hover:shadow-emerald-950/30">
      
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/10 p-3">
            <FileText className="h-6 w-6 text-emerald-400" />
          </div>

          <div>
            <h3 className="font-semibold text-white">
              {template.title || template.name}
            </h3>

            <p className="text-xs text-slate-500">
              ID #{template.id}
            </p>
          </div>
        </div>

        <TemplateActions
          template={template}
          onEdit={onEdit}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      </div>

      {/* Description Preview */}
      <p className="mt-5 line-clamp-3 text-sm text-slate-400 min-h-60px">
        {cleanSnippet}
      </p>

      {/* Meta Labels */}
      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400 border border-violet-500/10">
          {template.category || getDynamicCategory(template.title)}
        </span>

        <span className="flex items-center gap-1 rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-400 border border-slate-700/30">
          <Clock3 className="h-3 w-3 text-slate-500" />
          Updated {getFormattedTime()}
        </span>
      </div>

      {/* Footer Controls */}
      <div className="mt-6 flex items-center justify-between border-t border-slate-800/60 pt-5">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
          <Sparkles className="h-4 w-4" />
          Ready to use
        </div>

        <Button
          onClick={() => onUse?.(template)}
          className="transition-all active:scale-95"
        >
          <Play className="mr-2 h-4 w-4 fill-current" />
          Use Template
        </Button>
      </div>
    </div>
  );
}