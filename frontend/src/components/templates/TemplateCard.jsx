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
              {template.title ||
                template.name}
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

      {/* Description */}

      <p className="mt-5 line-clamp-3 text-sm text-slate-400">
        {template.content ||
          "No content available"}
      </p>

      {/* Meta */}

      <div className="mt-6 flex flex-wrap gap-2">
        <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-400">
          {template.category ||
            "General"}
        </span>

        <span className="flex items-center gap-1 rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-400">
          <Clock3 className="h-3 w-3" />
          Updated
        </span>
      </div>

      {/* Footer */}

      <div className="mt-6 flex items-center justify-between border-t border-slate-800 pt-5">
        <div className="flex items-center gap-2 text-xs text-emerald-400">
          <Sparkles className="h-4 w-4" />
          Ready to use
        </div>

        <Button
          onClick={() =>
            onUse?.(template)
          }
        >
          <Play className="mr-2 h-4 w-4" />
          Use Template
        </Button>
      </div>
    </div>
  );
}