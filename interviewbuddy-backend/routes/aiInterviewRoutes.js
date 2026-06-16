import express from 'express';
import * as aiInterviewController from '../controllers/aiInterviewController.js';

const router = express.Router();

router.get('/question', aiInterviewController.getQuestion);
router.post('/evaluate', aiInterviewController.evaluate);
router.post('/feedback', aiInterviewController.getFeedback);
router.post('/theoryQuestions', aiInterviewController.getTheoryQuestions);
router.post('/theory-feedback', aiInterviewController.evaluateTheory);
router.post('/hint', aiInterviewController.getHint);
router.post('/save-report', aiInterviewController.saveReport);

export default router;
