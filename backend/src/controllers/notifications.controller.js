import {
  getNotificationsService,
  markAllReadService,
  markSingleReadService,
} from "../services/notifications.service.js";
import { validateNotificationId } from "../validations/notifications.validation.js";

// GET /api/notifications
export const getNotifications = async (req, res) => {
  try {
    const data = await getNotificationsService(req.user.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Get notifications error:", error?.message || error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/notifications/read-all
export const markAllAsRead = async (req, res) => {
  try {
    await markAllReadService(req.user.id);
    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Mark all notifications error:", error?.message || error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/notifications/:id/read
export const markAsRead = async (req, res) => {
  try {
    const { id } = validateNotificationId(req.params);
    const updated = await markSingleReadService(req.user.id, id);
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    console.error("Mark single notification error:", error?.message || error);
    return res.status(400).json({ success: false, message: error.message });
  }
};