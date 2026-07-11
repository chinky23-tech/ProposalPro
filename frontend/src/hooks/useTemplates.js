import { useEffect, useState } from "react";
import templatesApi from "../api/templates";
import { getStoredAuthSession } from "../api/auth";

export const useTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => {
    const session = getStoredAuthSession();
    return session?.accessToken || session?.token;
  };

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await templatesApi.getTemplates(getToken());
      const data = response?.data || response || [];
      setTemplates(data);
    } catch (err) {
      setError(err.message || "Failed to load templates");
    } finally {
      setLoading(false);
    }
  };

  // ➕ POST /api/templates
  const createTemplate = async (templateData) => {
    try {
      setError("");
      const response = await templatesApi.createTemplate(templateData, getToken());
      return response?.data || response;
    } catch (err) {
      setError(err.message || "Failed to create template");
      throw err;
    }
  };

  // ➕ PUT /api/templates/{id}
  const updateTemplate = async (id, templateData) => {
    try {
      setError("");
      const response = await templatesApi.updateTemplate(id, templateData, getToken());
      return response?.data || response;
    } catch (err) {
      setError(err.message || "Failed to update template");
      throw err;
    }
  };

  // ➕ DELETE /api/templates/{id}
  const deleteTemplate = async (id) => {
    try {
      setError("");
      await templatesApi.deleteTemplate(id, getToken());
      // Optimistically update UI state list
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete template");
      throw err;
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  return {
    templates,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    refresh: loadTemplates, // We match this below
  };
};

export default useTemplates;