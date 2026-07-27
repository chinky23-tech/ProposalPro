import React, { useState, useEffect } from "react";
import { 
  Users, Plus, Search, Mail, Phone, Building, 
  MapPin, Edit2, Trash2, Loader2, AlertCircle, CheckCircle2, X, AlertTriangle 
} from "lucide-react";
import clientsApi from "/src/api/clients.js";
import ClientModal from "/src/components/clients/ClientModal.jsx";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Delete Confirmation State (Replaces window.confirm)
  const [clientToDelete, setClientToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Fetch clients on page load
  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await clientsApi.getClients();
      
      const dataList = Array.isArray(response) 
        ? response 
        : response?.data || response?.clients || [];
      
      setClients(dataList);
    } catch (err) {
      setError(err?.message || "Failed to load clients list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filter clients by search term
  const filteredClients = clients.filter((client) => {
    const term = searchQuery.toLowerCase();
    return (
      client.name?.toLowerCase().includes(term) ||
      client.email?.toLowerCase().includes(term) ||
      client.company?.toLowerCase().includes(term)
    );
  });

  // Handle Create or Update submission
  const handleSaveClient = async (formData) => {
    try {
      setSubmitLoading(true);
      if (editingClient) {
        await clientsApi.updateClient(editingClient.id, formData);
        showToast("Client profile updated successfully!", "success");
      } else {
        await clientsApi.createClient(formData);
        showToast("New client created successfully!", "success");
      }
      setIsModalOpen(false);
      setEditingClient(null);
      fetchClients();
    } catch (err) {
      showToast(err?.message || "Operation failed. Please try again.", "error");
    } finally {
      setSubmitLoading(false);
    }
  };

  // Confirm and execute delete action
  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;

    try {
      setDeleteLoading(true);
      await clientsApi.deleteClient(clientToDelete.id);
      showToast(`Client "${clientToDelete.name}" deleted successfully.`, "success");
      setClientToDelete(null);
      fetchClients();
    } catch (err) {
      showToast(err?.message || "Failed to delete client", "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 space-y-8">
      
      {/* Toast Notification Popup */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl animate-in slide-in-from-bottom-5 fade-in duration-300">
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs font-medium text-slate-200 pr-2">
            {toast.message}
          </span>
          <button
            onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal (Replaces Browser Alert) */}
      {clientToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="font-bold text-white text-base">Delete Client?</h3>
              <p className="text-xs text-slate-400">
                Are you sure you want to delete <span className="text-slate-200 font-semibold">"{clientToDelete.name}"</span>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setClientToDelete(null)}
                className="w-1/2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteClient}
                disabled={deleteLoading}
                className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-900/20"
              >
                {deleteLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Clients Directory</h1>
          </div>
          <p className="text-xs text-slate-400 pl-13">
            Manage client profiles, contact information, and proposals.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingClient(null);
            setIsModalOpen(true);
          }}
          className="self-start md:self-auto px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-4 bg-slate-900 border border-slate-800 p-2 rounded-2xl max-w-md">
        <Search className="w-4 h-4 text-slate-500 ml-2 shrink-0" />
        <input
          type="text"
          placeholder="Search by name, email, or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-xs text-white placeholder:text-slate-500 focus:outline-none"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Client List / Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 bg-slate-900/50 border border-slate-800/60 rounded-3xl animate-pulse p-5" />
          ))}
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="border border-dashed border-slate-800 bg-slate-900/30 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3">
          <Users className="w-10 h-10 text-slate-600" />
          <p className="text-sm font-semibold text-slate-300">No clients found</p>
          <p className="text-xs text-slate-500 max-w-xs">
            {searchQuery ? "Try refining your search keyword." : "Get started by adding your first client profile."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-3xl p-5 flex flex-col justify-between space-y-4 transition-all group"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-0.5 truncate">
                  <h3 className="font-bold text-white text-sm truncate group-hover:text-emerald-400 transition-colors">
                    {client.name}
                  </h3>
                  {client.company && (
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                      <Building className="w-3 h-3 text-slate-500" />
                      <span className="truncate">{client.company}</span>
                    </div>
                  )}
                </div>

                {/* Card Actions */}
                <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingClient(client);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-emerald-400 transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setClientToDelete(client)}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Card Contact Details */}
              <div className="space-y-2 pt-2 border-t border-slate-800/60 text-xs text-slate-300">
                <div className="flex items-center gap-2 text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-start gap-2 text-slate-400 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                    <span className="truncate">{client.address}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Client Edit/Add Modal */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
        }}
        onSubmit={handleSaveClient}
        initialData={editingClient}
        loading={submitLoading}
      />
    </div>
  );
}