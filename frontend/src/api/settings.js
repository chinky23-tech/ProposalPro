import { request, getStoredAuthSession } from './auth.js';

// Helper to get token dynamically
const getToken = () => {
  const session = getStoredAuthSession();
  return session?.token || null;
};

// Fetch all settings
export const fetchSettingsAPI = async () => {
  return await request('/settings', {
    method: 'GET',
    token: getToken(),
  });
};

// Update Profile
export const updateProfileAPI = async (profileData) => {
  return await request('/settings/profile', {
    method: 'PUT',
    body: profileData,
    token: getToken(),
  });
};

// Update Workspace Settings
export const updateWorkspaceAPI = async (workspaceData) => {
  return await request('/settings/workspace', {
    method: 'PUT',
    body: workspaceData,
    token: getToken(),
  });
};

// Update Notification Preferences
export const updateNotificationsAPI = async (notificationData) => {
  return await request('/settings/notifications', {
    method: 'PUT',
    body: notificationData,
    token: getToken(),
  });
};

// Update Security / Password
export const updatePasswordAPI = async (passwordData) => {
  return await request('/settings/security', {
    method: 'PUT',
    body: passwordData,
    token: getToken(),
  });
};