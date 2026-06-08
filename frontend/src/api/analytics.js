import { request } from "./auth";

export const analyticsApi = {
  getAnalytics: (token) =>
    request("/proposals/analytics", {
      token,
    }),
};

export default analyticsApi;
