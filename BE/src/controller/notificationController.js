import notificationService from "../service/notificationService.js";

const getNotifications = async (req, res) => {
  try {
    const userId = req.user.id;
    const notifications =
      await notificationService.getNotifications(userId);
    return res.status(200).json({
      success: true,
      data: notifications
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const saveNotification = async (req, res) => {
  try {
    const aiResult = req.body;
    const userId = req.user.id;
    const result =
      await notificationService.saveNotification(
        aiResult,
        userId
      );
    return res.status(201).json({
      success: true,
      message: "Notification berhasil disimpan",
      data: result
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const dismissNotification = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;
    await notificationService.dismissNotification(
      itemId,
      userId
    );
    return res.status(200).json({
      success: true,
      message: "Notification dismissed"
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export default {
  getNotifications,
  saveNotification,
  dismissNotification,
};