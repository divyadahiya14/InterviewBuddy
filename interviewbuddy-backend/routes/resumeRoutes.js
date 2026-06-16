import express from 'express';
import multer from 'multer';
import * as resumeController from '../controllers/resumeController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), resumeController.uploadResume);
router.get('/latest', resumeController.getLatestQuestions);

export default router;
