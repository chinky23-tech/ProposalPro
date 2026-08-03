import React from "react";
import { Bot, Sparkles, Wand2 } from "lucide-react";

export default function AIGeneration() {
  return (
    <section id="ai" className="py-24 bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Bot className="w-4 h-4" />
              <span>Smart AI Engine</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Let AI do the heavy lifting for you.
            </h2>
            
            <p className="text-lg text-slate-400 leading-relaxed">
              Our advanced AI doesn't just fill in blanks. It analyzes your client's needs, industry standards, and your past successful proposals to craft highly-targeted, persuasive copy that converts.
            </p>
            
            <ul className="space-y-4 pt-4">
              {[
                "Context-aware executive summaries",
                "Automated milestone and timeline generation",
                "Intelligent pricing recommendations",
                "Dynamic tone adjustment (Professional, Creative, Direct)"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="p-1 mt-0.5 rounded bg-emerald-500/20 text-emerald-400 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-slate-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual Interactive Element */}
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-tr from-emerald-500/20 to-teal-500/20 rounded-3xl blur-2xl" />
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl">
              
              {/* Mock UI Header */}
              <div className="flex items-center gap-3 border-b border-slate-800 pb-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">AI Assistant</h4>
                  <p className="text-xs text-slate-400">Generating proposal draft...</p>
                </div>
              </div>

              {/* Mock Generation Animation */}
              <div className="space-y-4">
                <div className="h-4 bg-slate-800 rounded-full w-3/4 animate-pulse" />
                <div className="h-4 bg-slate-800 rounded-full w-full animate-pulse" style={{ animationDelay: '0.2s' }} />
                <div className="h-4 bg-slate-800 rounded-full w-5/6 animate-pulse" style={{ animationDelay: '0.4s' }} />
                
                <div className="pt-4 border-t border-slate-800 mt-4">
                  <div className="p-4 rounded-xl bg-slate-800/50 border border-emerald-500/30">
                    <p className="text-sm text-emerald-100/80 leading-relaxed font-mono">
                      "Based on the discovery call notes, I've drafted a comprehensive 3-phase timeline focusing on rapid MVP deployment followed by iterative scaling. The pricing has been structured to highlight the ROI in Phase 2."
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
