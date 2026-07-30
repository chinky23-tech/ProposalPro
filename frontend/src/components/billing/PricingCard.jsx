import React from "react";

export const PricingCard = ({ 
  title, 
  price, 
  priceId, 
  features, 
  isCurrentPlan, 
  onSelect, 
  popular 
}) => {
  return (
    <div className={`relative p-6 bg-slate-900 rounded-3xl border ${
      popular ? "border-emerald-500 shadow-2xl shadow-emerald-900/20" : "border-slate-800 shadow-sm"
    } flex flex-col justify-between`}>
      {popular && (
        <span className="absolute -top-3 right-6 bg-emerald-500 text-slate-950 text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wide">
          Most Popular
        </span>
      )}
      <div>
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <div className="my-4">
          <span className="text-4xl font-extrabold text-white">${price}</span>
          <span className="text-slate-400 text-sm">/month</span>
        </div>
        <ul className="space-y-3 mb-6">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center text-sm text-slate-300">
              <svg className="w-4 h-4 mr-2 text-emerald-400 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      <button
        disabled={isCurrentPlan}
        onClick={() => onSelect(priceId)}
        className={`w-full py-2.5 px-4 rounded-2xl font-semibold text-sm transition-all ${
          isCurrentPlan 
            ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
            : popular 
            ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-900/20" 
            : "bg-slate-800 text-white hover:bg-slate-700"
        }`}
      >
        {isCurrentPlan ? "Active Plan" : "Upgrade Plan"}
      </button>
    </div>
  );
};