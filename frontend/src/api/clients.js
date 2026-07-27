import { request, getStoredAuthSession } from "./auth";

const getToken = () => {
  const session = getStoredAuthSession();
  return session?.accessToken || session?.token;
};

export const clientsApi = {
  // GET /api/clients
  getClients: async () => {
    return await request("/clients", {
      method: "GET",
      token: getToken(),
    });
  },

  // GET /api/clients/:id
  getClientById: async (id) => {
    return await request(`/clients/${id}`, {
      method: "GET",
      token: getToken(),
    });
  },

  // POST /api/clients
  createClient: async (clientData) => {
    return await request("/clients", {
      method: "POST",
      body: clientData,
      token: getToken(),
    });
  },

  // PUT /api/clients/:id
  updateClient: async (id, clientData) => {
    return await request(`/clients/${id}`, {
      method: "PUT",
      body: clientData,
      token: getToken(),
    });
  },

  // DELETE /api/clients/:id
  deleteClient: async (id) => {
    return await request(`/clients/${id}`, {
      method: "DELETE",
      token: getToken(),
    });
  },
};

export default clientsApi;