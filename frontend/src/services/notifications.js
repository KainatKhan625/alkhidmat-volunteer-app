import api from "./api";

// Fetch the logged-in user's notifications (most recent first)
export async function fetchMyNotifications() {
  const response = await api.get("/notifications");
  return response.data;
}

// Fetch how many unread notifications the user has (for the bell's red dot)
export async function fetchUnreadCount() {
  const response = await api.get("/notifications/unread-count");
  return response.data.count;
}

// Mark all of the user's notifications as read
export async function markAllNotificationsAsRead() {
  const response = await api.put("/notifications/mark-all-read");
  return response.data;
}