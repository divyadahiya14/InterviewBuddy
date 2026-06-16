import express from 'express';
import * as interviewerController from '../controllers/interviewerController.js';

const router = express.Router();

router.get('/by-email', interviewerController.getInterviewer);
router.put('/', interviewerController.updateInterviewer);
router.get('/all', interviewerController.getAllInterviewers);
router.patch('/availability', interviewerController.updateAvailability);
router.post('/:id/rate', interviewerController.rateInterviewer);

export default router;
