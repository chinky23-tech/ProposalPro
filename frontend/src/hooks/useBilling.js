/*import { useState, useEffect, useCallback } from "react";
import { 
  getSubscriptionStatusApi, 
  createCheckoutSessionApi, 
  createCustomerPortalApi 
} from "../api/billing";
import { getStoredAuthSession } from "../api/auth";

export const useBilling = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getToken = () => {
    const session = getStoredAuthSession();
    return session?.accessToken || session?.token;
  };

  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }
      const data = await getSubscriptionStatusApi(token);
      setSubscription(data);
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Failed to load subscription details");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const handleSubscribe = async (priceId) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }
      const { checkoutUrl } = await createCheckoutSessionApi({
        priceId,
        successUrl: `${window.location.origin}/dashboard/settings/billing?status=success`,
        cancelUrl: `${window.location.origin}/dashboard/settings/billing?status=cancelled`
      }, token);
      window.location.href = checkoutUrl; // Redirect to Stripe Hosted Checkout
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Could not initiate checkout");
    }
  };

  const handleManageSubscription = async () => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error("Authentication token not found");
      }
      const { portalUrl } = await createCustomerPortalApi(window.location.href, token);
      window.location.href = portalUrl; // Redirect to Stripe Billing Portal
    } catch (err) {
      alert(err?.response?.data?.message || err?.message || "Could not open billing portal");
    }
  };

  return {
    subscription,
    loading,
    error,
    refresh: fetchSubscription,
    handleSubscribe,
    handleManageSubscription
  };
};*/
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { 
  getBillingDetails, 
  createCheckoutSession, 
  createCustomerPortal 
} from "../api/billing.js";
import { getStoredAuthSession } from "../api/auth.js"; // Import session helper

export const useBilling = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper function to extract token safely
  const getToken = () => {
    const session = getStoredAuthSession();
    return session?.token || session?.accessToken || null;
  };

  useEffect(() => {
    fetchBilling();
  }, []);

  const fetchBilling = async () => {
    const token = getToken();
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await getBillingDetails(token); // 👈 PASS TOKEN HERE
      setSubscription(data);
    } catch (err) {
      toast.error(err.message || "Failed to load billing details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (priceId) => {
    const token = getToken();
    if (!token) {
      toast.error("Please log in to upgrade your subscription.");
      return;
    }

    if (!priceId) {
      toast.error("Invalid Price ID configuration.");
      return;
    }

    try {
      await toast.promise(
        (async () => {
          const data = await createCheckoutSession(
            { 
              priceId, 
              successUrl: `${window.location.origin}/dashboard/billing?success=true`,
              cancelUrl: `${window.location.origin}/dashboard/billing?canceled=true`
            }, 
            token // 👈 PASS TOKEN HERE
          );
          if (data?.checkoutUrl) {
            window.location.href = data.checkoutUrl;
          } else {
            throw new Error("Invalid response from checkout service");
          }
        })(),
        {
          pending: "Preparing checkout session...",
          success: "Redirecting to Stripe...",
          error: "Checkout failed. Please try again.",
        }
      );
    } catch (err) {
      // Handled by toast.promise
    }
  };

  const handleManageSubscription = async () => {
    const token = getToken();
    if (!token) {
      toast.error("Please log in to manage your billing.");
      return;
    }

    try {
      await toast.promise(
        (async () => {
          const returnUrl = `${window.location.origin}/dashboard/billing`;
          const data = await createCustomerPortal(returnUrl, token); // 👈 PASS TOKEN HERE
          if (data?.portalUrl) {
            window.location.href = data.portalUrl;
          } else {
            throw new Error("Could not fetch billing portal URL");
          }
        })(),
        {
          pending: "Opening billing portal...",
          success: "Redirecting to Stripe portal...",
          error: "Could not open customer portal.",
        }
      );
    } catch (err) {
      // Handled by toast.promise
    }
  };

  return {
    subscription,
    loading,
    fetchBilling,
    handleSubscribe,
    handleManageSubscription,
  };
};