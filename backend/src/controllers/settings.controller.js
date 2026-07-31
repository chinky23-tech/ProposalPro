import {
  getSettingsService,
  updateProfileService,
  updateWorkspaceSettingsService,
  updateNotificationPreferencesService,
  updatePasswordService,
} from "../services/settings.service.js";

import {
  validateUpdateProfile,
  validateUpdateWorkspace,
  validateUpdateNotifications,
  validateUpdatePassword,
} from "../validations/settings.validation.js";

// ==========================================
// 1. Get All Settings
// ==========================================
export const getSettings = async (req, res) => {
  try {
    const settings = await getSettingsService(req.user.id);
    return res.status(200).json({ success: true, data: settings });
  } catch (error) {
    console.error("Get settings error:", error?.message || error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ==========================================
// 2. Update Personal Profile
// ==========================================
export const updateProfile = async (req, res) => {
  try {
    const validatedData = validateUpdateProfile(req.body);
    const updatedProfile = await updateProfileService(req.user.id, validatedData);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Update profile error:", error?.message || error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ==========================================
// 3. Update Workspace & Branding
// ==========================================
export const updateWorkspace = async (req, res) => {
  try {
    const validatedData = validateUpdateWorkspace(req.body);
    const updatedWorkspace = await updateWorkspaceSettingsService(req.user.id, validatedData);

    return res.status(200).json({
      success: true,
      message: "Workspace updated successfully",
      data: updatedWorkspace,
    });
  } catch (error) {
    console.error("Update workspace error:", error?.message || error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ==========================================
// 4. Update Notifications
// ==========================================
export const updateNotifications = async (req, res) => {
  try {
    const validatedData = validateUpdateNotifications(req.body);
    const updatedNotifications = await updateNotificationPreferencesService(req.user.id, validatedData);

    return res.status(200).json({
      success: true,
      message: "Notification preferences updated successfully",
      data: updatedNotifications,
    });
  } catch (error) {
    console.error("Update notifications error:", error?.message || error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

// ==========================================
// 5. Update Password / Security
// ==========================================
export const updatePassword = async (req, res) => {
  try {
    const validatedData = validateUpdatePassword(req.body);
    await updatePasswordService(req.user.id, validatedData);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Update password error:", error?.message || error);
    return res.status(400).json({ success: false, message: error.message });
  }
};