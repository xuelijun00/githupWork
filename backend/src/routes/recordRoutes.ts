import { Router } from 'express';
import { recordController } from '../controllers/recordController';

const router = Router();

router.get('/', recordController.getRecords);

export default router;
