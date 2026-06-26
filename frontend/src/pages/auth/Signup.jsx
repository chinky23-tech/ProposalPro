import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { authApi, saveAuthSession } from "../../api/auth";
import { Input } from "../../components/ui/Input";
import { Card, CardBody } from "../../components/ui/Card";
import { Eye, EyeOff, Sparkles, ShieldCheck, Zap } from "lucide-react";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    if (form.password.length < 6) nextErrors.password = "Use at least 6 characters";
    if (form.confirmPassword !== form.password) nextErrors.confirmPassword = "Passwords must match";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authApi.signup({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });
      saveAuthSession(response);
      toast.success("Account initialized successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message || "Registration failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 relative overflow-hidden font-sans">
      
      {/* LEFT SIDE: Brand Showcase with Premium Ambient Animations */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-emerald-950 via-teal-900 to-emerald-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] left-[-10%] w-500px h-500px bg-emerald-500/20 rounded-full filter blur-[120px] animate-pulse duration-8000ms" />
        <div className="absolute bottom-[-10%] right-[-10%] w-400px h-400px bg-teal-400/20 rounded-full filter blur-[100px] animate-bounce duration-12000ms opacity-60" />

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
          <div className="pt-4 space-y-4">
            <div className="flex items-start gap-3 transform hover:translate-x-1 transition-transform">
              <div className="p-1 mt-0.5 rounded-md bg-emerald-500/20 text-emerald-400">
                <Zap className="w-4 h-4" />
              </div>
              <p className="text-sm text-emerald-100/90 font-medium">Generate robust context-aware RFPs and contracts instantly.</p>
            </div>
            <div className="flex items-start gap-3 transform hover:translate-x-1 transition-transform">
              <div className="p-1 mt-0.5 rounded-md bg-emerald-500/20 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-sm text-emerald-100/90 font-medium">Vetted templates tailored for modern digital teams.</p>
            </div>
          </div>
        </div>
        <div className="text-xs text-emerald-200/50 relative z-10">&copy; 2026 ProposalPro AI. All rights reserved.</div>
      </div>

      {/* RIGHT SIDE: Content Panel using custom Card UI */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-slate-50">
        <Card className="w-full max-w-md bg-white">
          <CardBody className="p-0 sm:p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="mb-2">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create Account</h2>
                <p className="text-sm text-slate-500 mt-1">Set up your modern workspace credentials.</p>
              </div>

              <Input
                label="Full Name"
                type="text"
                placeholder="Alex Morgan"
                value={form.name}
                error={errors.name}
                onChange={updateField("name")}
              />

              <Input
                label="Email Address"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                error={errors.email}
                onChange={updateField("email")}
              />

              <div className="relative w-full">
                <Input
                  label="Password"
                  type={showPass ? "text" : "password"}
                  placeholder="Minimum 6 characters"
                  value={form.password}
                  error={errors.password}
                  onChange={updateField("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-38px text-slate-400 hover:text-emerald-700 transition-colors p-1"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative w-full">
                <Input
                  label="Confirm Password"
                  type={showConfirmPass ? "text" : "password"}
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  error={errors.confirmPassword}
                  onChange={updateField("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute right-3 top-38px text-slate-400 hover:text-emerald-700 transition-colors p-1"
                >
                  {showConfirmPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 rounded-xl bg-linear-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white font-bold transition-all shadow-xl shadow-emerald-900/10 hover:brightness-110 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center min-h-48px"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                ) : (
                  "Create Free Account"
                )}
              </button>

              <p className="text-center text-sm text-slate-500 mt-2">
                Already have an account?{" "}
                <Link to="/login" className="text-emerald-700 font-bold hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
          </CardBody>
        </Card>
      </div>
      
    </div>
  );
}