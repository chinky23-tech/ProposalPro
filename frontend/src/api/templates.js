import { request } from "./auth";

export const templatesApi = {
  getTemplates: (token) =>
    request("/templates", {
      token,
    }),

  getTemplateById: (
    id,
    token
  ) =>
    request(`/templates/${id}`, {
      token,
    }),

  createTemplate: (
    template,
    token
  ) =>
    request("/templates", {
      method: "POST",
      body: template,
      token,
    }),

  updateTemplate: (
    id,
    template,
    token
  ) =>
    request(`/templates/${id}`, {
      method: "PUT",
      body: template,
      token,
    }),

  deleteTemplate: (
    id,
    token
  ) =>
    request(`/templates/${id}`, {
      method: "DELETE",
      token,
    }),
};

export default templatesApi;