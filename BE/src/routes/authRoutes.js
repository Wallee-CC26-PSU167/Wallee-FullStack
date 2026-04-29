import express from "express";
import authController from "../controller/authController.js";
import schema from "../validation/authValidation.js";
import validate from "../middleware/validate.js";

const router = express.Router();

router.post("/register", validate(schema.register), authController.register);
router.post("/login", validate(schema.login), authController.login);

export default router;