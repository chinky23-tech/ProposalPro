import React from "react";
import { Package, CheckCircle2, Eye, Edit3, Trash2, Layers } from "lucide-react";

export default function PackageList({ packages = [], onView, onEdit, onDelete, loading = false }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 bg-slate-900/40 border border-slate-800 rounded-3xl animate-pulse p-6" />
        ))}
      </div>
    );
  }

  if (packages.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 text-center space-y-4 my-6">
        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
          <Layers className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">No Service Packages Found</h3>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Create service packages to quickly bundle scope items and pricing directly into your client proposals.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {packages.map((pkg) => {
        const packageId = pkg.id || pkg._id;
        const features = Array.isArray(pkg.features) ? pkg.features : [];

        return (
          <div
            key={packageId}
            className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-6 transition-all duration-200 flex flex-col justify-between group shadow-xl"
          >
            <div className="space-y-4">
              
              {/* Header Badge & Name */}
              <div className="flex items-start justify-between gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
                  {pkg.billing_type || pkg.billingType || "One-Time"}
                </span>

                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onView(pkg)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(pkg)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
                    title="Edit Package"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(packageId)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                    title="Delete Package"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {pkg.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[32px]">
                  {pkg.description || "No description provided."}
                </p>
              </div>

              {/* Price Banner */}
              <div className="pt-2">
                <span className="text-3xl font-extrabold text-white">${pkg.price}</span>
                <span className="text-xs text-slate-400 ml-1">
                  / {pkg.billing_type || pkg.billingType || "one-time"}
                </span>
              </div>

              {/* Deliverables snippet */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Features</p>
                {features.slice(0, 3).map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 truncate">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{typeof feat === "string" ? feat : feat?.name}</span>
                  </div>
                ))}
                {features.length > 3 && (
                  <p className="text-[11px] text-slate-500 italic pl-5">
                    +{features.length - 3} more deliverables
                  </p>
                )}
              </div>

            </div>

            {/* Quick Action Button */}
            <div className="pt-6 mt-6 border-t border-slate-800/60">
              <button
                onClick={() => onView(pkg)}
                className="w-full py-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors flex items-center justify-center gap-2"
              >
                <Package className="w-4 h-4 text-emerald-400" /> View Package Spec
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
}