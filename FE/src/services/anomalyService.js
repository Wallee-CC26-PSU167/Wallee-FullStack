
import api from "./api";
export const getNotifications = async () => {
  const res = await api.get("/ai/notifications");
  return res.data;
};
export const dismissNotification = async (itemId) => {
  const res = await api.patch(`/ai/notifications/dismiss/${itemId}`);
  return res.data;
};