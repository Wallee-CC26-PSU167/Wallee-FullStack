import express from 'express';
const router = express.Router();
import controller from '../controller/categoriController.js';
import auth from '../middleware/authMiddleware.js';
import schema from "../validation/categoriValidation.js";
import validate from "../middleware/validate.js";

router.use(auth);

router.get('/', validate(schema.query), controller.getAll);

export default router;