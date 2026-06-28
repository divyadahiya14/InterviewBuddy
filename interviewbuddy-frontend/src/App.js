import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Results from "./pages/Results";
import InterviewType  from "./pages/InterviewType";
import HumanInterview from "./pages/HumanInterview";
import ForgotPassword from "./pages/ForgotPassword";
import Dsa from "./pages/Dsa";
import { Toaster } from "react-hot-toast";
import Feedback from "./pages/Feedback";
import FundamentalsInterview from "./pages/FundamentalsInterview";
import FeedbackTheory from "./pages/FeedbackTheory";
import InterviewerDashboard from "./pages/InterviewerDashboard";
import InterviewerProfile from "./pages/InterviewerProfile";
import InterviewerChoicePage from "./pages/InterviewChoicePage";
import CandidateProfile from "./pages/CandidateProfile";
import ResumeInterview from "./pages/ResumeInterview";
import { useEffect } from "react";
import API from "./services/api";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages that should show the moving wave/video background
const WAVE_BG_ROUTES = ["/"];

// Inner component so useLocation works inside BrowserRouter
function AppContent() {
  const location = useLocation();
  const showWaveBg = WAVE_BG_ROUTES.includes(location.pathname);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white">

      {/* Cinematic Looping Background Video — only on Landing & Dashboard */}
      {showWaveBg && (
        <div className="fixed inset-0 z-0 pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover pointer-events-none opacity-20 brightness-[0.55] select-none"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-[#0c0c0c]/85" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(12,12,12,0.95)_90%)]" />
        </div>
      )}

      {/* Global Double Vertical Guides */}
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/10 z-[5]" />
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/10 z-[5]" />

      {/* Global SVG Noise Filter */}
      <svg className="absolute w-0 h-0 pointer-events-none z-[-10]">
        <defs>
          <filter id="c3-noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
            <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
            <feComposite in2="SourceGraphic" operator="in" result="noise" />
            <feBlend in="SourceGraphic" in2="noise" mode="multiply" />
          </filter>
        </defs>
      </svg>

      {/* Layout Wrapper for routes */}
      <div className="relative z-10">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Interviewee Protected Routes */}
          <Route path="/interview-choice" element={<ProtectedRoute allowedRole="interviewee"><InterviewerChoicePage /></ProtectedRoute>} />
          <Route path="/interview-type" element={<ProtectedRoute allowedRole="interviewee"><InterviewType /></ProtectedRoute>} />
          <Route path="/ai-interview/coding" element={<ProtectedRoute allowedRole="interviewee"><Dsa /></ProtectedRoute>} />
          <Route path="/ai-interview/theory" element={<ProtectedRoute allowedRole="interviewee"><FundamentalsInterview /></ProtectedRoute>} />
          <Route path="/result" element={<ProtectedRoute allowedRole="interviewee"><Results /></ProtectedRoute>} />
          <Route path="/human-interview" element={<ProtectedRoute allowedRole="interviewee"><HumanInterview /></ProtectedRoute>} />
          <Route path="/feedback" element={<ProtectedRoute allowedRole="interviewee"><Feedback /></ProtectedRoute>} />
          <Route path="/feedback-theory" element={<ProtectedRoute allowedRole="interviewee"><FeedbackTheory /></ProtectedRoute>} />
          <Route path="/candidate-profile" element={<ProtectedRoute allowedRole="interviewee"><CandidateProfile /></ProtectedRoute>} />
          <Route path="/resume-interview" element={<ProtectedRoute allowedRole="interviewee"><ResumeInterview /></ProtectedRoute>} />

          {/* Interviewer Protected Routes */}
          <Route path="/interviewer-dashboard" element={<ProtectedRoute allowedRole="interviewer"><InterviewerDashboard /></ProtectedRoute>} />
          <Route path="/interviewer-profile" element={<ProtectedRoute allowedRole="interviewer"><InterviewerProfile /></ProtectedRoute>} />
        </Routes>
      </div>
    </div>
  );
}

function App() {
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await API.get("/auth/me");
        if (res.data && res.data.loggedIn) {
          const loggedUser = {
            email: res.data.email,
            name: res.data.name || "",
            role: res.data.role.toLowerCase()
          };
          localStorage.setItem("user", JSON.stringify(loggedUser));
          localStorage.setItem("email", loggedUser.email);
          localStorage.setItem("role", loggedUser.role);
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("email");
        }
      } catch (err) {
        console.error("Session verification failed", err);
      }
    };
    checkSession();
  }, []);

  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 8000,
          style: {
            background: "#1e293b",
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
            fontSize: "14px",
            maxWidth: "420px",
            textAlign: "center",
          },
        }}
      />
      <AppContent />
    </BrowserRouter>
  );
}

export default App;