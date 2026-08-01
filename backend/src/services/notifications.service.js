import {
  getUserNotificationsRepo,
  createNotificationRepo,
  markAllNotificationsReadRepo,
  markNotificationReadRepo,
} from "../repositories/notifications.repository.js";

export const getNotificationsService = async (userId) => {
  return await getUserNotificationsRepo(userId);
};

export const createNotificationService = async (userId, notificationData) => {
  return await createNotificationRepo(userId, notificationData);
};

export const markAllReadService = async (userId) => {
  return await markAllNotificationsReadRepo(userId);
};

export const markSingleReadService = async (userId, notificationId) => {
  const updated = await markNotificationReadRepo(userId, notificationId);
  if (!updated) {
    throw new Error("Notification not found");
  }
  return updated;
};