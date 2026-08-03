import React from "react";
import { Zap, ShieldCheck, Cpu, LayoutTemplate, Share2, BarChart3 } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Cpu className="w-6 h-6 text-emerald-400" />,
      title: "AI-Powered Generation",
      description: "Generate robust context-aware proposals instantly based on brief client requirements."
    },
    {
      icon: <LayoutTemplate className="w-6 h-6 text-emerald-400" />,
      title: "Premium Templates",
      description: "Vetted, high-conversion templates tailored for modern digital teams and agencies."
    },
    {
      icon: <Zap className="w-6 h-6 text-emerald-400" />,
      title: "Lightning Fast Builder",
      description: "Drag-and-drop builder to customize sections, pricing tables, and legal terms in seconds."
    },
    {
      icon: <Share2 className="w-6 h-6 text-emerald-400" />,
      title: "Secure Sharing",
      description: "Share proposals via secure magic links with expiring access and password protection."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-emerald-400" />,
      title: "Real-time Analytics",
      description: "Know exactly when clients open your proposal and what sections they spend time on."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: "Bank-grade Security",
      description: "Your data and your clients' data are protected with enterprise-grade encryption."
    }
  ];

  return (
    <section id="features" className="py-24 bg-slate-950 relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-wider text-emerald-400 uppercase mb-3">Core Features</h2>
          <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
            Everything you need to close deals
          </h3>
          <p className="text-slate-400 text-lg">
            Stop wasting hours formatting documents. ProposalPro provides the complete toolkit to streamline your sales pipeline.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-transform">
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
              <p className="text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
