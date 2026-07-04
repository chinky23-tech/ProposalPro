import { useEffect, useState } from "react";
import proposalsApi from "../api/proposals";
import { getStoredAuthSession } from "../api/auth";

export const useProposals = () => {
  const [proposals, setProposals] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const token =
    getStoredAuthSession()?.token ||
    getStoredAuthSession()?.accessToken;

  const loadProposals = async () => {
    try {
      setLoading(true);

      const data =
        await proposalsApi.getProposals(
          token
        );

      setProposals(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProposals();
  }, []);

  return {
    proposals,
    loading,
    error,
    refresh: loadProposals,
  };
};