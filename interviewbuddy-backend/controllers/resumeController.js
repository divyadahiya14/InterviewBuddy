import * as resumeService from '../services/resumeService.js';
import * as questionGenerationService from '../services/questionGenerationService.js';

export const uploadResume = async (req, res) => {
  try {
    const { email } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'File is empty. Please upload a valid PDF resume.' });
    }

    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are supported.' });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email parameter is required.' });
    }

    // 1. Parse PDF and extract skills, save to DB
    const resume = await resumeService.parseAndSaveResume(email, file.buffer);

    // 2. Generate custom questions
    const questions = await questionGenerationService.generateQuestions(resume);

    // 3. Send response
    res.json({
      id: resume.id,
      email: resume.userEmail,
      skills: resume.skills,
      questions: questions,
      timestamp: resume.timestamp
    });
  } catch (err) {
    console.error('Error parsing resume and generating questions:', err.message);
    res.status(500).json({
      error: `Failed to process resume. Please try again. ${err.message}`
    });
  }
};

export const getLatestQuestions = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email is required.' });
    }

    const resume = await resumeService.getLatestResume(email);

    if (!resume) {
      return res.json({ status: 'no_resume', message: 'No resume found' });
    }

    let questions = [];
    if (resume.generatedQuestions && resume.generatedQuestions.trim()) {
      questions = JSON.parse(resume.generatedQuestions);
    } else {
      questions = await questionGenerationService.generateQuestions(resume);
    }

    res.json({
      id: resume.id,
      email: resume.userEmail,
      skills: resume.skills,
      questions: questions,
      timestamp: resume.timestamp
    });
  } catch (err) {
    console.error('Error retrieving latest questions:', err.message);
    res.status(500).json({
      error: `Failed to retrieve questions: ${err.message}`
    });
  }
};
