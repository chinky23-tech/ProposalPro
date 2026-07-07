import { useEffect, useState, useCallback } from "react";
import proposalsApi from "../api/proposals";
import { getStoredAuthSession } from "../api/auth";

export const useProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => {
    const session = getStoredAuthSession();

    return (
      session?.accessToken ||
      session?.token
    );
  };

  const loadProposals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data =
        await proposalsApi.getProposals(
          getToken()
        );

      setProposals(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to load proposals"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProposals();
  }, [loadProposals]);

  return {
    proposals,
    loading,
    error,
    refresh: loadProposals,
    setProposals,
  };
};