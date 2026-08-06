/*import React from "react";
import { PenTool, CheckCircle2, GripVertical } from "lucide-react";

export default function ProposalBuilder() {
  return (
    <section id="builder" className="py-24 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-row-reverse lg:flex-row">
          
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl blur-3xl transform -rotate-6" />
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              
              {/* Toolbar *
              <div className="h-12 border-b border-slate-800 bg-slate-900/80 flex items-center px-4 gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                </div>
                <div className="flex-1 text-center text-xs font-medium text-slate-400">Editing: Enterprise Redesign</div>
              </div>

              {/* Editor Body *
              <div className="p-6 bg-slate-950 space-y-4">
                {[
                  { title: "Executive Summary", lines: 3 },
                  { title: "Project Timeline", lines: 2, active: true },
                  { title: "Investment Structure", lines: 4 }
                ].map((block, i) => (
                  <div 
                    key={i} 
                    className={`p-4 rounded-xl border flex gap-4 ${
                      block.active 
                        ? "bg-slate-900 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                        : "bg-slate-900/50 border-slate-800"
                    }`}
                  >
                    <div className="mt-1 cursor-grab opacity-50 hover:opacity-100 transition-opacity">
                      <GripVertical className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <h5 className={`font-semibold ${block.active ? "text-emerald-400" : "text-slate-300"}`}>{block.title}</h5>
                        {block.active && <PenTool className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <div className="space-y-2">
                        {Array.from({ length: block.lines }).map((_, j) => (
                          <div 
                            key={j} 
                            className={`h-2 rounded-full ${
                              block.active ? "bg-slate-700" : "bg-slate-800"
                            } ${j === block.lines - 1 ? "w-2/3" : "w-full"}`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Text Content *
          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Powerful builder. <br /> Zero learning curve.
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Create stunning, interactive proposals using our intuitive block-based editor. No design skills required. Just drag, drop, and publish.
            </p>
            
            <div className="space-y-6 pt-4">
              {[
                { title: "Drag & Drop Blocks", desc: "Easily reorder sections, add pricing tables, or embed media." },
                { title: "Global Variables", desc: "Update a client's name once, and it changes everywhere." },
                { title: "Live Preview", desc: "See exactly what your client will see before you hit send." }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">{feature.title}</h4>
                    <p className="text-slate-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}*/

import React from "react";
import { PenTool, CheckCircle2, GripVertical } from "lucide-react";

export default function ProposalBuilder() {
  const blocks = [
    { 
      title: "Executive Summary", 
      snippet: "Our comprehensive strategy focuses on scaling your digital architecture with minimal downtime and maximum ROI." 
    },
    { 
      title: "Project Timeline", 
      snippet: "Phase 1 starts in Q3 with discovery, followed by rapid prototyping and final production rollout by Q4.", 
      active: true 
    },
    { 
      title: "Investment Structure", 
      snippet: "Flexible milestone-based payment terms structured around critical project deliverables." 
    }
  ];

  return (
    <section id="builder" className="py-24 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center flex-row-reverse lg:flex-row">
          
          <div className="order-2 lg:order-1 relative">
            <div className="absolute inset-0 bg-emerald-500/10 rounded-3xl blur-3xl transform -rotate-6" />
            <div className="relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              
              {/* Toolbar */}
              <div className="h-12 border-b border-slate-800 bg-slate-900/80 flex items-center px-4 gap-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                  <div className="w-3 h-3 rounded-full bg-slate-700" />
                </div>
                <div className="flex-1 text-center text-xs font-medium text-slate-400">Editing: Enterprise Redesign</div>
              </div>

              {/* Editor Body */}
              <div className="p-6 bg-slate-950 space-y-4">
                {blocks.map((block, i) => (
                  <div 
                    key={i} 
                    className={`p-4 rounded-xl border flex gap-4 ${
                      block.active 
                        ? "bg-slate-900 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                        : "bg-slate-900/50 border-slate-800"
                    }`}
                  >
                    <div className="mt-1 cursor-grab opacity-50 hover:opacity-100 transition-opacity">
                      <GripVertical className="w-5 h-5 text-slate-500" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h5 className={`font-semibold ${block.active ? "text-emerald-400" : "text-slate-300"}`}>{block.title}</h5>
                        {block.active && <PenTool className="w-4 h-4 text-emerald-500" />}
                      </div>
                      <p className={`text-xs leading-relaxed ${block.active ? "text-slate-300" : "text-slate-500"}`}>
                        {block.snippet}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Text Content */}
          <div className="order-1 lg:order-2 space-y-8">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              Powerful builder. <br /> Zero learning curve.
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Create stunning, interactive proposals using our intuitive block-based editor. No design skills required. Just drag, drop, and publish.
            </p>
            
            <div className="space-y-6 pt-4">
              {[
                { title: "Drag & Drop Blocks", desc: "Easily reorder sections, add pricing tables, or embed media." },
                { title: "Global Variables", desc: "Update a client's name once, and it changes everywhere." },
                { title: "Live Preview", desc: "See exactly what your client will see before you hit send." }
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">{feature.title}</h4>
                    <p className="text-slate-400">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
