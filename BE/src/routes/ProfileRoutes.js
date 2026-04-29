import express from "express";
import controller from "../controller/ProfileController.js";
import auth from "../middleware/authMiddleware.js";
import schema from "../validation/ProfileValidation.js";
import validate from "../middleware/validate.js";
const router = express.Router();
router.use(auth);

router.get('/', controller.getProfile);

router.put(
  '/',
  validate(schema.update),
  controller.updateProfile
);

export default router;