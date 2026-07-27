import { useState, useEffect, useCallback, useMemo } from "react";
import clientsApi from "/src/api/clients.js";

// Helper function to safely extract address from various potential API keys
const normalizeClient = (client) => {
  if (!client) return client;
  return {
    ...client,
    // Safely fallback to common address keys returned by backends
    address:
      client.address ||
      client.street_address ||
      client.location ||
      client.addr ||
      (typeof client.address === "object" ? client.address?.street : "") ||
      "",
  };
};

export const useClients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // Modal & Submit States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // View Modal State
  const [viewingClient, setViewingClient] = useState(null);

  // Delete Confirmation States
  const [clientToDelete, setClientToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = useCallback((message, type = "success") => {
    setToast({ show: true, message, type });
  }, []);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, show: false }));
  }, []);

  // Fetch clients from API
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientsApi.getClients();

      const rawList = Array.isArray(response)
        ? response
        : response?.data || response?.clients || [];

      // Normalize address on every client record
      const normalizedList = rawList.map(normalizeClient);

      setClients(normalizedList);
    } catch (err) {
      setError(err?.message || "Failed to load clients list");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Filter clients by search query
  const filteredClients = useMemo(() => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return clients;

    return clients.filter(
      (client) =>
        client.name?.toLowerCase().includes(term) ||
        client.email?.toLowerCase().includes(term) ||
        client.company?.toLowerCase().includes(term) ||
        client.address?.toLowerCase().includes(term)
    );
  }, [clients, searchQuery]);

  // Handle Create or Update Client
  const handleSaveClient = async (formData) => {
    try {
      setSubmitLoading(true);

      // Explicitly map form address to ensure backend payloads receive it
      const payload = {
        ...formData,
        address: formData.address || "",
      };

      if (editingClient) {
        await clientsApi.updateClient(editingClient.id, payload);
        showToast("Client profile updated successfully!", "success");
      } else {
        await clientsApi.createClient(payload);
        showToast("New client created successfully!", "success");
      }

      setIsModalOpen(false);
      setEditingClient(null);
      await fetchClients();
    } catch (err) {
      showToast(err?.message || "Operation failed. Please try again.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Confirm and Execute Delete
  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;

    try {
      setDeleteLoading(true);
      await clientsApi.deleteClient(clientToDelete.id);
      showToast(`Client "${clientToDelete.name}" deleted successfully.`, "success");
      setClientToDelete(null);
      await fetchClients();
    } catch (err) {
      showToast(err?.message || "Failed to delete client", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // Modal Handlers
  const handleOpenEditModal = (client) => {
    setEditingClient(normalizeClient(client));
    setIsModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
  };

  // View Handlers
  const handleOpenViewModal = (client) => {
    setViewingClient(normalizeClient(client));
  };

  const handleCloseViewModal = () => {
    setViewingClient(null);
  };

  return {
    clients: filteredClients,
    rawClients: clients,
    loading,
    searchQuery,
    setSearchQuery,
    error,
    toast,
    hideToast,
    isModalOpen,
    editingClient,
    submitLoading,
    clientToDelete,
    setClientToDelete,
    deleteLoading,
    viewingClient,
    fetchClients,
    handleSaveClient,
    confirmDeleteClient,
    handleOpenEditModal,
    handleOpenCreateModal,
    handleCloseModal,
    handleOpenViewModal,
    handleCloseViewModal,
  };
};

export default useClients;