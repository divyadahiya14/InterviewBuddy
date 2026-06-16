import express from 'express';
import * as bookingController from '../controllers/bookingController.js';

const router = express.Router();

router.post('/create-order', bookingController.createOrder);
router.post('/confirm', bookingController.confirmBooking);
router.get('/interviewer', bookingController.getInterviewerBookings);
router.get('/candidate', bookingController.getCandidateBookings);

export default router;
