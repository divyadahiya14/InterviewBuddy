import { BrowserRouter, Routes, Route } from "react-router-dom";
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
          duration: 8000, // ⏱️ zyada time dikhega
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
      <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white">
        
        {/* Global Cinematic Looping Background Video */}
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

        {/* Global Layout Wrapper for routes */}
        <div className="relative z-10">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
      
            <Route path="/ai-interview/theory" element={<FundamentalsInterview/>}/>
            <Route path="/result" element={<Results/>} />
       
            <Route path="/interview-type" element={<InterviewType/>} />
             <Route path="/human-interview" element={<HumanInterview/>} />
             <Route path="/forgot-password" element={<ForgotPassword />} />
             <Route path="/ai-interview/coding" element={<Dsa/>} />
             
            <Route path="/feedback" element={<Feedback />} /> 
            <Route path="/feedback-theory" element={<FeedbackTheory />} /> 
            <Route path="/interviewer-dashboard" element={<InterviewerDashboard/>}/>
            <Route path="/interviewer-profile" element={<InterviewerProfile/>}/>
            <Route path="/interview-choice" element={<InterviewerChoicePage/>}/>
            <Route path="/candidate-profile" element={<CandidateProfile/>}/>
            <Route path="/resume-interview" element={<ResumeInterview/>}/>
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;