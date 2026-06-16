import Booking from '../models/Booking.js';
import AIInterviewReport from '../models/AIInterviewReport.js';
import * as aiRegenerationService from '../services/aiRegenerationService.js';

export const getCandidateProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const loggedInEmail = req.userEmail;

    if (loggedInEmail && loggedInEmail.toLowerCase() !== email.toLowerCase()) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to view this profile' });
    }

    const humanInterviews = await Booking.find({ intervieweeEmail: email }).sort({ _id: -1 });
    const aiInterviews = await AIInterviewReport.find({ studentEmail: email }).sort({ timestamp: -1 });

    res.json({
      humanInterviews,
      aiInterviews
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getReportDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInEmail = req.userEmail;

    const report = await AIInterviewReport.findById(id);
    if (!report) {
      return res.status(404).json({ error: `Report not found with id: ${id}` });
    }

    if (loggedInEmail && loggedInEmail.toLowerCase() !== report.studentEmail.toLowerCase()) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to view this report' });
    }

    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const forceRetryReport = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInEmail = req.userEmail;

    const report = await AIInterviewReport.findById(id);
    if (!report) {
      return res.status(404).json({ error: `Report not found with id: ${id}` });
    }

    if (loggedInEmail && loggedInEmail.toLowerCase() !== report.studentEmail.toLowerCase()) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to retry this report' });
    }

    report.status = 'pending';
    report.retryCount = 0;
    await report.save();

    // Trigger immediate regeneration asynchronously (background task)
    setTimeout(async () => {
      try {
        await aiRegenerationService.regeneratePendingReports();
      } catch (err) {
        console.error(`Force retry failed for report ${id}:`, err.message);
      }
    }, 0);

    res.json({
      message: `Report ${id} queued for immediate regeneration`,
      status: 'pending'
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInEmail = req.userEmail;

    const report = await AIInterviewReport.findById(id);
    if (!report) {
      return res.status(404).json({ error: `Report not found with id: ${id}` });
    }

    if (loggedInEmail && loggedInEmail.toLowerCase() !== report.studentEmail.toLowerCase()) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to delete this report' });
    }

    await AIInterviewReport.findByIdAndDelete(id);
    res.json({ message: `Report ${id} permanently deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const loggedInEmail = req.userEmail;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ error: `Booking not found with id: ${id}` });
    }

    if (loggedInEmail && loggedInEmail.toLowerCase() !== booking.intervieweeEmail.toLowerCase()) {
      return res.status(403).json({ error: 'Forbidden: You do not have permission to delete this booking' });
    }

    await Booking.findByIdAndDelete(id);
    res.json({ message: `Booking ${id} permanently deleted` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await AIInterviewReport.find({});
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
