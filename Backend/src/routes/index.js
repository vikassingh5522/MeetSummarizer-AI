import { Router } from 'express';
import { getHealth } from '../controllers/healthController.js';
import summaryRoutes from './summaryRoutes.js';
import meetingRoutes from './meetingRoutes.js';

const router = Router();

router.get('/health', getHealth);
router.use(summaryRoutes);
router.use(meetingRoutes);

export default router;

