import { Router } from 'express';
import { getMeetings, updateMeeting, deleteMeetingRoute } from '../controllers/meetingController.js';

const router = Router();

router.get('/meetings', getMeetings);
router.put('/meetings/:id', updateMeeting);
router.delete('/meetings/:id', deleteMeetingRoute);

export default router;
