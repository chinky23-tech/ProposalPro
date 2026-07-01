import { useEffect, useState } from "react";

import analyticsApi from "../api/analytics";
import proposalsApi from "../api/proposals";
import clientsApi from "../api/clients";

import { getStoredAuthSession } from "../api/auth";

export const useDashboard = () => {
  const [loading, setLoading] =
    useState(true);

  const [analytics, setAnalytics] =
    useState(null);

  const [proposals, setProposals] =
    useState([]);

  const [clients, setClients] =
    useState([]);

  const [error, setError] =
    useState(null);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const session =
        getStoredAuthSession();

      const token =
        session?.accessToken ||
        session?.token;

      const [
        analyticsData,
        proposalsData,
        clientsData,
      ] = await Promise.all([
        analyticsApi.getAnalytics(token),
        proposalsApi.getProposals(token),
        clientsApi.getClients(token),
      ]);

      setAnalytics(analyticsData);

      setProposals(
        proposalsData || []
      );

      setClients(
        clientsData?.data || []
      );
    } catch (error) {
      console.error(error);

      setError(
        "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    analytics,
    proposals,
    clients,
    refresh: fetchDashboard,
  };
};