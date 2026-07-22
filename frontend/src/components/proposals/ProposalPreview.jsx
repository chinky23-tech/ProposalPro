import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Send, 
  Copy, 
  Check, 
  Link2, 
  ExternalLink, 
  Mail, 
  Share2, 
  X,
  MessageSquare,
  Globe
} from "lucide-react";
import { toast } from "react-toastify";

import proposalsApi from "/src/api/proposals.js"; 
import { getStoredAuthSession } from "/src/api/auth.js";

export default function ProposalPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  
  const [shareData, setShareData] = useState(null); 
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const getToken = () => {
    const session = getStoredAuthSession();
    return session?.accessToken || session?.token;
  };

  useEffect(() => {
    const fetchProposalDetails = async () => {
      try {
        setLoading(true);
        const data = await proposalsApi.getProposalById(id, getToken());
        setProposal(data.data || data);
      } catch (err) {
        console.error("Fetch Proposal Error:", err);
        toast.error(err.message || "Failed to fetch full proposal details");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) fetchProposalDetails();
  }, [id]);

  const handleShareWithClient = async () => {
    setSharing(true);
    try {
      const targetEmail = proposal?.client_email || proposal?.email || proposal?.client;

      if (!targetEmail) {
        toast.error("Could not find a valid email address attached to this client record.");
        setSharing(false);
        return;
      }

      const payload = { clientEmail: targetEmail };
      const token = getToken();

      const response = await proposalsApi.shareProposal(id, payload, token);
      
      const url = response?.data?.shareUrl || response?.shareUrl || response?.data?.data?.shareUrl;
      const expiresAt = response?.data?.expiresAt || response?.expiresAt || response?.data?.data?.expiresAt;

      if (url) {
        const sharePayload = { url, email: targetEmail, expiresAt };
        setShareData(sharePayload);
        setProposal((prev) => ({ ...prev, status: "Sent" }));
        setIsShareModalOpen(true); // 🚀 Opens modal window
        toast.success("Proposal link created and email dispatched!");
      } else {
        toast.warning("Email sent, but could not extract the share link for preview.");
      }

    } catch (err) {
      console.error("Frontend Sharing Hook Exception Details:", err);
      toast.error("Failed to distribute secure proposal link");
    } finally {
      setSharing(false);
    }
  };

  const handleCopyLink = () => {
    if (!shareData?.url) return;
    navigator.clipboard.writeText(shareData.url);
    setCopied(true);
    toast.info("Share URL copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareMessage = `Hi! Here is the digital proposal for "${proposal?.title || "our project"}": ${shareData?.url}`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: proposal?.title || "Business Proposal",
          text: `Check out the project proposal for ${proposal?.title}`,
          url: shareData.url,
        });
      } catch (err) {
        console.log("Native share dismissed");
      }
    } else {
      handleCopyLink();
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-400">Loading document canvas...</div>;
  if (!proposal) return <div className="p-8 text-center text-red-400">Proposal record not found.</div>;

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto text-slate-100">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <button 
          onClick={() => navigate("/dashboard/proposals")}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Pipeline
        </button>
        
        <div className="flex items-center gap-3">
          {shareData && (
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 px-4 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-sm transition-all"
            >
              <Share2 className="w-4 h-4 text-emerald-400" /> Share Options
            </button>
          )}

          <button
            onClick={handleShareWithClient}
            disabled={sharing}
            className="flex items-center gap-2 px-5 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 font-semibold text-sm transition-all shadow-lg shadow-emerald-900/20"
          >
            <Send className="w-4 h-4" />
            {sharing ? "Dispatching..." : "Share with Client"}
          </button>
        </div>
      </div>

      {/* Active Share Banner HUD */}
      {shareData && (
        <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold">
              <Link2 className="w-4 h-4" />
              <span>Active Secure Client Link</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              Sent to: <span className="text-white font-medium">{shareData.email}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-emerald-300 truncate">
              {shareData.url}
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <button
                onClick={() => setIsShareModalOpen(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 h-9 rounded-xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Share Channels
              </button>

              <button
                onClick={handleCopyLink}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meta HUD Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
            {proposal.status || "Draft"}
          </span>
          <h1 className="text-2xl font-bold mt-3">{proposal.title}</h1>
          <p className="text-sm text-slate-400 mt-1">
            Prepared for: <span className="text-white font-medium">{proposal.client}</span>
          </p>
        </div>
      </div>

      {/* Document Proposal Canvas */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-8 shadow-2xl min-h-[500px] text-left overflow-y-auto">
        <div className="prose prose-invert max-w-none whitespace-pre-wrap text-slate-300 text-sm leading-relaxed">
          {proposal.content || "This proposal document contains no structured text copy."}
        </div>
      </div>

      {/* 🌐 MULTI-CHANNEL SOCIAL SHARE MODAL */}
      {isShareModalOpen && shareData && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Share Proposal</h3>
                  <p className="text-xs text-slate-400">Send via your preferred platform</p>
                </div>
              </div>

              <button 
                onClick={() => setIsShareModalOpen(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${encodeURIComponent(shareMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 text-xs font-semibold transition-all hover:scale-[1.02]"
              >
                <MessageSquare className="w-5 h-5" />
                WhatsApp
              </a>

              {/* LinkedIn */}
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-400 text-xs font-semibold transition-all hover:scale-[1.02]"
              >
                <Globe className="w-5 h-5" />
                LinkedIn
              </a>

              {/* Twitter / X */}
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}`}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/20 text-sky-400 text-xs font-semibold transition-all hover:scale-[1.02]"
              >
                <Share2 className="w-5 h-5" />
                Twitter / X
              </a>

              {/* Email / SMS */}
              <a
                href={`mailto:?subject=${encodeURIComponent(`Proposal: ${proposal.title}`)}&body=${encodeURIComponent(shareMessage)}`}
                className="flex flex-col items-center gap-2 p-3.5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 text-xs font-semibold transition-all hover:scale-[1.02]"
              >
                <Mail className="w-5 h-5" />
                Email / SMS
              </a>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs text-slate-400 font-medium">Proposal Access URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareData.url}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-300 focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <button
              onClick={handleNativeShare}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 border border-slate-700 transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" /> Open System Share Menu
            </button>

          </div>
        </div>
      )}
    </div>
  );
}