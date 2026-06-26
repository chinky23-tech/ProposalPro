import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Input } from "../../components/ui/Input";
import { Sparkles, ShieldCheck, Zap, ArrowLeft } from "lucide-react";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email address is required");
      return;
    }

    setIsSubmitting(true);
    try {
      // Replace with your actual password recovery API call if available
      // await authApi.forgotPassword({ email: email.trim().toLowerCase() });
      toast.success("Recovery instructions sent if email exists.");
    } catch (err) {
      toast.error(err.message || "Failed to trigger recovery flow.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 relative overflow-hidden font-sans">
      
      {/* LEFT SIDE: Brand Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-emerald-950 via-teal-900 to-emerald-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-600px h-600px bg-emerald-500/10 rounded-full filter blur-3xl animate-pulse" />
        <div className="flex items-center gap-2 relative z-10">
          <div className="p-2 bg-emerald-500/20 backdrop-blur-md rounded-xl border border-emerald-400/20">
            <Sparkles className="w-6 h-6 text-emerald-400" />
          </div>
          <span className="font-black text-xl tracking-wider uppercase text-emerald-50">Proposal Pro AI</span>
        </div>
        <div className="max-w-md my-auto relative z-10 space-y-6">
          <h1 className="text-4xl xl:text-5xl font-black tracking-tight leading-tight text-white">
            Win clients faster with <span className="text-transparent bg-clip-text bg-linear-to-r from-emerald-400 to-teal-300">AI precision</span>.
          </h1>
          <p className="text-emerald-100/80 leading-relaxed text-base">
            Proposal Pro AI is an intelligent, AI-powered proposal generation platform that helps businesses, freelancers, and agencies create professional, winning proposals in minutes instead of days.
          </p>
          <div className="pt-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-1 mt-0.5 rounded-md bg-emerald-500/20 text-emerald-400">
                <Zap className="w-4 h-4" />
              </div>
              <p className="text-sm text-emerald-100/90 font-medium">Generate robust context-aware RFPs and contracts instantly.</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1 mt-0.5 rounded-md bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-sm text-emerald-100/90 font-medium">Vetted templates tailored for modern digital teams.</p>
            </div>
          </div>
        </div>
        <div className="text-xs text-emerald-200/50 relative z-10">&copy; 2026 ProposalPro AI. All rights reserved.</div>
      </div>

      {/* RIGHT SIDE: Content Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-white">
        <div className="w-full max-w-md space-y-6">
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="mb-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Reset Password</h2>
              <p className="text-sm text-slate-500 mt-1">Enter your email address to recover your platform account.</p>
            </div>

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              value={email}
              error={error}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-xl bg-linear-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white font-bold transition-all shadow-xl shadow-emerald-900/10 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center min-h-48px"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              ) : (
                "Send Reset Link"
              )}
            </button>
            
            <div className="mt-2 text-center">
              <Link to="/login" className="inline-flex items-center gap-2 text-sm text-emerald-700 font-bold hover:underline transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Login
              </Link>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}