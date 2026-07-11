import {
  FileText,
  Layers,
  Clock3,
} from "lucide-react";

export default function TemplateStats({
  templates = [],
}) {
  const totalTemplates =
    templates.length;

  const categories =
    new Set(
      templates.map(
        (template) =>
          template.category
      )
    ).size;

  return (
    <div className="grid gap-5 md:grid-cols-3">
      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <FileText className="h-8 w-8 text-emerald-400" />

        <p className="mt-4 text-sm text-slate-400">
          Total Templates
        </p>

        <h2 className="mt-2 text-4xl font-bold text-white">
          {totalTemplates}
        </h2>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <Layers className="h-8 w-8 text-violet-400" />

        <p className="mt-4 text-sm text-slate-400">
          Categories
        </p>

        <h2 className="mt-2 text-4xl font-bold text-white">
          {categories}
        </h2>
      </div>

      <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6">
        <Clock3 className="h-8 w-8 text-amber-400" />

        <p className="mt-4 text-sm text-slate-400">
          Recently Updated
        </p>

        <h2 className="mt-2 text-4xl font-bold text-white">
          {templates.length > 0
            ? "Yes"
            : "No"}
        </h2>
      </div>
    </div>
  );
}