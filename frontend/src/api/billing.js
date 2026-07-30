import { request } from './auth.js';

// Subscription & Checkout API Endpoints
export const getBillingDetails = async (token) => {
  const response = await request('/billing/subscription', { token });
  return response?.data || response;
};

export const createCheckoutSession = async ({ priceId, successUrl, cancelUrl }, token) => {
  const response = await request('/billing/checkout-session', {
    method: 'POST',
    body: {
      priceId,
      successUrl,
      cancelUrl,
    },
    token,
  });
  return response?.data || response;
};

export const createCustomerPortal = async (returnUrl, token) => {
  const response = await request('/billing/customer-portal', {
    method: 'POST',
    body: { returnUrl },
    token,
  });
  return response?.data || response;
};

// Internal Billing Records CRUD (for invoices/admin view)
export const createBillingRecord = async (data, token) => {
  const response = await request('/billing', {
    method: 'POST',
    body: data,
    token,
  });
  return response?.data || response;
};

export const getAllBillingRecords = async (token) => {
  const response = await request('/billing', { token });
  return response?.data || response;
};

export const getBillingRecordById = async (id, token) => {
  const response = await request(`/billing/${id}`, { token });
  return response?.data || response;
};

export const updateBillingRecord = async (id, data, token) => {
  const response = await request(`/billing/${id}`, {
    method: 'PUT',
    body: data,
    token,
  });
  return response?.data || response;
};

export const deleteBillingRecord = async (id, token) => {
  const response = await request(`/billing/${id}`, {
    method: 'DELETE',
    token,
  });
  return response?.data || response;
};

// Aliases for backwards compatibility with existing hooks
export const getBillingDetailsApi = getBillingDetails;
export const getSubscriptionStatusApi = getBillingDetails;
export const createCheckoutSessionApi = createCheckoutSession;
export const createCustomerPortalApi = createCustomerPortal;