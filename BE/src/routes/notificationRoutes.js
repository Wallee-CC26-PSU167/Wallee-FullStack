import auth from "../middleware/authMiddleware.js";
import express from "express";
const router = express.Router();

import notificationController from "../controller/notificationController.js";

router.use(auth);

router.post(
  "/",
  notificationController.saveNotification
);

router.get(
  "/",
  notificationController.getNotifications
);
router.patch(
  "/dismiss/:itemId",
  notificationController.dismissNotification
);


export default router;