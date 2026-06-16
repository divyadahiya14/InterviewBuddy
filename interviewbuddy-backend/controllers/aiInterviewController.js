import * as aiService from '../services/aiService.js';
import AIInterviewReport from '../models/AIInterviewReport.js';

export const getQuestion = async (req, res) => {
  const { type, level } = req.query;
  console.log(`Controller hit -> type: ${type}, level: ${level}`);

  if (!type) {
    return res.status(400).json({ error: 'Type parameter is required' });
  }

  const normalizedType = type.trim().toUpperCase();

  try {
    if (normalizedType === 'DSA') {
      const question = await aiService.generateQuestion(type, level);
      return res.json(question);
    }

    if (['AIML', 'AI', 'AI-ML'].includes(normalizedType)) {
      const question = await aiService.generateAIMLQuestion(type, level);
      return res.json(question);
    }

    if (['DB', 'DBMS', 'SQL', 'DATABASE'].includes(normalizedType)) {
      const question = await aiService.generateDBQuestion(type, level);
      return res.json(question);
    }

    return res.status(400).send(`Invalid type: ${type} | Allowed: DSA, AIML, DBMS`);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const evaluate = async (req, res) => {
  try {
    const { question, code, mode, language } = req.body;
    const result = await aiService.evaluateAnswer(
      question,
      code + '\nMODE:' + mode,
      language
    );
    res.send(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFeedback = async (req, res) => {
  try {
    const { question, code, language } = req.body;
    const feedbackStr = await aiService.generateFeedback(question, code, language);
    console.log('RAW FEEDBACK:', feedbackStr);

    const feedback = JSON.parse(feedbackStr);
    res.json(feedback);
  } catch (err) {
    console.error('Feedback Error:', err.message);
    res.json({
      timeComplexity: '-',
      spaceComplexity: '-',
      codeQuality: 'Analysis Pending',
      score: 0,
      feedback: 'AI is processing high volume. Please wait 10s and click \'End Test\' again.'
    });
  }
};

export const getTheoryQuestions = async (req, res) => {
  try {
    const { type, level } = req.body;
    console.log(`AI Theory Questions -> type: ${type}, level: ${level}`);

    const questions = await aiService.generateTheoryQuestions(type, level);
    res.json(questions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const evaluateTheory = async (req, res) => {
  try {
    console.log('EVALUATING THEORY...');
    const result = await aiService.evaluateTheory(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getHint = async (req, res) => {
  try {
    console.log('Hint API hit');
    const { question, code, language } = req.body;
    const hint = await aiService.generateHint(question, code, language);
    res.json({ hint });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const saveReport = async (req, res) => {
  try {
    const {
      studentEmail,
      questionType,
      questionStatement,
      starterCode,
      submittedCode,
      expectedSolution,
      timeComplexity,
      spaceComplexity,
      codeQuality,
      feedback,
      score,
      scores,
      difficulty,
      language,
      status: requestStatus
    } = req.body;

    const report = new AIInterviewReport({
      studentEmail,
      questionType,
      questionStatement,
      starterCode,
      submittedCode,
      expectedSolution,
      timeComplexity,
      spaceComplexity,
      codeQuality,
      feedback,
      score,
      scores: Array.isArray(scores) ? scores : [],
      difficulty,
      language: language || '',
      timestamp: new Date()
    });

    // Determine status
    let status = 'completed';
    const fbLower = feedback ? feedback.toLowerCase() : '';
    const cqLower = codeQuality ? codeQuality.toLowerCase() : '';

    if (
      !feedback ||
      !feedback.trim() ||
      fbLower.includes('rate limit') ||
      fbLower.includes('busy') ||
      fbLower.includes('high volume') ||
      fbLower.includes('failed') ||
      fbLower.includes('quota') ||
      fbLower.includes('unavailable') ||
      fbLower.includes('temporarily') ||
      cqLower === 'error' ||
      cqLower === 'analysis pending'
    ) {
      status = 'pending';
    } else if (requestStatus && requestStatus.trim()) {
      status = requestStatus;
    }

    report.status = status;

    await report.save();
    res.json({ message: 'Report saved successfully', id: report.id, status: report.status });
  } catch (err) {
    res.status(500).send(`Error saving report: ${err.message}`);
  }
};
