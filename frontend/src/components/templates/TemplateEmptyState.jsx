import { FileText, Plus } from "lucide-react";
import Button from "../ui/Button";

export default function TemplateEmptyState({
  onCreate,
}) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-900 p-12 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
        <FileText className="h-8 w-8 text-emerald-400" />
      </div>

      <h3 className="mt-6 text-xl font-semibold text-white">
        No Templates Found
      </h3>

      <p className="mt-2 text-slate-400">
        Create your first reusable proposal template.
      </p>

      <Button
        onClick={onCreate}
        className="mt-6"
      >
        <Plus className="mr-2 h-4 w-4" />
        Create Template
      </Button>
    </div>
  );
}