import { request } from "./auth";

export const analyticsApi = {
  getAnalytics: (token) =>
    request("/analytics", {
      token,
    }),
};

export default analyticsApi;
