import { Router } from 'express';
import { regenerateSummarySection, summarizeTranscript } from '../controllers/summaryController.js';

const router = Router();

router.post('/summarize', summarizeTranscript);
router.post('/regenerate-section', regenerateSummarySection);

export default router;
