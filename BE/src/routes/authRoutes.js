import express from "express";
import authController from "../controller/authController.js";
import schema from "../validation/authValidation.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post("/register", validate(schema.register), authController.register);
router.post("/login", validate(schema.login), authController.login);
router.post("/forgot-password", validate(schema.forgotPassword), authController.forgotPassword);
router.post("/reset-password", validate(schema.resetPassword), authController.resetPassword);

export default router;