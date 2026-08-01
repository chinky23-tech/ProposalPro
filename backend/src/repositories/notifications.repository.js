import db from "../config/db.js";

// Get user notifications + unread count
export const getUserNotificationsRepo = async (userId) => {
  const query = `
    SELECT 
      id,
      proposal_id AS "proposalId",
      title,
      message,
      type,
      is_read AS "isRead",
      created_at AS "createdAt"
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
    LIMIT 20;
  `;

  const countQuery = `
    SELECT COUNT(*)::int AS "unreadCount"
    FROM notifications
    WHERE user_id = $1 AND is_read = false;
  `;

  const [notifResult, countResult] = await Promise.all([
    db.query(query, [userId]),
    db.query(countQuery, [userId]),
  ]);

  return {
    notifications: notifResult.rows,
    unreadCount: countResult.rows[0]?.unreadCount || 0,
  };
};

// Create a new notification
export const createNotificationRepo = async (userId, notificationData) => {
  const { proposalId, title, message, type } = notificationData;
  const query = `
    INSERT INTO notifications (user_id, proposal_id, title, message, type)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING 
      id, 
      proposal_id AS "proposalId", 
      title, 
      message, 
      type, 
      is_read AS "isRead", 
      created_at AS "createdAt";
  `;
  const { rows } = await db.query(query, [userId, proposalId, title, message, type]);
  return rows[0];
};

// Mark all as read
export const markAllNotificationsReadRepo = async (userId) => {
  const query = `
    UPDATE notifications
    SET is_read = true
    WHERE user_id = $1 AND is_read = false;
  `;
  await db.query(query, [userId]);
  return true;
};

// Mark single notification as read
export const markNotificationReadRepo = async (userId, notificationId) => {
  const query = `
    UPDATE notifications
    SET is_read = true
    WHERE id = $1 AND user_id = $2
    RETURNING id, is_read AS "isRead";
  `;
  const { rows } = await db.query(query, [notificationId, userId]);
  return rows[0];
};