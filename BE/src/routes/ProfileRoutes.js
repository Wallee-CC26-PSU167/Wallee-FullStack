import express from "express";
import controller from "../controller/ProfileController.js";
import auth from "../middleware/authMiddleware.js";
const router = express.Router();
router.use(auth);

router.get('/', controller.getProfile);

router.put(
  '/',
  controller.updateProfile
);

export default router;