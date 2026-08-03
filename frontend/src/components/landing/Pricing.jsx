import React from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";

export default function Pricing() {
  const plans = [
    {
      name: "Starter",
      desc: "Perfect for freelancers and solo consultants.",
      price: "$19",
      period: "/month",
      features: [
        "Up to 5 active proposals",
        "Basic templates",
        "Standard analytics",
        "Email support"
      ]
    },
    {
      name: "Pro",
      desc: "For growing agencies closing more deals.",
      price: "$49",
      period: "/month",
      isPopular: true,
      features: [
        "Unlimited proposals",
        "Premium template library",
        "AI Proposal Generation",
        "Advanced analytics & tracking",
        "Custom branding",
        "Priority 24/7 support"
      ]
    },
    {
      name: "Enterprise",
      desc: "Custom solutions for large sales teams.",
      price: "$199",
      period: "/month",
      features: [
        "Everything in Pro",
        "Team collaboration (up to 10)",
        "Salesforce integration",
        "Custom API access",
        "Dedicated account manager",
        "Custom legal terms"
      ]
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-slate-950 border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-wider text-emerald-400 uppercase mb-3">Simple Pricing</h2>
          <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
            Invest in your close rate
          </h3>
          <p className="text-slate-400 text-lg">
            Pay for itself with your first closed deal. Start with a 14-day free trial on any plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
          {plans.map((plan, i) => (
            <div 
              key={i} 
              className={`relative rounded-3xl p-8 ${
                plan.isPopular 
                  ? "bg-slate-900 border-2 border-emerald-500/70 shadow-2xl shadow-emerald-500/20 transform md:-translate-y-4" 
                  : "bg-slate-900/70 border border-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]"
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <span className="bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="mb-6">
                <h4 className="text-2xl font-bold text-white mb-2">{plan.name}</h4>
                <p className="text-slate-400 text-sm h-10">{plan.desc}</p>
              </div>
              
              <div className="mb-8">
                <span className="text-5xl font-black text-white">{plan.price}</span>
                <span className="text-slate-400">{plan.period}</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <Check className={`w-5 h-5 shrink-0 ${plan.isPopular ? "text-emerald-400" : "text-slate-500"}`} />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Link
                to="/signup"
                className={`block w-full py-4 rounded-xl text-center font-bold transition-all ${
                  plan.isPopular
                    ? "bg-emerald-500 text-white hover:bg-emerald-400 shadow-lg shadow-emerald-500/25"
                    : "bg-slate-800 text-white hover:bg-slate-700 border border-white/10"
                }`}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
