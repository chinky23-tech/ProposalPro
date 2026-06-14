import {
  insertTemplate,
  selectTemplatesByUserId,
  selectTemplateById,
  updateTemplateById,
  deleteTemplateById
} from "../repositories/templates.repository.js";

export const createTemplateService = async (userId, templateData) => {
  return await insertTemplate({ user_id: userId, ...templateData });
};

export const getTemplatesByUserService = async (userId) => {
  return await selectTemplatesByUserId(userId);
};

export const getTemplateByIdService = async (userId, templateId) => {
  const template = await selectTemplateById(templateId);

  if (!template) {
    const error = new Error("Template not found");
    error.statusCode = 404;
    throw error;
  }

  if (template.user_id !== userId) {
    const error = new Error("Forbidden: You do not own this document template");
    error.statusCode = 403;
    throw error;
  }

  return template;
};

export const updateTemplateService = async (userId, templateId, templateData) => {
  await getTemplateByIdService(userId, templateId);
  return await updateTemplateById(templateId, templateData);
};

export const deleteTemplateService = async (userId, templateId) => {
  await getTemplateByIdService(userId, templateId);
  return await deleteTemplateById(templateId);
};