import { request, getStoredAuthSession } from "./auth";

const getToken = () => {
  const session = getStoredAuthSession();
  return session?.accessToken || session?.token;
};

export const documentsApi = {
  // Fetch list of documents (GET /api/documents)
  getDocuments: async () => {
    return await request("/documents", {
      method: "GET",
      token: getToken(),
    });
  },

  // Upload Document (POST /api/documents/upload)
  uploadDocument: async (formData) => {
    // Note: Custom fetch implementation for FormData upload
    const sessionToken = getToken();
    const baseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5001/api').replace(/\/$/, '');

    const response = await fetch(`${baseUrl}/documents/upload`, {
      method: "POST",
      headers: {
        ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
      },
      body: formData, // Send FormData as-is without JSON.stringify
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || "Failed to upload document");
    }

    return data;
  },

  // Download / View URL (GET /api/documents/{id}/download)
  getDownloadUrl: async (id) => {
    return await request(`/documents/${id}/download`, {
      method: "GET",
      token: getToken(),
    });
  },

  // Delete Document (DELETE /api/documents/{id})
  deleteDocument: async (id) => {
    return await request(`/documents/${id}`, {
      method: "DELETE",
      token: getToken(),
    });
  },
};

export default documentsApi;