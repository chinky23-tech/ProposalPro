import { request } from "./auth";

export const clientsApi = {
  getClients: (token) =>
    request("/proposals/clients", {
      token,
    }),
};

export default clientsApi;
