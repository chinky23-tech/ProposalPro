import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CheckCircle2, XCircle, FileText, AlertCircle, Clock } from "lucide-react";
import { toast } from "react-toastify";


export default function PublicProposalView() {
  const { token } = useParams();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
  const [actionState, setActionState] = useState(null); // 'Accepted' | 'Rejected' | null
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchPublicProposal = async () => {
      try {
        setLoading(true);
        // Calls GET /api/proposals/share/:token or /api/share/:token based on your backend
        const response = await axios.get(`http://localhost:5001/api/proposals/share/${token}`);
        
        const payload = response.data.data || response.data;
        setProposal(payload);
        if (payload.status) setActionState(payload.status);
      } catch (err) {
        console.error("Public Link Access Error:", err);
        const status = err.response?.status;
        setErrorStatus(status || 500);
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchPublicProposal();
  }, [token]);

  const handleAction = async (decision) => {
    setSubmitting(true);
    try {
      const endpoint = decision === "Accepted" 
        ? `http://localhost:5001/api/proposals/share/${token}/accept`
        : `http://localhost:5001/api/proposals/share/${token}/reject`;

      await axios.post(endpoint);
      setActionState(decision);
      toast.success(`Proposal marked as ${decision}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || `Failed to mark proposal as ${decision}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-400">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Verifying secure access link...</p>
      </div>
    );
  }

  // Handle Expiry (410) or Invalid Token (404)
  if (errorStatus) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mx-auto text-rose-400">
            {errorStatus === 410 ? <Clock className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
          <h2 className="text-xl font-bold text-white">
            {errorStatus === 410 ? "Link Expired" : "Invalid Access Token"}
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {errorStatus === 410
              ? "This document tracking link has passed its expiration window. Please contact the sender to request a fresh copy."
              : "We couldn't verify this tracking token string. Please double-check the URL from your invitation."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Client Header Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
              P
            </div>
            <span className="font-semibold text-sm tracking-wide text-white">ProposalPro</span>
          </div>

          <div className="text-xs text-slate-400">
            Document ID: <span className="font-mono text-slate-200">{token.slice(0, 8)}...</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-6 my-6">
        {/* Banner if already Accepted or Rejected */}
        {actionState === "Accepted" && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex items-center gap-3 text-emerald-400 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>You have accepted this proposal. The sender has been notified!</span>
          </div>
        )}

        {actionState === "Rejected" && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-4 flex items-center gap-3 text-rose-400 text-sm">
            <XCircle className="w-5 h-5 shrink-0" />
            <span>You declined this proposal. The sender has been notified.</span>
          </div>
        )}

        {/* Header HUD */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-2 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <FileText className="w-4 h-4" /> Business Proposal
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">{proposal?.title}</h1>
        </div>

        {/* Paper Document Canvas */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 md:p-12 shadow-2xl min-h-500px">
          <div className="prose prose-invert max-w-none whitespace-pre-wrap text-slate-300 text-sm leading-relaxed">
            {proposal?.content || "No document body available."}
          </div>
        </div>

        {/* Bottom Sticky Action Bar */}
        {!actionState && (
          <div className="sticky bottom-6 bg-slate-900/90 border border-slate-800/90 backdrop-blur-lg rounded-2xl p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 text-center sm:text-left">
              Review the terms above and select your decision to update the project status instantly.
            </p>

            <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
              <button
                onClick={() => handleAction("Rejected")}
                disabled={submitting}
                className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                <XCircle className="w-4 h-4" /> Decline
              </button>

              <button
                onClick={() => handleAction("Accepted")}
                disabled={submitting}
                className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Accept Proposal
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}