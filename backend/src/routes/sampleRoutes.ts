import { Router } from 'express';
import { sampleController } from '../controllers/sampleController';

const router = Router();

router.get('/batch/:batchId', sampleController.getSamplesByBatchId);
router.put('/:id/review', sampleController.reviewSample);
router.put('/:id/resolve-abnormal', sampleController.resolveAbnormal);

export default router;
