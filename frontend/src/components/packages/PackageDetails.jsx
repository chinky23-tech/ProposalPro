import React from "react";
import { X, CheckCircle2, DollarSign, Clock, Layers, Calendar } from "lucide-react";

export default function PackageDetails({ packageItem, onClose, onEdit }) {
  if (!packageItem) return null;

  return (
    <div className="fixed inset-0 z-9999 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl space-y-6 p-6">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                {packageItem.billing_type || packageItem.billingType || "Package Tier"}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mt-2">{packageItem.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Price display */}
        <div className="bg-slate-950/60 border border-slate-800/80 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">Pricing Rate</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold text-white">${packageItem.price}</span>
              <span className="text-xs text-slate-400">
                / {packageItem.billing_type || packageItem.billingType || "one-time"}
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Description */}
        {packageItem.description && (
          <div className="space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Description</h4>
            <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
              {packageItem.description}
            </p>
          </div>
        )}

        {/* Deliverables / Features List */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Included Deliverables ({packageItem.features?.length || 0})
          </h4>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {Array.isArray(packageItem.features) && packageItem.features.length > 0 ? (
              packageItem.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200 bg-slate-950/30 p-2.5 rounded-lg border border-slate-800/40">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{typeof feature === "string" ? feature : feature?.name || JSON.stringify(feature)}</span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 italic">No features listed for this tier.</p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              onClose();
              onEdit(packageItem);
            }}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            Edit Package
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-lg shadow-emerald-900/20"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
}