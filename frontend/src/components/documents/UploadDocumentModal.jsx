import React, { useState } from "react";
import { X, UploadCloud, File, Check, ChevronDown } from "lucide-react";

export default function UploadDocumentModal({ isOpen, onClose, onUpload, loading }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileType, setFileType] = useState("PDF");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (!isOpen) return null;

  const CATEGORY_OPTIONS = [
    { value: "PDF", label: "PDF Document" },
    { value: "IMAGE", label: "Image (PNG, JPG, WebP)" },
    { value: "CONTRACT", label: "Contract" },
    { value: "CASE_STUDY", label: "Case Study" },
    { value: "PRICING", label: "Pricing Sheet" },
  ];

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("fileType", fileType); // 👈 Satisfies backend validator requirement

    onUpload(formData);
  };

  const selectedCategoryLabel =
    CATEGORY_OPTIONS.find((opt) => opt.value === fileType)?.label || "Select Category";

  return (
    <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <UploadCloud className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-white text-lg">Upload Document</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Custom Dropdown UI Component */}
          <div className="relative space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Document Category
            </label>
            
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white flex items-center justify-between transition-colors focus:outline-none"
            >
              <span className="font-medium">{selectedCategoryLabel}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180 text-emerald-400" : ""
                }`}
              />
            </button>

            {/* Custom Dropdown Menu List */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-slate-950 border border-slate-800 rounded-2xl p-1.5 shadow-xl space-y-0.5 max-h-48 overflow-y-auto">
                {CATEGORY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setFileType(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      fileType === option.value
                        ? "bg-emerald-500/10 text-emerald-400 font-semibold"
                        : "text-slate-300 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <span>{option.label}</span>
                    {fileType === option.value && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* File Selector Area */}
          <div className="border-2 border-dashed border-slate-800 hover:border-slate-700 bg-slate-950 rounded-2xl p-6 flex flex-col items-center justify-center text-center transition-colors">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".pdf,.png,.jpg,.jpeg,.webp"
              onChange={handleFileChange}
            />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <p className="text-xs font-semibold text-white">Click to select file</p>
                <p className="text-[11px] text-slate-500">PDF, PNG, JPG, WebP up to 15MB</p>
              </div>
            </label>
          </div>

          {/* Selected File Card */}
          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2.5 truncate">
                <File className="w-4 h-4 text-emerald-400 shrink-0" />
                <div className="truncate">
                  <p className="text-xs font-medium text-white truncate">{selectedFile.name}</p>
                  <p className="text-[10px] text-slate-500">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="text-slate-500 hover:text-rose-400 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedFile || loading}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-lg shadow-emerald-900/20"
            >
              {loading ? "Uploading to S3..." : "Upload File"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}