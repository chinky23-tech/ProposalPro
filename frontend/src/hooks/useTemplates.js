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
  // 🛠️ Update the deleteTemplate method inside useTemplates.js:
const deleteTemplate = async (id) => {
  try {
    setError("");
    
    // Extract numerical value clearly even if an object structure leaked down
    const cleanId = typeof id === 'object' ? id?.id : id;
    const parsedIntId = Number(cleanId);
    
    if (isNaN(parsedIntId)) {
      throw new Error(`Invalid identification token parameter received: ${id}`);
    }

    await templatesApi.deleteTemplate(parsedIntId, getToken());
    
    // Optimistically update UI list state
    setTemplates((prev) => prev.filter((t) => Number(t.id) !== parsedIntId));
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