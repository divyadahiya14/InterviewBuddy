import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { jwtInterceptor } from './middleware/auth.js';
import { regeneratePendingReports } from './services/aiRegenerationService.js';

// Routers
import authRoutes from './routes/authRoutes.js';
import aiInterviewRoutes from './routes/aiInterviewRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import candidateRoutes from './routes/candidateRoutes.js';
import interviewerRoutes from './routes/interviewerRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Connect to MongoDB
connectDB();

// CORS configuration matching Spring Boot origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://interview-buddy-frontend.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Body and Cookie parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Global JWT authentication interceptor middleware
app.use(jwtInterceptor);

// Mounting Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai/interview', aiInterviewRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/candidate', candidateRoutes);
app.use('/api/interviewer', interviewerRoutes);
app.use('/api/resume', resumeRoutes);

// Simple health check endpoint
app.get('/', (req, res) => {
  res.send('InterviewBuddy Backend Server is running...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

// Start Background Scheduler (every 10 seconds)
setInterval(async () => {
  console.log('[SCHEDULER] Running background pending reports check...');
  await regeneratePendingReports();
}, 10000);

// Start listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
