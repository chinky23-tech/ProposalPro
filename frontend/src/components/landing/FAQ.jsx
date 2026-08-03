import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: "How does the AI Proposal Generation work?",
      a: "Our AI analyzes the brief you provide, your selected template, and your industry context to generate a highly tailored draft. It writes executive summaries, structures timelines, and suggests pricing strategies. You can always review and edit the generated content."
    },
    {
      q: "Can I use my own branding and colors?",
      a: "Yes! In the Pro and Enterprise plans, you can customize the colors, typography, and logo to ensure every proposal perfectly matches your company's brand identity."
    },
    {
      q: "What happens when a client views my proposal?",
      a: "You'll receive an instant email and dashboard notification the second they open it. Our analytics will also show you exactly how much time they spent on each section, helping you plan your follow-up perfectly."
    },
    {
      q: "Can clients sign and pay directly through ProposalPro?",
      a: "Our platform supports digital signatures out of the box. Payment integrations (like Stripe) are currently in beta for Pro users and will be rolling out generally very soon!"
    },
    {
      q: "Is there a long-term contract?",
      a: "No, all our standard plans are month-to-month. You can upgrade, downgrade, or cancel your subscription at any time right from your dashboard."
    }
  ];

  return (
    <section className="py-24 bg-slate-950 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-lg">
            Everything you need to know about ProposalPro.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i} 
              className={`border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 ${
                openIndex === i ? "bg-slate-900/80 border-emerald-500/30" : "bg-slate-900/30 hover:bg-slate-900/50"
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className={`font-semibold text-lg ${openIndex === i ? "text-emerald-400" : "text-white"}`}>
                  {faq.q}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                    openIndex === i ? "transform rotate-180 text-emerald-400" : ""
                  }`} 
                />
              </button>
              
              <div 
                className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
                  openIndex === i ? "max-h-48 pb-6 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="text-slate-400 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
