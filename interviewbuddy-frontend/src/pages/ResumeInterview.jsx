import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Upload, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  Play, 
  ArrowLeft, 
  Award, 
  ShieldAlert,
  HelpCircle,
  Clock,
  FileText
} from "lucide-react";
import API from "../services/api";
import "./InterviewChoicePage.css";
import "./ResumeInterview.css";
import toast from "react-hot-toast";

const LogoMark = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    <path d="M16 5C13.3 5 11 6.7 10.2 9.2C8 9.7 6.3 11.7 6.3 14C6.3 15.7 7.1 17.2 8.5 18.1V22.5H23.5V18.1C24.9 17.2 25.7 15.7 25.7 14C25.7 11.7 24 9.7 21.8 9.2C21 6.7 18.7 5 16 5Z" fill="white"/>
    <line x1="16" y1="6.5" x2="16" y2="22" stroke="rgba(100,140,230,0.4)" strokeWidth="1"/>
    <path d="M10.5 12.5C11.5 11.8 12.5 12.5 12 13.8" stroke="rgba(100,140,230,0.45)" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
    <path d="M19.5 12.5C20.5 11.8 21.5 12.5 21 13.8" stroke="rgba(100,140,230,0.45)" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
    <rect x="12.5" y="22.5" width="7" height="2.5" rx="1.25" fill="white" opacity="0.85"/>
    <line x1="6.3" y1="14" x2="3" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    <circle cx="3" cy="14" r="1.5" fill="white" opacity="0.7"/>
    <line x1="25.7" y1="14" x2="29" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    <circle cx="29" cy="14" r="1.5" fill="white" opacity="0.7"/>
    <line x1="16" y1="5" x2="16" y2="2" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    <circle cx="16" cy="2" r="1.5" fill="white" opacity="0.7"/>
  </svg>
);

