import Interviewer from '../models/Interviewer.js';

export const getByEmail = async (email) => {
  return await Interviewer.findOne({ email });
};

export const updateInterviewerService = async (req) => {
  let interviewer = await Interviewer.findOne({ email: req.email });

  if (!interviewer) {
    interviewer = new Interviewer({ email: req.email });
  }

  // Profile fields
  interviewer.name = req.name;
  if (req.password) {
    interviewer.password = req.password;
  }
  interviewer.intro = req.intro;
  interviewer.speciality = req.speciality;
  interviewer.experience = req.experience;
  interviewer.price = req.price;
  interviewer.linkedin = req.linkedin;
  interviewer.github = req.github;
  interviewer.bio = req.bio;
  interviewer.languages = req.languages;
  interviewer.rating = req.rating;
  interviewer.upiId = req.upiId;

  // Clear availability
  interviewer.availability = [];

  // Add new availability
  if (req.availability && Array.isArray(req.availability)) {
    for (const item of req.availability) {
      interviewer.availability.push({
        date: item.date,
        timeSlots: item.timeSlots || []
      });
    }
  }

  return await interviewer.save();
};

export const updateAvailabilityByEmailService = async (email, availabilityList) => {
  const interviewer = await Interviewer.findOne({ email });

  if (!interviewer) {
    throw new Error(`Interviewer not found with email: ${email}`);
  }

  // Clear availability
  interviewer.availability = [];

  // Add new availability
  if (availabilityList && Array.isArray(availabilityList)) {
    for (const item of availabilityList) {
      interviewer.availability.push({
        date: item.date,
        timeSlots: item.timeSlots || []
      });
    }
  }

  return await interviewer.save();
};

export const getAllInterviewersService = async () => {
  return await Interviewer.find({});
};

export const rateInterviewerService = async (id, score) => {
  try {
    console.log(`[RATE_INTERVIEWER] Starting rateInterviewer for id=${id}, score=${score}`);
    const interviewer = await Interviewer.findById(id);

    if (!interviewer) {
      throw new Error(`Interviewer not found with ID: ${id}`);
    }

    if (!interviewer.ratingsList) {
      interviewer.ratingsList = [];
    }

    // Seed first rating if empty and exists in string rating
    if (interviewer.ratingsList.length === 0 && interviewer.rating) {
      const val = parseFloat(interviewer.rating);
      if (!isNaN(val) && val > 0.0) {
        interviewer.ratingsList.push(val);
      }
    }

    interviewer.ratingsList.push(score);

    let sum = 0.0;
    for (const r of interviewer.ratingsList) {
      sum += r;
    }
    const avg = interviewer.ratingsList.length === 0 ? 0.0 : sum / interviewer.ratingsList.length;

    interviewer.rating = avg.toFixed(1);
    const saved = await interviewer.save();
    console.log(`[RATE_INTERVIEWER] Successfully rated interviewer id=${id}, new avg=${saved.rating}`);
    return saved;
  } catch (error) {
    console.error('[RATE_INTERVIEWER] ERROR in rateInterviewer:', error.message);
    throw error;
  }
};
