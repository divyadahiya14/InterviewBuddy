import Razorpay from 'razorpay';
import crypto from 'crypto';
import axios from 'axios';
import Booking from '../models/Booking.js';
import Interviewer from '../models/Interviewer.js';

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL;

export const createRazorpayOrder = async (data) => {
  try {
    const amount = parseInt(data.amount);

    const instance = new Razorpay({
      key_id: KEY_ID,
      key_secret: KEY_SECRET
    });

    const options = {
      amount: amount * 100, // Razorpay works in paise
      currency: 'INR',
      receipt: `order_${Date.now()}`
    };

    const order = await instance.orders.create(options);

    return {
      orderId: order.id,
      amount: amount,
      key: KEY_ID
    };
  } catch (error) {
    console.error('Order creation failed:', error.message);
    throw new Error('Order creation failed');
  }
};

const sendEmail = async (to, booking, subject) => {
  try {
    console.log('📧 BREVO EMAIL STARTED');
    console.log('➡️ To: ' + to);

    if (!BREVO_API_KEY || !BREVO_API_KEY.trim() || !BREVO_SENDER_EMAIL || !BREVO_SENDER_EMAIL.trim()) {
      console.log('[BREVO CONFIG MISSING] Falling back to local console email delivery.');
      return;
    }

    const htmlContent = `
      <div style='font-family:Arial, sans-serif; padding:20px; color:#1e293b;'>
        <h2 style='color:#6366f1;'>Interview Booking Confirmed 🚀</h2>
        <div style='background:#f8fafc; padding:15px; border-radius:10px; border:1px solid #e2e8f0;'>
          <p style='margin:5px 0;'><b>Date:</b> ${booking.date}</p>
          <p style='margin:5px 0;'><b>Time Slot:</b> ${booking.selectedSlot}</p>
          <p style='margin:15px 0 5px 0;'><b>Meet Link:</b> <a href='${booking.meetLink}' style='color:#6366f1; font-weight:700;'>Join Meeting</a></p>
        </div>
        <br><p>All the best for your interview! 💪<br><b>Team Interview Buddy</b></p>
      </div>
    `;

    const payload = {
      sender: { name: 'Interview Buddy', email: BREVO_SENDER_EMAIL },
      to: [{ email: to }],
      subject: subject,
      htmlContent: htmlContent
    };

    await axios.post('https://api.brevo.com/v3/smtp/email', payload, {
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    console.log('✅ EMAIL SENT SUCCESSFULLY');
  } catch (error) {
    console.error('Email failed:', error.message);
    throw new Error(`Email failed: ${error.message}`);
  }
};

export const confirmBookingService = async (bookingData) => {
  console.log('BOOKING DATA:', bookingData.intervieweeEmail);
  console.log('DATE:', bookingData.date);
  console.log('SLOT:', bookingData.selectedSlot);

  if (!bookingData.intervieweeEmail) {
    throw new Error('Interviewee email missing');
  }
  if (!bookingData.interviewerEmail) {
    throw new Error('Interviewer email missing');
  }
  if (!bookingData.date || !bookingData.selectedSlot) {
    throw new Error('Date or Slot missing');
  }

  // 1. Check if already booked
  const exists = await Booking.findOne({
    interviewerId: bookingData.interviewerId,
    date: bookingData.date,
    selectedSlot: bookingData.selectedSlot,
    status: 'CONFIRMED'
  });

  if (exists) {
    throw new Error('Slot already booked');
  }

  // 2. Remove slot from availability to prevent double booking
  const interviewer = await Interviewer.findOne({ email: bookingData.interviewerEmail });
  if (interviewer && interviewer.availability) {
    for (let av of interviewer.availability) {
      if (av.date === bookingData.date) {
        if (av.timeSlots) {
          av.timeSlots = av.timeSlots.filter(slot => slot !== bookingData.selectedSlot);
        }
        break;
      }
    }
    await interviewer.save();
  }

  // 3. Meet Link generation
  const uuidSub = crypto.randomBytes(4).toString('hex'); // 8 chars hex
  const meetLink = `https://meet.jit.si/InterviewBuddy-${uuidSub}`;

  const booking = new Booking({
    intervieweeEmail: bookingData.intervieweeEmail,
    interviewerEmail: bookingData.interviewerEmail,
    interviewerId: bookingData.interviewerId,
    date: bookingData.date,
    selectedSlot: bookingData.selectedSlot,
    paymentId: bookingData.paymentId || '',
    orderId: bookingData.orderId || '',
    status: 'CONFIRMED',
    meetLink: meetLink
  });

  // 4. Save Booking
  const savedBooking = await booking.save();

  // 5. Email to Interviewee
  await sendEmail(
    booking.intervieweeEmail,
    booking,
    'Interview Confirmed 🎉'
  );

  // 6. Email to Interviewer
  await sendEmail(
    booking.interviewerEmail,
    booking,
    'Interview Scheduled 📅'
  );

  return savedBooking;
};

export const getBookingsByInterviewerEmail = async (email) => {
  return await Booking.find({ interviewerEmail: email }).sort({ _id: -1 });
};

export const getBookingsByIntervieweeEmail = async (email) => {
  return await Booking.find({ intervieweeEmail: email });
};
