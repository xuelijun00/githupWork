import { Router } from 'express';
import { batchController } from '../controllers/batchController';

const router = Router();

router.get('/', batchController.getAllBatches);
router.get('/:id', batchController.getBatchById);
router.post('/', batchController.createBatch);
router.put('/:id/receive', batchController.receiveBatch);

export default router;
