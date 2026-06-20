import express from 'express';
import * as candidateProfileController from '../controllers/candidateProfileController.js';

const router = express.Router();

router.get('/:email/profile', candidateProfileController.getCandidateProfile);
router.get('/report/:id', candidateProfileController.getReportDetails);
router.post('/report/:id/retry', candidateProfileController.forceRetryReport);
router.delete('/report/:id', candidateProfileController.deleteReport);
router.post('/report/:id/delete', candidateProfileController.deleteReport);
router.delete('/booking/:id', candidateProfileController.deleteBooking);
router.post('/booking/:id/delete', candidateProfileController.deleteBooking);
router.get('/debug-reports', candidateProfileController.getAllReports);

export default router;
