import { useState, useEffect } from "react";

import {
  MoreVertical,
  Pencil,
  Trash2,
  Copy,
} from "lucide-react";

export default function TemplateActions({
  template,
  onEdit,
  onDelete,
  onDuplicate,
}) {
  const [open, setOpen] =
    useState(false);

  useEffect(() => {
    const closeMenu = () =>
      setOpen(false);

    window.addEventListener(
      "click",
      closeMenu
    );

    return () =>
      window.removeEventListener(
        "click",
        closeMenu
      );
  }, []);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 shadow-2xl">
          
          <button
            onClick={() =>
              onEdit(template)
            }
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white hover:bg-slate-800"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>

          <button
            onClick={() =>
              onDuplicate?.(
                template
              )
            }
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-white hover:bg-slate-800"
          >
            <Copy className="h-4 w-4" />
            Duplicate
          </button>

          <button
            onClick={() =>
              onDelete(template)
            }
            className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}