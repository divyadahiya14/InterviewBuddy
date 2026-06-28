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

// Request Logger Middleware
app.use((req, res, next) => {
  const oldWriteHead = res.writeHead;
  res.writeHead = function (...args) {
    console.log(`[RESPONSE] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - Headers:`, JSON.stringify(res.getHeaders()));
    return oldWriteHead.apply(this, args);
  };
  console.log(`[REQUEST] ${req.method} ${req.originalUrl} - Origin: ${req.headers.origin || 'none'}`);
  next();
});

// Connect to MongoDB
connectDB();

// CORS configuration matching Spring Boot origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://interview-buddy-frontend.vercel.app'
];

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin) {
    // If no origin, set * or allow it (mobile / curl)
    res.setHeader('Access-Control-Allow-Origin', '*');
  } else if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

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

// Start Background Scheduler (every 30 seconds) with protection against overlapping runs
let _isRegenerating = false;
setInterval(async () => {
  if (_isRegenerating) return;
  _isRegenerating = true;
  try {
    console.log('[SCHEDULER] Running background pending reports check...');
    await regeneratePendingReports();
  } catch (e) {
    console.error('[SCHEDULER] Error during regeneration:', e.message || e);
  } finally {
    _isRegenerating = false;
  }
}, 30000);

// Start listening
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
