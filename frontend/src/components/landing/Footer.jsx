import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, Mail, Globe, MessageSquare } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Pre-footer CTA */}
        <div className="bg-slate-900 rounded-3xl p-8 md:p-12 mb-16 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-2">Ready to win more clients?</h3>
            <p className="text-slate-400">Join thousands of agencies closing deals faster with ProposalPro.</p>
          </div>
          <Link
            to="/signup"
            className="shrink-0 px-8 py-4 bg-emerald-500 text-white font-bold rounded-full hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/25"
          >
            Start your 14-day free trial
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="p-1 bg-emerald-500/20 rounded-md">
                <Sparkles className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">ProposalPro</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-6">
              The intelligent proposal generation platform. We help businesses create, send, and track winning proposals in minutes.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors">
                <Globe className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="text-slate-500 hover:text-emerald-400 transition-colors">
                <MessageSquare className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              {["Features", "AI Engine", "Templates", "Pricing", "Changelog"].map(link => (
                <li key={link}>
                  <a href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {["Blog", "Proposal Examples", "Help Center", "Community", "Status"].map(link => (
                <li key={link}>
                  <a href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-4">Legal</h4>
            <ul className="space-y-3">
              {["Terms of Service", "Privacy Policy", "Cookie Policy", "Security"].map(link => (
                <li key={link}>
                  <a href="#" className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} ProposalPro Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <span>Made with <span className="text-emerald-500">♥</span> for closers</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
