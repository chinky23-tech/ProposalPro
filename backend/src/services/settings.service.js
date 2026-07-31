import bcrypt from "bcrypt";
import {
  getUserSettingsRepo,
  updateUserProfileRepo,
  getUserPasswordHashRepo,
  updateUserPasswordRepo,
  upsertWorkspaceSettingsRepo,
  upsertNotificationPreferencesRepo,
} from "../repositories/settings.repository.js";

export const getSettingsService = async (userId) => {
  const settings = await getUserSettingsRepo(userId);
  if (!settings) {
    throw new Error("Settings not found for user.");
  }
  return settings;
};

export const updateProfileService = async (userId, profileData) => {
  return await updateUserProfileRepo(userId, profileData);
};

export const updateWorkspaceSettingsService = async (userId, workspaceData) => {
  return await upsertWorkspaceSettingsRepo(userId, workspaceData);
};

export const updateNotificationPreferencesService = async (userId, notificationData) => {
  return await upsertNotificationPreferencesRepo(userId, notificationData);
};

export const updatePasswordService = async (userId, { currentPassword, newPassword }) => {
  const existingPasswordHash = await getUserPasswordHashRepo(userId);
  if (!existingPasswordHash) {
    throw new Error("User record not found.");
  }

  const isMatch = await bcrypt.compare(currentPassword, existingPasswordHash);
  if (!isMatch) {
    throw new Error("Current password is incorrect.");
  }

  const saltRounds = 10;
  const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

  return await updateUserPasswordRepo(userId, newPasswordHash);
};