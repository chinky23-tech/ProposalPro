import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, FileText, CheckCircle, XCircle } from "lucide-react";
import { toast } from "react-toastify";

// 🛠️ 1. IMPORT YOUR CUSTOM API INSTANCE OR AXIOS
import proposalsApi from "/src/api/proposals.js"; 
import { getStoredAuthSession } from "/src/api/auth.js";

export default function ProposalPreview() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [proposal, setProposal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);

  // Helper utility to grab your active JWT session credentials
  const getToken = () => {
    const session = getStoredAuthSession();
    return session?.accessToken || session?.token;
  };

  useEffect(() => {
    const fetchProposalDetails = async () => {
      try {
        setLoading(true);
        
        // 🛠️ 2. USE YOUR STANDARDIZED REPOSITORY INSTANCE LAYER WITH AUTH TOKEN
        // If your proposalsApi doesn't have a getProposalById method yet, 
        // fallback to: const response = await axios.get(`/api/proposals/${id}`, { headers: { Authorization: `Bearer ${getToken()}` } });
        const data = await proposalsApi.getProposalById(id, getToken());
        
        // Adjust depending on whether your API wrapper returns data directly or wrapped in Axios response structure
        setProposal(data.data || data);
      } catch (err) {
        console.error("Fetch Proposal Error:", err);
        toast.error(err.message || "Failed to fetch full proposal details");
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProposalDetails();
    }
  }, [id]);

// Inside your ProposalPreview.jsx file
const handleShareWithClient = async () => {
  setSharing(true);
  try {
    // 🛠️ Pass the client email dynamically from the fetched proposal record!
    await proposalsApi.shareProposal(id, { clientEmail: proposal.client_email || proposal.email }, getToken());
    toast.success("Secure proposal link sent to client via Resend!");
  } catch (err) {
    toast.error("Failed to distribute secure proposal link");
  } finally {
    setSharing(false);
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
        
        <button
          onClick={handleShareWithClient}
          disabled={sharing}
          className="flex items-center gap-2 px-4 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-sm transition-all"
        >
          <Send className="w-4 h-4" />
          {sharing ? "Sending..." : "Share with Client"}
        </button>
      </div>

      {/* Meta HUD Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg">
          {proposal.status || "Draft"}
        </span>
        <h1 className="text-2xl font-bold mt-3">{proposal.title}</h1>
        <p className="text-sm text-slate-400 mt-1">Prepared for: <span className="text-white font-medium">{proposal.client}</span></p>
      </div>

      {/* Document Proposal Canvas */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-8 shadow-2xl min-h-500px text-left overflow-y-auto">
        <div className="prose prose-invert max-w-none whitespace-pre-wrap text-slate-300 text-sm leading-relaxed">
          {proposal.content || "This proposal document contains no structured text copy."}
        </div>
      </div>
    </div>
  );
}