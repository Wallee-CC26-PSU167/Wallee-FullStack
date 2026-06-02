import express from 'express';
import controller from '../controller/transactionController.js';
import auth from '../middleware/authMiddleware.js';
import schema from "../validation/transactionValidation.js";
import validate from "../middleware/validate.js";

const router = express.Router();
// semua route butuh token
router.use(auth);

router.get('/',           controller.getAll);
router.get(
  "/analytics",
  controller.getAnalyticsTransactions
);
router.get('/summary',    validate(schema.summary), controller.getSummary);   // ⚠️ harus sebelum /:id
router.get('/:id',        validate(schema.getID), controller.getOne);
router.post('/',          validate(schema.create), controller.create);
router.delete('/:id',     controller.remove);

export default router;