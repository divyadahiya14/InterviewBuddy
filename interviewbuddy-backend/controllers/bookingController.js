import * as bookingService from '../services/bookingService.js';

export const createOrder = async (req, res) => {
  try {
    const result = await bookingService.createRazorpayOrder(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const confirmBooking = async (req, res) => {
  try {
    const booking = await bookingService.confirmBookingService(req.body);
    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getInterviewerBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getBookingsByInterviewerEmail(req.query.email);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCandidateBookings = async (req, res) => {
  try {
    const bookings = await bookingService.getBookingsByIntervieweeEmail(req.query.email);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
