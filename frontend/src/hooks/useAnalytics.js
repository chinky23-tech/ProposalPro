import { useState, useEffect, useCallback } from "react";
import analyticsApi from "../api/analytics";
import { getStoredAuthSession } from "../api/auth"; // 👈 Import session helper

export const useAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Retrieve stored auth object ('proposalpro.auth')
      const session = getStoredAuthSession();

      // 2. Extract the token safely (handles session.token or session.accessToken)
      const token = session?.token || session?.accessToken;

      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      // 3. Call API with token
      const response = await analyticsApi.getAnalytics(token);

      const summaryData = response?.data || response || {};
      setData(summaryData);
    } catch (err) {
      const msg = err?.message || err?.response?.data?.message || "Failed to load analytics";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { data, loading, error, refetch: fetchAnalytics };
};