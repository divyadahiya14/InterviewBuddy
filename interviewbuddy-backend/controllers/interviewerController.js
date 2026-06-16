import * as interviewerService from '../services/interviewerService.js';

export const getInterviewer = async (req, res) => {
  try {
    const { email } = req.query;
    const loggedInEmail = req.userEmail;

    if (loggedInEmail && loggedInEmail.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to view this profile' });
    }

    const interviewer = await interviewerService.getByEmail(email);
    res.json(interviewer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateInterviewer = async (req, res) => {
  try {
    const loggedInEmail = req.userEmail;

    if (loggedInEmail && loggedInEmail.toLowerCase() !== req.body.email.toLowerCase()) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to update this profile' });
    }

    const interviewer = await interviewerService.updateInterviewerService(req.body);
    res.json(interviewer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllInterviewers = async (req, res) => {
  try {
    const list = await interviewerService.getAllInterviewersService();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateAvailability = async (req, res) => {
  try {
    const { email } = req.query;
    const loggedInEmail = req.userEmail;

    if (loggedInEmail && loggedInEmail.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to update this availability' });
    }

    const interviewer = await interviewerService.updateAvailabilityByEmailService(email, req.body);
    res.json(interviewer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const rateInterviewer = async (req, res) => {
  try {
    const { id } = req.params;
    const { score } = req.query;

    const interviewer = await interviewerService.rateInterviewerService(id, parseFloat(score));
    res.json(interviewer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
