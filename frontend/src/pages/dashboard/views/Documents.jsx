import React, { useState, useEffect, useMemo } from "react";
import {
  FileText,
  UploadCloud,
  Search,
  Download,
  Trash2,
  Eye,
  File,
  Image as ImageIcon,
  FileCode,
  HardDrive
} from "lucide-react";
import { toast } from "react-toastify";
import documentsApi from "../../../api/documents";
import { getStoredAuthSession } from "../../../api/auth";
import UploadDocumentModal from "../../../components/documents/UploadDocumentModal";

export default function Documents() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getToken = () => {
    const session = getStoredAuthSession();
    return session?.accessToken || session?.token;
  };

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const res = await documentsApi.getDocuments(getToken());
      setDocuments(res.data || res || []);
    } catch (err) {
      toast.error(err.message || "Failed to fetch documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Filtered List
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) =>
      (doc.name || doc.filename || "Untitled").toLowerCase().includes(search.toLowerCase())
    );
  }, [documents, search]);

  // Upload Action (POST /api/documents/upload)
  const handleUpload = async (formData) => {
    try {
      setUploading(true);
      await documentsApi.uploadDocument(formData, getToken());
      toast.success("Document uploaded successfully!");
      setIsModalOpen(false);
      fetchDocuments();
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Download / View Action (GET /api/documents/{id}/download)
  const handleDownload = async (doc) => {
    try {
      const res = await documentsApi.getDownloadUrl(doc.id, getToken());
      const downloadUrl = res.url || res.downloadUrl || res.data;
      if (downloadUrl) {
        window.open(downloadUrl, "_blank");
      } else {
        toast.error("Download URL not found");
      }
    } catch (err) {
      toast.error(err.message || "Failed to retrieve download link");
    }
  };

  // Delete Action (DELETE /api/documents/{id})
  const handleDelete = (docId) => {
    toast(
      ({ closeToast }) => (
        <div className="space-y-3 p-1">
          <p className="text-xs font-bold text-white">Delete Document?</p>
          <p className="text-[11px] text-slate-400">
            This will permanently remove the file from cloud storage.
          </p>
          <div className="flex gap-2">
            <button
              onClick={closeToast}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-[11px] font-semibold flex-1"
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                closeToast();
                try {
                  await documentsApi.deleteDocument(docId, getToken());
                  toast.success("Document deleted");
                  fetchDocuments();
                } catch (err) {
                  toast.error(err.message || "Failed to delete document");
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-600 text-white text-[11px] font-semibold flex-1"
            >
              Delete
            </button>
          </div>
        </div>
      ),
      {
        autoClose: false,
        style: { background: "#0f172a", border: "1px solid #1e293b", borderRadius: "1rem" },
      }
    );
  };

  // Dynamic File Icon Selector
  const getFileIcon = (mimeType = "", filename = "") => {
    if (mimeType.includes("image") || /\.(jpg|jpeg|png|webp)$/i.test(filename)) {
      return <ImageIcon className="w-5 h-5 text-violet-400" />;
    }
    if (mimeType.includes("pdf") || /\.pdf$/i.test(filename)) {
      return <FileText className="w-5 h-5 text-rose-400" />;
    }
    return <FileCode className="w-5 h-5 text-emerald-400" />;
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Documents</h1>
          <p className="mt-1 text-slate-400 text-sm">
            Upload, store, and manage proposal assets and client attachments.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20 shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          Upload Document
        </button>
      </div>

      {/* Search Toolbar */}
      <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl px-3.5 py-2">
        <Search className="w-4 h-4 text-slate-500 mr-2" />
        <input
          type="text"
          placeholder="Search documents by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
        />
      </div>

      {/* Document Grid */}
      {loading ? (
        <div className="flex items-center justify-center min-h-300px text-slate-500 text-xs">
          Loading documents...
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-300px bg-slate-900/50 border border-slate-800/80 rounded-3xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center text-slate-400">
            <HardDrive className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-white">No documents found</p>
          <p className="text-xs text-slate-500 max-w-sm">
            Upload contract PDFs, design mockups, or project spec sheets to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="group bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-3xl p-5 flex flex-col justify-between transition-all hover:shadow-lg hover:shadow-emerald-950/20"
            >
              <div>
                {/* File Header Icon & Actions */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center">
                    {getFileIcon(doc.mime_type, doc.name || doc.filename)}
                  </div>

                  <div className="flex items-center gap-2 text-slate-400">
                    <button
                      onClick={() => handleDownload(doc)}
                      className="hover:text-emerald-400 transition-colors p-1"
                      title="Download / View"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="hover:text-rose-400 transition-colors p-1"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Name & Details */}
                <h3 className="font-bold text-white text-sm truncate">
                  {doc.name || doc.filename || "Untitled File"}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">
                  Uploaded {doc.created_at ? new Date(doc.created_at).toLocaleDateString() : "Recently"}
                </p>
              </div>

              {/* Bottom Quick Download Button */}
              <div className="mt-5 pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => handleDownload(doc)}
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl py-2 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  Download File
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <UploadDocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpload={handleUpload}
        loading={uploading}
      />

    </div>
  );
}