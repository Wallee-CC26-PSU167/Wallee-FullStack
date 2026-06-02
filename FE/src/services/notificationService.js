import api from "./api";

export const getNotifications = async () => {
  const response = await api.get("/ai/notifications");
  return response.data.data;
};

export const getLatestNotification = async () => {
  const response = await api.get("/ai/notifications");

  const notifications = response.data.data;

  return notifications?.[0] || null;
};
export const getLatestUnreadNotification =
  async () => {

  const response = await api.get(
    "/ai/notifications/latest-unread"
  );

  return response.data.data;
};