export default function ResumeInterview() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle, uploading, parsed, error
  const [resumeData, setResumeData] = useState(null); // { id, email, skills, questions, timestamp }
  const [errorMsg, setErrorMsg] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const storedEmail = localStorage.getItem("email");
    if (!storedEmail) {
      toast.error("Please login to access the resume interview feature.");
      navigate("/login");
      return;
    }
    setEmail(storedEmail);
    fetchLatestSession(storedEmail);
  }, [navigate]);

  const fetchLatestSession = async (userEmail) => {
    try {
      setStatus("uploading");
      const res = await API.get(`/resume/latest?email=${encodeURIComponent(userEmail)}`);
      if (res.data && res.data.status !== "no_resume" && res.data.questions) {
        setResumeData(res.data);
        setStatus("parsed");
      } else {
        setStatus("idle");
      }
    } catch (err) {
      // 404 is expected if they never uploaded a resume before
      if (err.response && err.response.status === 404) {
        setStatus("idle");
      } else {
        console.error("Error fetching latest session:", err);
        setErrorMsg("Failed to check for existing resume session. Please try again.");
        setStatus("idle");
      }
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (selectedFile) => {
    setErrorMsg("");
    if (selectedFile.type !== "application/pdf") {
      setErrorMsg("Invalid file type. Only PDF resumes are supported.");
      toast.error("Please select a PDF file.");
      return;
    }
    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMsg("File size exceeds the 5MB limit. Please upload a smaller PDF.");
      toast.error("File is too large.");
      return;
    }
    setFile(selectedFile);
    uploadResume(selectedFile);
  };

  const uploadResume = async (selectedFile) => {
    setStatus("uploading");
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("email", email);

    try {
      toast.loading("Uploading and parsing resume...", { id: "upload" });
      const res = await API.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Resume parsed successfully!", { id: "upload" });
      setResumeData(res.data);
      setStatus("parsed");
    } catch (err) {
      console.error("Error uploading resume:", err);
      const serverError = err.response?.data?.error || "Failed to parse resume or generate questions.";
      setErrorMsg(serverError);
      setStatus("error");
      toast.error(serverError, { id: "upload" });
    }
  };

  const enterFullScreen = async () => {
    const elem = document.documentElement;
    try {
      if (elem.requestFullscreen) await elem.requestFullscreen();
      else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen();
      else if (elem.msRequestFullscreen) await elem.msRequestFullscreen();
    } catch (err) {
      console.warn("Fullscreen request denied: ", err);
    }
  };

  const handleLaunchMock = () => {
    if (!resumeData || !resumeData.questions || resumeData.questions.length === 0) {
      toast.error("No questions available to practice.");
      return;
    }
    
    enterFullScreen();
    
    Object.keys(sessionStorage).forEach((key) => {
      if (key.endsWith("_question")) {
        sessionStorage.removeItem(key);
      }
    });

    toast.success("Launching your personalized practice session!");
    
    navigate("/ai-interview/theory", { 
      state: { 
        type: "Resume-Based Mock", 
        level: "personalized", 
        questions: resumeData.questions 
      } 
    });
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to upload a new resume? This will replace your current personalized questions.")) {
      setFile(null);
      setResumeData(null);
      setErrorMsg("");
      setStatus("idle");
    }
  };

  const onButtonClick = () => {
    fileInputRef.current.click();
  };

  const formatTimestamp = (ts) => {
    if (!ts) return "";
    try {
      const date = new Date(ts);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return ts;
    }
  };

  return (
    <div className="relative min-h-screen pb-24 text-white z-10">
      
      {/* TOP COMPACT BAR */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5 bg-[#0c0c0c]/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => navigate("/interview-choice")}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-brand/25">
            <LogoMark className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">
            Interview <span className="text-[#22d3ee]">Buddy</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate("/interview-choice")} 
            className="flex items-center gap-2 rounded-full px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all text-xs font-semibold text-white/80"
          >
            <ArrowLeft size={14} className="text-white/75" />
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 mt-12 md:mt-16 relative z-10">
        
        {/* HEADER SECTION */}
        <header className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-[10px] font-extrabold tracking-widest text-[#22d3ee] uppercase">
            <Sparkles size={12} className="animate-pulse" />
            Resume AI Integration
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Resume-Based <span className="bg-gradient-to-r from-brand via-[#22d3ee] to-[#a4f4fd] bg-clip-text text-transparent animate-shiny">AI Interview</span>
          </h1>
          
          <p className="text-sm md:text-base text-white/60 max-w-xl mx-auto leading-relaxed">
            Upload your professional resume (PDF) to parse your skills locally and generate customized technical & situational questions for targeted mock practice.
          </p>
        </header>

        {/* ERROR MESSAGE BOX */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-4 bg-rose-500/10 border border-rose-500/25 rounded-2xl p-5 mb-8 text-rose-300 text-sm"
            >
              <ShieldAlert size={20} className="text-rose-400 flex-shrink-0" />
              <div>
                <strong className="font-bold">Process Error:</strong> {errorMsg}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN INTERACTIVE CARD CONTAINER */}
        <div className="w-full">
          {status === "idle" && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="liquid-glass rounded-3xl p-8 md:p-10 border border-white/5"
            >
              <h2 className="text-xl font-extrabold text-white mb-2">Upload Your PDF Resume</h2>
              <p className="text-sm text-white/50 mb-8 leading-relaxed">
                Make sure your resume is in PDF format and does not exceed 5MB. We extract technical terms locally on our secure backend.
              </p>

              <div 
                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 relative group overflow-hidden ${
                  isDragActive 
                    ? "border-cyan-400 bg-cyan-400/5 shadow-[0_0_30px_rgba(34,211,238,0.1)]" 
                    : "border-white/10 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.02] hover:-translate-y-0.5"
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={onButtonClick}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="application/pdf"
                  onChange={handleFileChange}
                />
                
                {/* Glow accent inside dropzone */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-brand/5 blur-3xl pointer-events-none rounded-full group-hover:bg-brand/10 transition-all" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 mb-5 group-hover:text-cyan-400 group-hover:border-cyan-400/30 group-hover:-translate-y-1 transition-all duration-300 shadow-xl">
                    <Upload size={28} />
                  </div>
                  <h3 className="text-base font-bold text-white/90 mb-1">Drag & drop your resume PDF here</h3>
                  <p className="text-xs text-white/45">or click to browse local files on your device</p>
                </div>
              </div>
            </motion.div>
          )}

          {status === "uploading" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="liquid-glass rounded-3xl p-12 border border-white/5 text-center flex flex-col items-center justify-center min-h-[350px]"
            >
              <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
                {/* Dual spinning cinematic glass loader */}
                <div className="absolute inset-0 rounded-full border-[3px] border-cyan-500/10 border-t-cyan-400 animate-spin" />
                <div className="absolute inset-2 rounded-full border-[3px] border-brand/10 border-t-brand animate-spin [animation-duration:1.5s]" />
                <Sparkles size={20} className="text-cyan-400 animate-pulse" />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">Analyzing Your Profile</h3>
              <p className="text-sm text-white/50 max-w-sm leading-relaxed">
                Extracting technical skills, education, and career experience from your PDF, then configuring Gemini models. This may take up to 10 seconds.
              </p>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="liquid-glass rounded-3xl p-12 border border-white/5 text-center flex flex-col items-center justify-center min-h-[350px]"
            >
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-6">
                <ShieldAlert size={32} />
              </div>
              <h3 className="text-xl font-extrabold text-white mb-3">Processing Failed</h3>
              <p className="text-sm text-white/50 max-w-md mb-8 leading-relaxed mx-auto">
                There was an issue reading your PDF file or authenticating with the AI service. Ensure it is a valid PDF and that you are connected.
              </p>
              <button 
                className="flex items-center gap-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all px-6 py-3 text-sm font-semibold text-white"
                onClick={() => setStatus("idle")}
              >
                <RefreshCw size={16} /> Try Uploading Again
              </button>
            </motion.div>
          )}

          {status === "parsed" && resumeData && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* EXTRACTED PROFILE SUMMARY CARD */}
              <div className="liquid-glass rounded-3xl p-8 border border-white/5">
                <h2 className="text-xl font-extrabold text-white mb-2">Parsed Candidate Profile</h2>
                <p className="text-xs text-white/50 mb-6 leading-relaxed">
                  Our offline parser identified the following core capabilities and technologies from your PDF.
                </p>

                <div className="bg-black/30 rounded-2xl p-5 border border-white/5">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-wider">Extracted Skills & Domains</span>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {resumeData.skills && resumeData.skills.trim().length > 0 ? (
                      resumeData.skills.split(", ").map((skill, index) => (
                        <span 
                          key={index} 
                          className="px-3.5 py-1.5 bg-white/5 border border-white/10 hover:border-white/20 text-white/80 hover:text-white rounded-lg text-xs font-semibold tracking-wide transition-all hover:scale-[1.02]"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-white/40 italic">No common technical keywords were auto-extracted. Standard general/behavioral fallback questions will apply.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* GENERATED QUESTIONS CARD */}
              <div className="liquid-glass rounded-3xl p-8 border border-white/5">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-xl font-extrabold text-white mb-2">Personalized AI Interview Questions</h2>
                    <p className="text-xs text-white/50 leading-relaxed">
                      Here are your 5 personalized mock questions, tailored specifically to the capabilities found above.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/40 bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                    <Clock size={12} /> Cached Session
                  </div>
                </div>

                <div className="space-y-4 my-6">
                  {resumeData.questions && resumeData.questions.map((q, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl p-5 flex gap-4 items-start transition-all duration-300 hover:translate-x-1"
                    >
                      <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-[#22d3ee] text-xs font-black flex items-center justify-center border border-cyan-500/25 flex-shrink-0">
                        {idx + 1}
                      </div>
                      <div className="text-sm font-semibold text-white/90 leading-relaxed pt-1">
                        {q}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-white/5">
                  <div className="text-xs text-white/40">
                    Uploaded on {formatTimestamp(resumeData.timestamp)}
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-full bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/30 active:scale-[0.98] transition-all px-5 py-3 text-xs font-bold text-rose-400" 
                      onClick={handleReset}
                    >
                      <RefreshCw size={14} /> Re-upload Resume
                    </button>
                    
                    <button 
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-[#22d3ee] hover:brightness-[1.05] active:scale-[0.98] transition-all px-6 py-3 text-xs font-bold text-white shadow-[0_4px_15px_rgba(61,129,227,0.35)]" 
                      onClick={handleLaunchMock}
                    >
                      <Play size={14} fill="white" className="text-white" /> Launch Mock Practice
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </div>
  );
}
