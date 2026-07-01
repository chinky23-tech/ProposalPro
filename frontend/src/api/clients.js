import { request } from "./auth";

export const clientsApi = {
  getClients: (token) =>
    request("/clients", {
      token,
    }),
};

export default clientsApi;
