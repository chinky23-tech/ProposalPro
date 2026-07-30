import React, { useEffect } from "react";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";
import { useBilling } from "../../../hooks/useBilling";
import { UsageProgressBar } from "../../../components/billing/UsageProgressBar";
import { PricingCard } from "../../../components/billing/PricingCard";

// Reads Price ID directly from environment variables
const PRO_PRICE_ID =
  import.meta.env.VITE_STRIPE_PRO_PRICE_ID ||
  process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID;

const PLANS = [
  {
    title: "Starter / Free",
    price: 0,
    priceId: null,
    features: [
      "3 AI Proposal Generations/mo",
      "Basic Document Export",
      "Public Proposal Links",
    ],
  },
  {
    title: "Pro Agency",
    price: 29,
    priceId: PRO_PRICE_ID,
    popular: true,
    features: [
      "100 AI Proposal Generations/mo",
      "Custom Branding & Logo Settings",
      "Real-time Proposal Open Tracking",
      "Priority Email Support",
    ],
  },
];

export default function BillingPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { 
    subscription, 
    loading, 
    fetchBilling, // Make sure fetchBilling is exposed from useBilling hook
    handleSubscribe, 
    handleManageSubscription 
  } = useBilling();

  // Handle Stripe Success Return
  useEffect(() => {
    if (searchParams.get("success") === "true") {
      toast.success("Payment successful! Updating your plan details...");
      
      // Delay fetch slightly to allow backend webhook processing
      const timer = setTimeout(() => {
        if (fetchBilling) fetchBilling();
      }, 2000);

      // Clean up search params from URL after handling
      setSearchParams({}, { replace: true });

      return () => clearTimeout(timer);
    }
  }, [searchParams, fetchBilling, setSearchParams]);

  if (loading) {
    return (
      <div className="flex min-h-400px items-center justify-center p-8">
        <div className="flex items-center gap-3 text-slate-300 font-medium">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-400 border-t-transparent" />
          <span>Loading billing details...</span>
        </div>
      </div>
    );
  }

  const currentPlan = subscription?.plan || "FREE";
  const statusLabel = subscription?.status || "Active";
  const billingNote =
    currentPlan === "FREE"
      ? "Enjoy your free tier with up to 3 AI proposals per month."
      : "Your Pro plan includes premium features and higher usage limits.";

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950/95 p-8 shadow-xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Billing & Subscriptions</h1>
            <p className="text-sm text-slate-400 max-w-2xl mt-1">
              Manage your subscription, billing portal, and AI proposal usage limits in one place.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300">
              {currentPlan} plan
            </div>
            <div className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
              {statusLabel}
            </div>
            {subscription?.stripeSubscriptionId && (
              <button
                onClick={handleManageSubscription}
                className="border border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Manage billing
              </button>
            )}
          </div>
        </div>

        {/* Plan Overview Metrics */}
        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/70 p-6 grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 font-semibold">Current plan</p>
            <p className="text-xl font-bold text-white">{currentPlan}</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 font-semibold">Billing status</p>
            <p className="text-xl font-bold text-white">{statusLabel}</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500 font-semibold">AI quota</p>
            <p className="text-xl font-bold text-white">
              {subscription?.aiProposalsUsed || 0} / {subscription?.aiProposalLimit || 3}
            </p>
          </div>
        </div>

        <p className="mt-6 text-sm leading-6 text-slate-400">{billingNote}</p>
      </div>

      {/* Progress Bar */}
      <UsageProgressBar
        used={subscription?.aiProposalsUsed || 0}
        limit={subscription?.aiProposalLimit || 3}
      />

      {/* Available Plans */}
      <div className="rounded-3xl border border-slate-800 bg-slate-950/95 p-8 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-100">Available Plans</h2>
            <p className="text-sm text-slate-500">Choose the best plan for your workflow.</p>
          </div>
          <div className="text-sm text-slate-400">
            Current plan: <span className="font-semibold text-slate-100">{currentPlan}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PLANS.map((plan) => (
            <PricingCard
              key={plan.title}
              title={plan.title}
              price={plan.price}
              priceId={plan.priceId}
              features={plan.features}
              popular={plan.popular}
              isCurrentPlan={
                (plan.priceId === null && currentPlan === "FREE") ||
                (currentPlan === "PRO" && plan.priceId !== null)
              }
              onSelect={(pId) => {
                if (!pId && plan.price !== 0) {
                  toast.error("Stripe Price ID is missing in configuration");
                  return;
                }
                handleSubscribe(pId);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}