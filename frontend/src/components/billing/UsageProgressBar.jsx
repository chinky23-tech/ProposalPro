import React from "react";

export const UsageProgressBar = ({ used = 0, limit = 3 }) => {
  const percentage = Math.min(Math.round((used / limit) * 100), 100);
  const isNearLimit = percentage >= 80;

  return (
    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-slate-100">AI Proposals Quota</span>
        <span className="text-xs font-semibold text-slate-400">
          {used} / {limit} Used
        </span>
      </div>
      <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isNearLimit ? "bg-amber-500" : "bg-emerald-500"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {isNearLimit && (
        <p className="text-xs text-amber-400 mt-2 font-medium">
          You are close to your monthly AI generation limit. Upgrade to Pro for high volume drafting.
        </p>
      )}
    </div>
  );
};