import React, { useState, useEffect } from "react";
import { Plus, Search, Layers, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

import packagesApi from "../../../api/packages.js";
import { getStoredAuthSession } from "../../../api/auth.js";

import PackageList from "../../../components/packages/PackageList.jsx";
import PackageModal from "../../../components/packages/PackageModal.jsx";
import PackageDetails from "../../../components/packages/PackageDetails.jsx";

export default function PackagesView() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [viewingPackage, setViewingPackage] = useState(null);

  const getToken = () => {
    const session = getStoredAuthSession();
    return session?.accessToken || session?.token;
  };

  const fetchPackages = async () => {
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
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleCreateOrUpdate = async (formData) => {
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

      setIsModalOpen(false);
      setSelectedPackage(null);
      fetchPackages();
    } catch (err) {
      toast.error(err?.message || "Failed to save package tier");
    } finally {
      setSubmitting(false);
    }
  };

// inside frontend/src/pages/dashboard/views/Packages.jsx

const handleDelete = (id) => {
  // 🌟 Modern Toast Confirmation instead of browser window.confirm
  toast(
    ({ closeToast }) => (
      <div className="space-y-3 p-1">
        <div className="space-y-1">
          <p className="text-xs font-bold text-white">Delete Package Tier?</p>
          <p className="text-[11px] text-slate-400">
            This action cannot be undone. Are you sure you want to proceed?
          </p>
        </div>
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={closeToast}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition-colors flex-1"
          >
            Cancel
          </button>
          <button
            onClick={async () => {
              closeToast();
              confirmDelete(id);
            }}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-[11px] font-semibold transition-colors flex-1 shadow-md shadow-rose-900/30"
          >
            Delete
          </button>
        </div>
      </div>
    ),
    {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      icon: false,
      style: {
        background: "#0f172a", // matches slate-900
        border: "1px solid #1e293b", // matches slate-800
        borderRadius: "1rem",
      },
    }
  );
};

const confirmDelete = async (id) => {
  try {
    const token = getToken();
    await packagesApi.deletePackage(id, token);
    toast.success("Package tier deleted successfully!");
    fetchPackages();
  } catch (err) {
    toast.error(err?.message || "Failed to delete package");
  }
};

  const filteredPackages = packages.filter((pkg) =>
    pkg.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-slate-100 max-w-7xl mx-auto p-2 sm:p-6">
      
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Layers className="w-6 h-6 text-emerald-400" /> Service Packages
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure reusable service tiers and pricing packages to include in client proposals.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedPackage(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-5 h-10 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-lg shadow-emerald-900/20"
        >
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>

      {/* Search & Actions Utility Row */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search package tiers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>

        <button
          onClick={fetchPackages}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
          title="Refresh List"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Package List Display */}
      <PackageList
        packages={filteredPackages}
        loading={loading}
        onView={(pkg) => setViewingPackage(pkg)}
        onEdit={(pkg) => {
          setSelectedPackage(pkg);
          setIsModalOpen(true);
        }}
        onDelete={handleDelete}
      />

      {/* Create / Edit Form Modal */}
      <PackageModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPackage(null);
        }}
        onSubmit={handleCreateOrUpdate}
        initialData={selectedPackage}
        loading={submitting}
      />

      {/* Detailed Spec Inspection Modal */}
      <PackageDetails
        packageItem={viewingPackage}
        onClose={() => setViewingPackage(null)}
        onEdit={(pkg) => {
          setSelectedPackage(pkg);
          setIsModalOpen(true);
        }}
      />

    </div>
  );
}