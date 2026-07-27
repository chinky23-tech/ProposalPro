import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import packagesApi from "../api/packages.js";
import { getStoredAuthSession } from "../api/auth.js";

/**
 * Custom hook to manage Package state and API interactions
 */
export const usePackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Helper to extract authentication token from stored session
  const getToken = () => {
    const session = getStoredAuthSession();
    return session?.accessToken || session?.token;
  };

  // Fetch all package tiers
  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await packagesApi.getAllPackages(token);

      const payload = response?.data || response;
      setPackages(Array.isArray(payload) ? payload : []);
    } catch (err) {
      console.error("Fetch Packages Error:", err);
      toast.error(err?.message || "Failed to load service packages");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch on mount
  useEffect(() => {
    fetchPackages();
  }, [fetchPackages]);

  // Handles both Create and Update operations
  const handleSavePackage = async (formData, selectedPackage) => {
    setSubmitting(true);
    const token = getToken();

    try {
      if (selectedPackage) {
        const id = selectedPackage.id || selectedPackage._id;
        await packagesApi.updatePackage(id, formData, token);
        toast.success("Package updated successfully!");
      } else {
        await packagesApi.createPackage(formData, token);
        toast.success("Package tier created!");
      }

      await fetchPackages();
      return true; // Indicates success to close modal in UI component
    } catch (err) {
      toast.error(err?.message || "Failed to save package tier");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  // Handles Package Deletion
  const confirmDelete = async (id) => {
    try {
      const token = getToken();
      await packagesApi.deletePackage(id, token);
      toast.success("Package tier deleted successfully!");
      await fetchPackages();
    } catch (err) {
      toast.error(err?.message || "Failed to delete package");
    }
  };

  return {
    packages,
    loading,
    submitting,
    fetchPackages,
    handleSavePackage,
    confirmDelete,
  };
};

export default usePackages;