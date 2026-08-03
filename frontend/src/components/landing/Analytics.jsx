import React from "react";
import { Eye, Clock, TrendingUp, MousePointerClick } from "lucide-react";

export default function Analytics() {
  return (
    <section className="py-24 bg-slate-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-sm font-bold tracking-wider text-emerald-400 uppercase mb-3">Real-time Insights</h2>
          <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
            Know exactly what your clients are thinking
          </h3>
          <p className="text-slate-400 text-lg">
            Remove the guesswork from your sales process. Get instant notifications and detailed analytics when clients interact with your proposals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Eye className="w-5 h-5 text-emerald-400" />,
              title: "View Tracking",
              value: "Instant Alerts",
              desc: "Get notified the second they open it."
            },
            {
              icon: <Clock className="w-5 h-5 text-teal-400" />,
              title: "Time Spent",
              value: "Section Level",
              desc: "See exactly which pages they read most."
            },
            {
              icon: <MousePointerClick className="w-5 h-5 text-emerald-400" />,
              title: "Interactions",
              value: "Link Clicks",
              desc: "Track clicks on portfolio links and videos."
            },
            {
              icon: <TrendingUp className="w-5 h-5 text-teal-400" />,
              title: "Conversion",
              value: "+45%",
              desc: "Average increase in win rates."
            }
          ].map((stat, i) => (
            <div key={i} className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-colors group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-slate-900 border border-slate-700 group-hover:border-emerald-500/30 transition-colors">
                  {stat.icon}
                </div>
                <h4 className="text-slate-300 font-medium">{stat.title}</h4>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <p className="text-sm text-slate-400">{stat.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
