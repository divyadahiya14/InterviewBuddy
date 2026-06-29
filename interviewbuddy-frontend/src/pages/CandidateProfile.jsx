import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "motion/react";
import { 
  Flame, 
  TrendingUp, 
  Calendar, 
  Cpu, 
  FileText, 
  Sparkles, 
  Trash2, 
  ArrowLeft,
  ChevronRight,
  MoreVertical,
  CheckCircle,
  Clock,
  Play,
  RotateCw,
  Video,
  X,
  Plus,
  HelpCircle,
  Award,
  Globe,
  Database,
  Grid,
  Rocket,
  RefreshCw,
  GraduationCap,
  BarChart3,
  Puzzle,
  BookOpen,
  Bot,
  Target,
  Zap,
  UserCheck,
  Lightbulb,
  Settings
} from "lucide-react";

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

const isPlaceholderOrEmptyExpectedSolution = (code) => {
  if (!code || !code.trim()) return true;
  const cleaned = code.trim();
  const lines = cleaned.split('\n');
  const nonCommentLines = lines.filter(line => {
    const l = line.trim();
    return l.length > 0 && !l.startsWith('//') && !l.startsWith('/*') && !l.startsWith('*') && !l.endsWith('*/') && !l.startsWith('#');
  });
  return nonCommentLines.length === 0;
};

const CandidateProfile = () => {
  const [activeTab, setActiveTab] = useState("human");
  const [humanInterviews, setHumanInterviews] = useState([]);
  const [aiInterviews, setAiInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAiReport, setSelectedAiReport] = useState(null);
  const [selectedSubTab, setSelectedSubTab] = useState("DSA");
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const [retryingIds, setRetryingIds] = useState(new Set());
  const [openMenuId, setOpenMenuId] = useState(null);       // tracks which card's 3-dot menu is open
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: 'ai'|'human', id, title }
  const [deletingId, setDeletingId] = useState(null);
  const [onboardingStep, setOnboardingStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState("");
  const [onboardingDomain, setOnboardingDomain] = useState("");
  const [forceShowProfile, setForceShowProfile] = useState(false);
  const [selectedHeatmapDay, setSelectedHeatmapDay] = useState(null);
  const navigate = useNavigate();

  const standardCategories = ["DSA", "Fundamentals", "AIML", "Database", "Web Development"];

  const resumeAiInterviews = useMemo(() => {
    return aiInterviews.filter(r => r.questionType === "Resume-Based Mock");
  }, [aiInterviews]);

  const goals = [
    { id: "faang", title: "Land a FAANG Job", icon: Rocket, desc: "Ace algorithmic rounds & high-scale system design sessions" },
    { id: "switch", title: "Switch Career / Role", icon: RefreshCw, desc: "Transition cleanly into Software Engineering or ML Specialist tracks" },
    { id: "placement", title: "University Placement", icon: GraduationCap, desc: "Prepare thoroughly for campus placement drives & internship interviews" },
    { id: "assessment", title: "Technical Skill Assessment", icon: BarChart3, desc: "Evaluate your coding and theory standing to find areas to improve" }
  ];

  const onboardingDomains = [
    { id: "DSA", title: "DSA", icon: Puzzle, desc: "Data Structures & Algorithms" },
    { id: "Fundamentals", title: "Fundamentals", icon: BookOpen, desc: "Operating Systems, DBMS & Networking" },
    { id: "AIML", title: "AIML", icon: Bot, desc: "Machine Learning & AI Core Concepts" },
    { id: "Database", title: "Database", icon: Database, desc: "SQL Queries & Database Management" },
    { id: "Web Development", title: "Web Development", icon: Globe, desc: "Frontend and Backend Technologies" }
  ];

  const renderOnboardingFlow = () => {
    return (
      <div className="liquid-glass rounded-3xl p-8 md:p-10 border border-white/5 max-w-3xl mx-auto my-10 shadow-2xl relative overflow-hidden">
        {/* Step progress bar header */}
        <div className="flex justify-between items-center mb-10 relative">
          <div className="absolute top-[18px] left-0 right-0 h-0.5 bg-white/5 pointer-events-none z-0" />
          <div 
            className="absolute top-[18px] left-0 h-0.5 bg-gradient-to-r from-brand to-[#22d3ee] transition-all duration-300 pointer-events-none z-10" 
            style={{ width: `${((onboardingStep - 1) / 2) * 100}%` }}
          />

          {[1, 2, 3].map((step) => {
            const isCompleted = onboardingStep > step;
            const isActive = onboardingStep === step;
            const stepTitles = ["Choose Goal", "Pick Domain", "Launch Mock"];
            return (
              <div key={step} className="flex flex-col items-center relative z-20">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border ${
                  isCompleted 
                    ? "bg-emerald-500 text-white border-transparent" 
                    : isActive 
                    ? "bg-[#22d3ee] text-black border-transparent shadow-[0_0_15px_rgba(34,211,238,0.4)]" 
                    : "bg-[#161616] text-white/50 border-white/10"
                }`}>
                  {isCompleted ? "✓" : step}
                </div>
                <span className={`text-[10px] uppercase tracking-wider font-extrabold mt-2.5 transition-all duration-300 ${
                  isActive ? "text-[#22d3ee]" : isCompleted ? "text-emerald-400" : "text-white/35"
                }`}>
                  {stepTitles[step - 1]}
                </span>
              </div>
            );
          })}
        </div>

        {/* STEP 1: CHOOSE GOAL */}
        {onboardingStep === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-black text-center text-white mb-2 flex items-center justify-center gap-2">
              <span>Welcome to InterviewBuddy!</span>
              <Rocket className="w-6 h-6 text-brand" />
            </h2>
            <p className="text-xs text-white/50 text-center mb-8 max-w-md mx-auto leading-relaxed">
              Let's kickstart your customized preparation track. What is your primary career goal right now?
            </p>

            <div className="flex flex-col gap-3.5 mb-8">
              {goals.map((g) => {
                const isSelected = selectedGoal === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => {
                      setSelectedGoal(g.id);
                      setTimeout(() => setOnboardingStep(2), 250);
                    }}
                    className={`w-full flex items-center gap-5 p-5 text-left border rounded-2xl cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? "bg-brand/10 border-brand/50 shadow-[0_0_20px_rgba(61,129,227,0.15)] scale-[1.01]" 
                        : "bg-white/[0.01] border-white/5 hover:border-white/20 hover:bg-white/[0.02]"
                    }`}
                  >
                    <span className="text-[#22d3ee] p-2 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
                      {React.createElement(g.icon, { className: "w-6 h-6" })}
                    </span>
                    <div className="flex-1">
                      <div className="text-sm font-extrabold text-white mb-0.5">{g.title}</div>
                      <div className="text-xs text-white/45 leading-relaxed">{g.desc}</div>
                    </div>
                    <ChevronRight size={18} className="text-white/40" />
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setForceShowProfile(true)}
                className="text-xs font-semibold text-white/40 hover:text-white/80 transition-all cursor-pointer"
              >
                Skip Onboarding & Explore Dashboard ➔
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: PICK A DOMAIN */}
        {onboardingStep === 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-black text-center text-white mb-2 flex items-center justify-center gap-2">
              <span>Choose your target Domain</span>
              <Target className="w-6 h-6 text-brand" />
            </h2>
            <p className="text-xs text-white/50 text-center mb-8 max-w-md mx-auto leading-relaxed">
              Select the initial technical focus area you wish to assess and build capability in.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              {onboardingDomains.map((d) => {
                const isSelected = onboardingDomain === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => {
                      setOnboardingDomain(d.id);
                      localStorage.setItem("preselectedDomain", d.id);
                      setTimeout(() => setOnboardingStep(3), 250);
                    }}
                    className={`flex flex-col items-center text-center p-5 border rounded-2xl cursor-pointer transition-all duration-300 w-full ${
                      isSelected 
                        ? "bg-brand/10 border-brand/50 shadow-[0_0_20px_rgba(61,129,227,0.15)] scale-[1.02]" 
                        : "bg-white/[0.01] border-white/5 hover:border-white/20 hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-[#22d3ee]">
                      {React.createElement(d.icon, { className: "w-6 h-6" })}
                    </div>
                    <div className="text-xs font-extrabold text-white mb-1.5">{d.title}</div>
                    <div className="text-[10px] text-white/45 leading-relaxed">{d.desc}</div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setOnboardingStep(1)}
                className="text-xs font-semibold text-white/45 hover:text-white transition-all cursor-pointer"
              >
                ← Back
              </button>
              <button
                onClick={() => setForceShowProfile(true)}
                className="text-xs font-semibold text-white/45 hover:text-white transition-all cursor-pointer"
              >
                Skip Onboarding ➔
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: LAUNCH MOCK */}
        {onboardingStep === 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-black text-center text-white mb-2 flex items-center justify-center gap-2">
              <span>Ready to begin your journey!</span>
              <Sparkles className="w-6 h-6 text-[#22d3ee] animate-pulse" />
            </h2>
            <p className="text-xs text-white/50 text-center mb-8 max-w-md mx-auto leading-relaxed">
              Your custom path is configured. Let's take action and analyze your first baseline score!
            </p>

            <div className="bg-brand/5 border border-brand/20 rounded-2xl p-6 mb-8 text-center">
              <div className="text-[10px] font-black text-[#22d3ee] tracking-widest uppercase mb-1">Customized Plan</div>
              <div className="text-base font-extrabold text-white">
                {goals.find(g => g.id === selectedGoal)?.title} • <span className="text-brand">{onboardingDomain}</span>
              </div>
              <p className="text-xs text-white/50 mt-3 max-w-md mx-auto leading-relaxed">
                Completing a baseline AI mock interview now will immediately initialize your profile scoreboard, generate custom metrics, and unlock your first diagnostic report.
              </p>
            </div>

            <div className="flex flex-col gap-3.5 mb-8">
              <button
                onClick={() => navigate("/interview-type")}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-[#22d3ee] hover:brightness-[1.05] active:scale-[0.98] transition-all px-6 py-4 text-xs font-bold text-white shadow-[0_4px_15px_rgba(61,129,227,0.35)] cursor-pointer"
              >
                <Zap size={14} className="fill-current text-white animate-bounce" />
                <span>Launch baseline AI Mock Interview ({onboardingDomain})</span>
              </button>

              <button
                onClick={() => navigate("/human-interview")}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all px-6 py-3.5 text-xs font-semibold text-white/80 cursor-pointer"
              >
                <UserCheck size={14} className="text-[#22d3ee]" />
                <span>Schedule Expert Human Interview instead</span>
              </button>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => setOnboardingStep(2)}
                className="text-xs font-semibold text-white/45 hover:text-white transition-all cursor-pointer"
              >
                ← Back
              </button>
              <button
                onClick={() => setForceShowProfile(true)}
                className="text-xs font-semibold text-white/45 hover:text-white transition-all cursor-pointer"
              >
                Explore Profile Dashboard anyway ➔
              </button>
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  const getNormalizedCategory = (type) => {
    if (!type) return "Other";
    const t = type.trim().toUpperCase();
    if (t === "DBMS" || t === "SQL") return "Database";
    if (t === "DSA") return "DSA";
    if (t === "AIML" || t === "AI" || t === "AI-ML") return "AIML";
    if (t === "WEB DEVELOPMENT" || t === "WEBDEV" || t === "WEB DEV") return "Web Development";
    if (t === "FUNDAMENTALS") return "Fundamentals";
    
    const matched = standardCategories.find(cat => cat.toLowerCase() === type.trim().toLowerCase());
    return matched || type.trim();
  };

  const getGroupedReports = () => {
    const groups = {};
    standardCategories.forEach(cat => {
      groups[cat] = [];
    });

    aiInterviews.forEach(report => {
      if (report.questionType === "Resume-Based Mock") return;
      const cat = getNormalizedCategory(report.questionType);
      if (!groups[cat]) {
        groups[cat] = [];
      }
      groups[cat].push(report);
    });

    return groups;
  };

  const getDifficultyColor = (diff) => {
    const d = (diff || "easy").toLowerCase();
    if (d === "easy") return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    if (d === "medium") return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
  };

  const getReportTitle = (report) => {
    let stmt = report.questionStatement || "";
    if (stmt.startsWith("Q1:")) {
      const parts = stmt.split("\n\n");
      stmt = parts[0].replace(/^Q1:\s*/, "");
    }
    return stmt.length > 70 ? stmt.substring(0, 70) + "..." : stmt;
  };

  const getFeedbackSummary = (report) => {
    const isCompleted = !report.status || report.status === "completed";
    if (!isCompleted) {
      if (report.status === "processing") {
        return "AI is analyzing your submission details. This will update dynamically in a few seconds...";
      }
      if (report.status === "failed_quota") {
        return "Gemini API daily quota limit reached. The background worker is queued to retry and regenerate this report as soon as credits reset.";
      }
      if (report.status === "failed_timeout") {
        return "Request timed out during AI execution. The background worker will automatically retry in the next cycle.";
      }
      if (report.status === "retrying") {
        return "AI evaluation is being retried by the background worker. Regenerating report metrics...";
      }
      return "Evaluation pending in the queue. The background worker will generate your AI report shortly.";
    }
    let fb = report.feedback || "No feedback summary available.";
    return fb.length > 110 ? fb.substring(0, 110) + "..." : fb;
  };

  const topicIcons = { 
    DSA: Puzzle, 
    Fundamentals: BookOpen, 
    AIML: Bot, 
    Database: Database, 
    "Web Development": Globe,
    Other: Settings
  };

  useEffect(() => {
    const email = localStorage.getItem("email");
    const role = localStorage.getItem("role");

    if (!email || role?.toLowerCase() !== "interviewee") {
      toast.error("Please login as a Candidate to view this page");
      navigate("/login");
      return;
    }

    fetchProfileData(email);
  }, [navigate]);

  const fetchProfileData = async (email) => {
    try {
      setLoading(true);
      const { data } = await API.get(`/candidate/${email}/profile`);
      setHumanInterviews(data.humanInterviews || []);
      setAiInterviews(data.aiInterviews || []);
    } catch (error) {
      toast.error("Failed to load profile data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async (reportId) => {
    setRetryingIds(prev => new Set([...prev, reportId]));
    setAiInterviews(prev => prev.map(r =>
      r.id === reportId ? { ...r, status: "pending" } : r
    ));
    if (selectedAiReport?.id === reportId) {
      setSelectedAiReport(prev => ({ ...prev, status: "pending" }));
    }
    try {
      await API.post(`/candidate/report/${reportId}/retry`);
      toast.success("Report queued for regeneration! It will update automatically.");
    } catch (err) {
      toast.error("Failed to queue retry. Please try again.");
      console.error(err);
    } finally {
      setRetryingIds(prev => { const s = new Set(prev); s.delete(reportId); return s; });
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id } = deleteConfirm;
    setDeletingId(id);
    try {
      if (type === "ai") {
        await API.post(`/candidate/report/${id}/delete`);
        setAiInterviews(prev => prev.filter(r => r.id !== id));
        if (selectedAiReport?.id === id) setSelectedAiReport(null);
        toast.success("AI report deleted successfully.");
      } else {
        await API.post(`/candidate/booking/${id}/delete`);
        setHumanInterviews(prev => prev.filter(b => b.id !== id));
        toast.success("Interview booking deleted successfully.");
      }
    } catch (err) {
      toast.error("Failed to delete. Please try again.");
      console.error(err);
    } finally {
      setDeletingId(null);
      setDeleteConfirm(null);
    }
  };

  const fetchProfileDataSilently = async (email) => {
    try {
      const { data } = await API.get(`/candidate/${email}/profile`);
      setHumanInterviews(data.humanInterviews || []);
      setAiInterviews(data.aiInterviews || []);
      
      if (selectedAiReport) {
        const updated = (data.aiInterviews || []).find(r => r.id === selectedAiReport.id);
        if (updated) {
          setSelectedAiReport(updated);
        }
      }
    } catch (error) {
      console.error("Silent sync failed:", error);
    }
  };

  // Dynamic Polling Hook for pending/processing reports
  useEffect(() => {
    const hasPending = aiInterviews.some(
      report => (report.status && report.status !== "completed") ||
                ((!report.status || report.status === "completed") && report.score == null)
    );

    if (hasPending) {
      const email = localStorage.getItem("email");
      if (email) {
        const interval = setInterval(() => {
          fetchProfileDataSilently(email);
        }, 6000);
        return () => clearInterval(interval);
      }
    }
  }, [aiInterviews, selectedAiReport]);

  const closeModal = () => setSelectedAiReport(null);

  const selectedAiReportIsUnavailable = useMemo(() => {
    if (!selectedAiReport) return false;
    const fbLower = selectedAiReport.feedback ? selectedAiReport.feedback.toLowerCase() : '';
    const cqLower = selectedAiReport.codeQuality ? selectedAiReport.codeQuality.toLowerCase() : '';
    const statusLower = selectedAiReport.status ? selectedAiReport.status.toLowerCase() : '';
    return (
      !selectedAiReport.feedback ||
      fbLower.includes('rate limit') || 
      fbLower.includes('busy') || 
      fbLower.includes('high volume') || 
      fbLower.includes('failed') || 
      fbLower.includes('quota') || 
      fbLower.includes('unavailable') ||
      fbLower.includes('temporarily') ||
      cqLower === 'error' ||
      cqLower === 'analysis pending' ||
      ['failed_quota', 'failed_timeout', 'retrying', 'pending', 'processing'].includes(statusLower)
    );
  }, [selectedAiReport]);

  // Close 3-dot menu when clicking outside
  useEffect(() => {
    if (!openMenuId) return;
    const handler = () => setOpenMenuId(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [openMenuId]);

  // ----- Streak & Progress Dashboard Helpers -----
  const getLocalDateString = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getAllActivityDates = () => {
    const dates = new Set();
    const todayStr = getLocalDateString(new Date());
    
    humanInterviews.forEach(i => {
      const isPast = new Date(i.date) <= new Date();
      const isValidStatus = i.status === "CONFIRMED" || i.status === "PAID";
      if (isValidStatus && isPast) {
        let dStr = getLocalDateString(new Date(i.date));
        if (dStr > todayStr) dStr = todayStr;
        dates.add(dStr);
      }
    });
    aiInterviews.forEach(r => {
      // Treat any AI report with a timestamp or a non-null score as activity
      const ts = r.timestamp || r.createdAt;
      if (ts || r.score != null) {
        if (ts) {
          let dStr = getLocalDateString(new Date(ts));
          if (dStr > todayStr) dStr = todayStr;
          dates.add(dStr);
        }
      }
    });
    return Array.from(dates);
  };

  const calculateStreaks = () => {
    const dates = getAllActivityDates().sort();
    const todayStr = getLocalDateString(new Date());
    const dateSet = new Set(dates);
    
    let current = 0;
    let cursor = new Date();
    while (dateSet.has(getLocalDateString(cursor))) {
      current++;
      cursor.setDate(cursor.getDate() - 1);
    }
    
    let max = 0, cur = 1;
    if (dates.length > 0) {
      max = 1;
      for (let i = 1; i < dates.length; i++) {
        const prev = new Date(dates[i - 1]);
        const curDate = new Date(dates[i]);
        const diff = Math.round((curDate - prev) / (1000 * 60 * 60 * 24));
        if (diff === 1) {
          cur++;
        } else if (diff > 0) {
          max = Math.max(max, cur);
          cur = 1;
        }
      }
      max = Math.max(max, cur);
    }
    return { current, max, dates };
  };

  const getScoreData = () => {
    const data = aiInterviews
      .filter(r => (r.timestamp || r.createdAt) || r.score != null)
      .map(r => ({
        date: new Date(r.timestamp || r.createdAt),
        score: r.score,
        title: getReportTitle(r),
        category: getNormalizedCategory(r.questionType)
      }))
      .sort((a, b) => a.date - b.date);
    return data;
  };

  const StreakDashboard = () => {
    const { current, max } = useMemo(calculateStreaks, [humanInterviews, aiInterviews]);
    const scores = useMemo(getScoreData, [aiInterviews]);
    
    const [hoveredHeatmapDay, setHoveredHeatmapDay] = useState(null);

    const formatHeatmapDate = (dateStr) => {
      if (!dateStr) return "";
      const [year, month, day] = dateStr.split("-");
      const d = new Date(year, month - 1, day);
      return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    };
    
    const dateCounts = useMemo(() => {
      const counts = {};
      const todayStr = getLocalDateString(new Date());
      
      humanInterviews.forEach(i => {
        const isPast = new Date(i.date) <= new Date();
        const isValidStatus = i.status === "CONFIRMED" || i.status === "PAID";
        if (isValidStatus && isPast) {
          let d = getLocalDateString(new Date(i.date));
          if (d > todayStr) d = todayStr;
          counts[d] = (counts[d] || 0) + 1;
        }
      });
      aiInterviews.forEach(r => {
        // Include pending/failed reports as activity if they have a timestamp or score
        const ts = r.timestamp || r.createdAt;
        if (ts || r.score != null) {
          if (ts) {
            let d = getLocalDateString(new Date(ts));
            if (d > todayStr) d = todayStr;
            counts[d] = (counts[d] || 0) + 1;
          }
        }
      });
      return counts;
    }, [humanInterviews, aiInterviews]);

    const totalInterviews = humanInterviews.length + aiInterviews.filter(r => (r.timestamp || r.createdAt) || r.score != null).length;
    const avgScore = scores.length > 0 ? (scores.reduce((a, b) => a + b.score, 0) / scores.length).toFixed(1) : 0;
    
    // Category Breakdown
    const catCounts = {};
    scores.forEach(s => catCounts[s.category] = (catCounts[s.category] || 0) + 1);
    const topCats = Object.entries(catCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);

    // Heatmap array
    const heatmapDays = useMemo(() => {
      const days = [];
      const today = new Date();
      for (let i = 167; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        days.push(getLocalDateString(d));
      }
      return days;
    }, []);

    return (
      <div className="space-y-6 mb-8">
        
        {/* Top metrics grids */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Streak & Sessions */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
            <h2 className="text-[10px] font-black text-white/35 uppercase tracking-wider block mb-4">Overall diagnostic stats</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-3xl font-black text-white/90 tracking-tight">{totalInterviews}</div>
                <div className="text-[10px] text-white/40 font-bold uppercase mt-1">Interviews</div>
              </div>
              <div>
                <div className="text-3xl font-black text-[#22d3ee] tracking-tight flex items-center gap-1">
                  {current} <Flame size={20} className="text-[#ffd700] fill-[#ffd700] animate-pulse" />
                </div>
                <div className="text-[10px] text-white/40 font-bold uppercase mt-1">Current Streak</div>
              </div>
              <div>
                <div className="text-3xl font-black text-white/90 tracking-tight">{max}</div>
                <div className="text-[10px] text-white/40 font-bold uppercase mt-1">Max Streak</div>
              </div>
              <div>
                <div className="text-3xl font-black text-brand tracking-tight">Active</div>
                <div className="text-[10px] text-white/40 font-bold uppercase mt-1">Lobby State</div>
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/5">
            <h2 className="text-[10px] font-black text-white/35 uppercase tracking-wider block mb-4">Top Practiced Topics</h2>
            {topCats.length === 0 ? (
               <p className="text-xs text-white/30 italic">Complete interviews to see topics.</p>
            ) : (
              <div className="space-y-3">
                {topCats.map(([cat, count], idx) => (
                  <div key={cat} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-md bg-white/5 border border-white/10 text-[10px] font-black text-[#22d3ee] flex items-center justify-center">
                        #{idx + 1}
                      </div>
                      <span className="text-xs font-bold text-white/90">{cat}</span>
                    </div>
                    <div className="text-xs text-white/40 font-semibold">
                      {count} <span className="text-[10px] font-medium text-white/30 lowercase">sessions</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Average Score Gauge */}
          <div className="liquid-glass rounded-2xl p-6 border border-white/5 flex items-center justify-center gap-6 relative">
            <svg width="100" height="100" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="10" />
              <circle 
                cx="60" 
                cy="60" 
                r="50" 
                fill="none" 
                stroke="url(#scoreGrad)" 
                strokeWidth="10" 
                strokeDasharray="314" 
                strokeDashoffset={314 - (314 * parseFloat(avgScore)) / 100} 
                strokeLinecap="round" 
                transform="rotate(-90 60 60)" 
                className="transition-all duration-1000 ease-out" 
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3D81E3" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex flex-col">
              <span className="text-3xl font-black text-white/95 tracking-tight">{avgScore}%</span>
              <span className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Average Score</span>
            </div>
          </div>

        </div>

        {/* Heatmap & Score trend */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* Activity Heatmap Grid */}
          <div className="lg:col-span-5 liquid-glass rounded-2xl p-6 border border-white/5 overflow-hidden">
            <h2 className="text-xs font-bold text-white/40 uppercase tracking-wider block mb-4">Submission Activity (Last 168 Days)</h2>
            
            <div className="overflow-x-auto pb-2">
              <div className="flex gap-[3px] min-w-max">
                {Array.from({ length: 24 }).map((_, weekIdx) => (
                  <div key={weekIdx} className="flex flex-col gap-[3px]">
                    {Array.from({ length: 7 }).map((_, dayIdx) => {
                      const dayStr = heatmapDays[weekIdx * 7 + dayIdx];
                      const count = dateCounts[dayStr] || 0;
                      let bg = "rgba(255,255,255,0.03)";
                      if (count === 1) bg = "rgba(61,129,227,0.35)"; // brand/35
                      if (count === 2) bg = "rgba(61,129,227,0.65)"; // brand/65
                      if (count >= 3) bg = "#22d3ee"; // Brighter cyan
                      
                      const isSelected = selectedHeatmapDay?.date === dayStr;
                      const isHovered = hoveredHeatmapDay?.date === dayStr;
                      
                      return (
                        <div 
                          key={dayIdx} 
                          onClick={() => {
                            if (selectedHeatmapDay?.date === dayStr) {
                              setSelectedHeatmapDay(null);
                            } else {
                              setSelectedHeatmapDay({ date: dayStr, count });
                            }
                          }}
                          onMouseEnter={() => setHoveredHeatmapDay({ date: dayStr, count })}
                          onMouseLeave={() => setHoveredHeatmapDay(null)}
                          className={`w-3 h-3 rounded-[2px] cursor-pointer transition-all duration-150 border-box ${
                            isSelected || isHovered ? "scale-115" : "scale-100"
                          }`}
                          style={{ 
                            background: bg, 
                            boxShadow: isSelected 
                              ? "0 0 10px rgba(34,211,238,0.7)" 
                              : isHovered 
                              ? "0 0 6px rgba(61,129,227,0.4)" 
                              : "none",
                            border: isSelected 
                              ? "1.5px solid #ffffff" 
                              : "none"
                          }} 
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Click/Hover Heatmap display card */}
            <div className="mt-4 px-4 py-3 bg-black/40 border border-white/5 rounded-xl flex items-center justify-between min-h-[46px]">
              {(hoveredHeatmapDay || selectedHeatmapDay) ? (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-white/70 flex items-center gap-1.5">
                      <Calendar size={13} className="text-[#22d3ee]" />
                      <strong className="text-white font-extrabold">{formatHeatmapDate((hoveredHeatmapDay || selectedHeatmapDay).date)}</strong>
                    </span>
                    {hoveredHeatmapDay && !selectedHeatmapDay && (
                      <span className="text-[8px] font-black text-white/35 bg-white/5 px-1.5 py-0.5 rounded uppercase">Hovering</span>
                    )}
                    {selectedHeatmapDay && (hoveredHeatmapDay?.date === selectedHeatmapDay.date || !hoveredHeatmapDay) && (
                      <span className="text-[8px] font-black text-brand bg-brand/10 px-1.5 py-0.5 rounded uppercase">Selected</span>
                    )}
                  </div>
                  <div className="text-xs text-[#22d3ee] font-extrabold">
                    {(hoveredHeatmapDay || selectedHeatmapDay).count} {(hoveredHeatmapDay || selectedHeatmapDay).count === 1 ? "interview submission" : "interview submissions"}
                  </div>
                </>
              ) : (
                <span className="text-xs text-white/35 italic flex items-center gap-1.5">
                  <Lightbulb size={13} className="text-amber-400" />
                  <span>Click or hover on a box to view date activity details</span>
                </span>
              )}
            </div>

            {/* Heatmap Legend */}
            <div className="flex items-center gap-1.5 mt-3 text-[10px] text-white/40 font-bold">
              <span>Less</span>
              <div className="w-3 h-3 rounded-[2px] bg-white/5" />
              <div className="w-3 h-3 rounded-[2px] bg-[#3d81e3]/30" />
              <div className="w-3 h-3 rounded-[2px] bg-[#3d81e3]/70" />
              <div className="w-3 h-3 rounded-[2px] bg-[#22d3ee]" />
              <span>More</span>
            </div>
          </div>

          {/* Area progress chart */}
          <div className="lg:col-span-7 liquid-glass rounded-2xl p-6 border border-white/5 flex flex-col justify-between">
            <h2 className="text-[10px] font-black text-white/35 uppercase tracking-wider block mb-4">Score Trend (AI Mocks)</h2>
            {scores.length < 2 ? (
              <p className="text-xs text-white/30 italic py-6">Take at least 2 AI mock interviews to see a progress chart.</p>
            ) : (
              <div className="flex-1 min-h-[120px] relative mt-2">
                <svg width="100%" height="100%" viewBox="0 0 500 160" preserveAspectRatio="none" className="overflow-visible absolute inset-0">
                  {/* Grid lines */}
                  {[0,0.5,1].map(p=> (
                    <line key={p} x1={25} y1={160 - p*140} x2={500} y2={160 - p*140} stroke="rgba(255,255,255,0.03)" strokeWidth={1} />
                  ))}
                  {/* Axis labels */}
                  {["0","50","100"].map((lbl,i)=> (
                    <text key={i} x={18} y={160 - i*70 + 4} fill="rgba(255,255,255,0.2)" fontSize={11} textAnchor="end">{lbl}</text>
                  ))}
                  {/* Area Fill */}
                  <path d={scores.map((s,i)=>{
                    const x = (i/(scores.length-1))*460 + 40;
                    const y = 160 - (s.score/100)*140;
                    return i===0 ? `M${x},${y}` : `L${x},${y}`;
                  }).join(" ") + ` L500,160 L40,160 Z`} fill="url(#areaGrad)" />
                  {/* Line */}
                  <path d={scores.map((s,i)=>{
                    const x = (i/(scores.length-1))*460 + 40;
                    const y = 160 - (s.score/100)*140;
                    return i===0 ? `M${x},${y}` : `L${x},${y}`;
                  }).join(" ")} stroke="#3d81e3" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="rgba(61,129,227,0.25)" />
                      <stop offset="100%" stopColor="rgba(61,129,227,0)" />
                    </linearGradient>
                  </defs>
                  {/* Points */}
                  {scores.map((s,i)=>{
                    const x = (i/(scores.length-1))*460 + 40;
                    const y = 160 - (s.score/100)*140;
                    return (
                      <g key={i} className="score-dot-group cursor-pointer">
                        <circle cx={x} cy={y} r={4} fill="#0c0c0c" stroke="#3d81e3" strokeWidth={2.5} className="score-dot transition-all duration-200" />
                        <rect x={x - 65} y={y - 45} width="130" height="34" rx="6" fill="#161616" stroke="rgba(255,255,255,0.1)" strokeWidth="1" className="score-tooltip opacity-0 pointer-events-none transition-all duration-200" />
                        <text x={x} y={y - 23} fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle" className="score-tooltip opacity-0 pointer-events-none transition-all duration-200">
                          {s.score}% • {s.date.toLocaleDateString(undefined, {month:'short', day:'numeric'})}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            )}
          </div>

        </div>

      </div>
    );
  };

  return (
    <div className="relative min-h-screen pb-24 text-white z-10">
      
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes dropIn {
          from { opacity: 0; transform: scale(0.95) translateY(-5px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
        @keyframes fadeInModal {
          from { opacity: 0; transform: scale(0.97); }
          to   { opacity: 1; transform: scale(1); }
        }
        .score-dot-group:hover .score-tooltip { opacity: 1 !important; transform: translateY(0); }
        .score-dot-group:hover .score-dot { r: 6.5px; fill: #3d81e3 !important; }
      `}</style>

      {/* TOP HEADER BAR */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5 bg-[#0c0c0c]/60 backdrop-blur-xl sticky top-0 z-40">
        <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => navigate("/interview-choice")}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-brand/25">
            <LogoMark className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">
            Interview <span className="text-[#22d3ee]">Buddy</span>
          </span>
        </div>

        <button 
          onClick={() => navigate("/interview-choice")} 
          className="flex items-center gap-2 rounded-full px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all text-xs font-semibold text-white/80"
        >
          <ArrowLeft size={14} className="text-white/75" />
          Back to Dashboard
        </button>
      </nav>

      <div className="max-w-7xl mx-auto px-6 mt-10 relative z-10">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-10 h-10 rounded-full border-[3px] border-cyan-500/10 border-t-cyan-400 animate-spin mb-4" />
            <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Loading candidate profile...</p>
          </div>
        ) : (humanInterviews.length === 0 && aiInterviews.length === 0 && !forceShowProfile) ? (
          renderOnboardingFlow()
        ) : (
          <>
            <StreakDashboard />
            
            {/* Primary navigation Tabs */}
            <div className="flex gap-2.5 border-b border-white/5 pb-5 mb-8">
              {[
                { id: "human", label: "Expert Scheduled Mocks", icon: Calendar },
                { id: "ai", label: "AI Topic Mocks", icon: Cpu },
                { id: "resume", label: "Resume Tailored Mocks", icon: FileText }
              ].map((tab) => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button 
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition-all border duration-200 cursor-pointer ${
                      isSelected 
                        ? "bg-brand border-brand text-white shadow-[0_4px_15px_rgba(61,129,227,0.35)]" 
                        : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={14} className={isSelected ? "text-[#22d3ee]" : "text-white/40"} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENT SPACES */}
            <div>
              
              {/* HUMAN INTERVIEWS WORKSPACE */}
              {activeTab === "human" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {humanInterviews.length === 0 ? (
                    <div className="col-span-full text-center py-20 text-white/30 flex flex-col items-center">
                      <Calendar size={48} className="mb-4 text-white/10" />
                      <p className="text-xs font-semibold">No expert scheduled mock interviews booked yet.</p>
                      <button 
                        onClick={() => navigate("/human-interview")}
                        className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-brand/10 border border-brand/20 hover:bg-brand/20 hover:border-brand/30 active:scale-[0.98] transition-all px-5 py-2.5 text-xs font-bold text-brand cursor-pointer"
                      >
                        <Plus size={14} /> Book Expert Interview
                      </button>
                    </div>
                  ) : (
                    humanInterviews.map((interview, index) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const interviewDate = new Date(interview.date);
                      const isPassed = interviewDate < today;
                      const menuKey = `human-${interview.id}`;

                      return (
                        <div 
                          key={index} 
                          className="liquid-glass rounded-2xl border border-white/5 relative overflow-hidden flex flex-col justify-between p-6"
                        >
                          {/* 3-dot dropdown settings menu */}
                          <div className="absolute top-5 right-5 z-20">
                            <button
                              onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === menuKey ? null : menuKey); }}
                              className="text-white/40 hover:text-white w-8 h-8 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 flex items-center justify-center transition-all"
                            >
                              <MoreVertical size={16} />
                            </button>
                            
                            <AnimatePresence>
                              {openMenuId === menuKey && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                  className="absolute top-9 right-0 bg-[#161616] border border-white/10 rounded-xl p-1.5 min-w-[150px] shadow-2xl z-30"
                                >
                                  <button
                                    onClick={() => { setOpenMenuId(null); setDeleteConfirm({ type: "human", id: interview.id, title: `Mock with ${interview.interviewerEmail}` }); }}
                                    className="flex items-center gap-2 w-full p-2.5 hover:bg-rose-500/10 rounded-lg text-rose-400 hover:text-rose-300 text-xs font-bold transition-all text-left cursor-pointer"
                                  >
                                    <Trash2 size={13} />
                                    Delete Booking
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Inner Content wrapper */}
                          <div className={`space-y-5 ${isPassed ? "opacity-45" : "opacity-100"}`}>
                            <div className="flex justify-between items-start pr-8">
                              <div>
                                <span className="text-[10px] font-black text-white/35 uppercase tracking-wider block mb-1">Expert Mentor</span>
                                <h3 className="text-sm font-extrabold text-white truncate max-w-[200px]">{interview.interviewerEmail}</h3>
                              </div>
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wide uppercase ${
                                isPassed 
                                  ? "bg-white/5 text-white/50 border border-white/5" 
                                  : interview.status === 'CONFIRMED' || interview.status === 'PAID'
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              }`}>
                                {isPassed ? "EXPIRED" : interview.status}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-[9px] font-bold text-white/30 uppercase tracking-wide block mb-0.5">Date</span>
                                <p className="font-semibold text-white/80">{interview.date}</p>
                              </div>
                              <div>
                                <span className="text-[9px] font-bold text-white/30 uppercase tracking-wide block mb-0.5">Time Slot</span>
                                <p className="font-semibold text-white/80">{interview.selectedSlot}</p>
                              </div>
                            </div>

                            {isPassed ? (
                              <div className="text-center bg-white/5 text-white/40 border border-white/5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider">
                                Session Completed
                              </div>
                            ) : interview.meetLink ? (
                              <a 
                                href={interview.meetLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-[1.05] active:scale-[0.98] transition-all text-white py-3 rounded-xl font-bold text-xs shadow-md"
                              >
                                <Video size={13} /> Join Meeting
                              </a>
                            ) : (
                              <div className="text-center bg-white/5 text-white/40 border border-white/5 py-2.5 rounded-xl text-xs font-semibold">
                                Lobby link pending
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* AI MOCK REPORTS WORKSPACE */}
              {activeTab === "ai" && (
                <div className="space-y-6">
                  {/* Category Pill Sub-nav */}
                  <div className="flex gap-2 flex-wrap border-b border-white/5 pb-4">
                    {[...new Set([...standardCategories, ...aiInterviews.filter(r => r.questionType !== "Resume-Based Mock").map(r => getNormalizedCategory(r.questionType))])].map((cat) => {
                      const count = getGroupedReports()[cat]?.length || 0;
                      const isSelected = selectedSubTab === cat;
                      return (
                        <button
                          key={cat}
                          onClick={() => setSelectedSubTab(cat)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                            isSelected 
                              ? "bg-white/10 text-white border-white/15 shadow-sm" 
                              : "bg-white/5 border-white/5 text-white/45 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          <span className="text-[#22d3ee] flex items-center justify-center">
                            {React.createElement(topicIcons[cat] || Settings, { className: "w-4 h-4" })}
                          </span>
                          <span>{cat}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                            isSelected ? "bg-brand/20 text-[#22d3ee]" : "bg-white/5 text-white/30"
                          }`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Reports list grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(!getGroupedReports()[selectedSubTab] || getGroupedReports()[selectedSubTab].length === 0) ? (
                      <div className="col-span-full liquid-glass border border-dashed border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#22d3ee] mb-2">
                          {React.createElement(topicIcons[selectedSubTab] || Settings, { className: "w-6 h-6" })}
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-white mb-1">No {selectedSubTab} Mock Reports</h3>
                          <p className="text-xs text-white/40 max-w-sm mx-auto leading-relaxed">
                            You haven't completed any baseline diagnostics or AI practice runs under the {selectedSubTab} category.
                          </p>
                        </div>
                        <button
                          onClick={() => navigate("/interview-type")}
                          className="mt-2 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand to-[#22d3ee] hover:brightness-[1.05] active:scale-[0.98] transition-all px-5 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer"
                        >
                          <Play size={13} fill="white" className="text-white" /> Start {selectedSubTab} Mock
                        </button>
                      </div>
                    ) : (
                      getGroupedReports()[selectedSubTab].map((report, idx) => {
                        const isHovered = hoveredCardIndex === idx;
                        const dateStr = new Date(report.timestamp).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        });
                        const menuKey = `ai-${report.id}`;

                        return (
                          <div
                            key={idx}
                            onMouseEnter={() => setHoveredCardIndex(idx)}
                            onMouseLeave={() => setHoveredCardIndex(null)}
                            className={`liquid-glass rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                              isHovered ? "border-brand/35 hover:-translate-y-1 hover:shadow-2xl" : "border-white/5"
                            }`}
                          >
                            {/* Card top edge gradient color */}
                            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-brand to-[#22d3ee] transition-all duration-200" style={{ opacity: isHovered ? 1 : 0 }} />

                            {/* 3-dot kebab menu settings */}
                            <div className="absolute top-5 right-5 z-20">
                              <button
                                onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === menuKey ? null : menuKey); }}
                                className="text-white/40 hover:text-white w-8 h-8 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 flex items-center justify-center transition-all"
                              >
                                <MoreVertical size={16} />
                              </button>
                              
                              <AnimatePresence>
                                {openMenuId === menuKey && (
                                  <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                    className="absolute top-9 right-0 bg-[#161616] border border-white/10 rounded-xl p-1.5 min-w-[150px] shadow-2xl z-30"
                                  >
                                    <button
                                      onClick={() => { setOpenMenuId(null); setDeleteConfirm({ type: "ai", id: report.id, title: getReportTitle(report) }); }}
                                      className="flex items-center gap-2 w-full p-2.5 hover:bg-rose-500/10 rounded-lg text-rose-400 hover:text-rose-300 text-xs font-bold transition-all text-left cursor-pointer"
                                    >
                                      <Trash2 size={13} />
                                      Delete Report
                                    </button>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>

                            <div>
                              <div className="flex justify-between items-center pr-8 mb-4">
                                <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${getDifficultyColor(report.difficulty)}`}>
                                  {report.difficulty || "easy"}
                                </span>
                                <span className="text-[10px] text-white/40 font-bold">{dateStr}</span>
                              </div>

                              <h3 className="text-sm font-extrabold text-white leading-relaxed mb-2 min-h-[40px]">
                                {getReportTitle(report)}
                              </h3>

                              <p className="text-xs text-white/45 leading-relaxed mb-6 min-h-[50px]">
                                {getFeedbackSummary(report)}
                              </p>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                              <div>
                                <span className="text-[8px] font-black text-white/30 uppercase tracking-widest block mb-0.5">Score</span>
                                {(!report.status || report.status === "completed") ? (
                                  report.score !== null && report.score !== undefined ? (
                                    <span className={`text-base font-black tracking-tight ${
                                      report.score >= 80 ? "text-emerald-400" : report.score >= 50 ? "text-amber-400" : "text-rose-400"
                                    }`}>
                                      {report.score}%
                                    </span>
                                  ) : (
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleRetry(report.id); }}
                                      disabled={retryingIds.has(report.id)}
                                      className="mt-1 px-2.5 py-1 bg-brand/10 hover:bg-brand/20 border border-brand/25 text-white/90 hover:text-white rounded-lg text-[9px] font-black tracking-wide transition-all active:scale-[0.98] cursor-pointer flex items-center gap-1"
                                    >
                                      <RotateCw size={9} />
                                      Retry
                                    </button>
                                  )
                                ) : (
                                  <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-brand">
                                    {report.status === "processing" ? (
                                      <>
                                        <div className="w-3 h-3 rounded-full border border-brand/20 border-t-brand animate-spin" />
                                        <span>Analyzing...</span>
                                      </>
                                    ) : report.status === "failed_quota" ? (
                                      <span className="text-rose-400">Quota Limit</span>
                                    ) : report.status === "failed_timeout" ? (
                                      <span className="text-amber-400">Timeout</span>
                                    ) : report.status === "retrying" ? (
                                      <>
                                        <div className="w-3 h-3 rounded-full border border-amber-500/20 border-t-amber-500 animate-spin" />
                                        <span className="text-amber-500">Retrying...</span>
                                      </>
                                    ) : (
                                      <span className="text-white/40">Pending</span>
                                    )}
                                  </div>
                                )}
                              </div>

                              <button
                                onClick={() => setSelectedAiReport(report)}
                                className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all duration-200 cursor-pointer ${
                                  isHovered 
                                    ? "bg-gradient-to-r from-brand to-[#22d3ee] text-white border-transparent shadow-sm" 
                                    : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
                                }`}
                              >
                                View Analysis
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}

              {/* RESUME AI REPORTS WORKSPACE */}
              {activeTab === "resume" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {resumeAiInterviews.length === 0 ? (
                    <div className="col-span-full liquid-glass border border-dashed border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#22d3ee] mb-2">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-white mb-1">No Resume Mock Reports</h3>
                        <p className="text-xs text-white/40 max-w-sm mx-auto leading-relaxed">
                          You haven't completed any customized resume-based AI mock interviews yet.
                        </p>
                      </div>
                      <button
                        onClick={() => navigate("/resume-interview")}
                        className="mt-2 flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand to-[#22d3ee] hover:brightness-[1.05] active:scale-[0.98] transition-all px-5 py-2.5 text-xs font-bold text-white shadow-md cursor-pointer"
                      >
                        <Play size={13} fill="white" className="text-white" /> Start Resume Practice
                      </button>
                    </div>
                  ) : (
                    resumeAiInterviews.map((report, idx) => {
                      const isHovered = hoveredCardIndex === idx;
                      const dateStr = new Date(report.timestamp).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      });
                      const menuKey = `resume-${report.id}`;

                      return (
                        <div
                          key={idx}
                          onMouseEnter={() => setHoveredCardIndex(idx)}
                          onMouseLeave={() => setHoveredCardIndex(null)}
                          className={`liquid-glass rounded-2xl p-6 border flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                            isHovered ? "border-brand/35 hover:-translate-y-1 hover:shadow-2xl" : "border-white/5"
                          }`}
                        >
                          {/* Card top edge gradient color */}
                          <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-brand to-[#22d3ee] transition-all duration-200" style={{ opacity: isHovered ? 1 : 0 }} />

                          {/* 3-dot kebab menu settings */}
                          <div className="absolute top-5 right-5 z-20">
                            <button
                              onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === menuKey ? null : menuKey); }}
                              className="text-white/40 hover:text-white w-8 h-8 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 flex items-center justify-center transition-all"
                            >
                              <MoreVertical size={16} />
                            </button>
                            
                            <AnimatePresence>
                              {openMenuId === menuKey && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                  className="absolute top-9 right-0 bg-[#161616] border border-white/10 rounded-xl p-1.5 min-w-[150px] shadow-2xl z-30"
                                >
                                  <button
                                    onClick={() => { setOpenMenuId(null); setDeleteConfirm({ type: "ai", id: report.id, title: getReportTitle(report) }); }}
                                    className="flex items-center gap-2 w-full p-2.5 hover:bg-rose-500/10 rounded-lg text-rose-400 hover:text-rose-300 text-xs font-bold transition-all text-left cursor-pointer"
                                  >
                                    <Trash2 size={13} />
                                    Delete Report
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          <div>
                            <div className="flex justify-between items-center pr-8 mb-4">
                              <span className="px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-brand/10 text-brand border border-brand/20">
                                RESUME MOCK
                              </span>
                              <span className="text-[10px] text-white/40 font-bold">{dateStr}</span>
                            </div>

                            <h3 className="text-sm font-extrabold text-white leading-relaxed mb-2 min-h-[40px]">
                              {getReportTitle(report)}
                            </h3>

                            <p className="text-xs text-white/45 leading-relaxed mb-6 min-h-[50px]">
                              {getFeedbackSummary(report)}
                            </p>
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t border-white/5">
                            <div>
                              <span className="text-[8px] font-black text-white/30 uppercase tracking-widest block mb-0.5">Score</span>
                              {(!report.status || report.status === "completed") ? (
                                report.score !== null && report.score !== undefined ? (
                                  <span className={`text-base font-black tracking-tight ${
                                    report.score >= 80 ? "text-emerald-400" : report.score >= 50 ? "text-amber-400" : "text-rose-400"
                                  }`}>
                                    {report.score}%
                                  </span>
                                ) : (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleRetry(report.id); }}
                                    disabled={retryingIds.has(report.id)}
                                    className="mt-1 px-2.5 py-1 bg-brand/10 hover:bg-brand/20 border border-brand/25 text-white/90 hover:text-white rounded-lg text-[9px] font-black tracking-wide transition-all active:scale-[0.98] cursor-pointer flex items-center gap-1"
                                  >
                                    <RotateCw size={9} />
                                    Retry
                                  </button>
                                )
                              ) : (
                                <div className="flex items-center gap-1 mt-1 text-[10px] font-bold text-brand">
                                  {report.status === "processing" ? (
                                    <>
                                      <div className="w-3 h-3 rounded-full border border-brand/20 border-t-brand animate-spin" />
                                      <span>Analyzing...</span>
                                    </>
                                  ) : report.status === "failed_quota" ? (
                                    <span className="text-rose-400">Quota Limit</span>
                                  ) : report.status === "failed_timeout" ? (
                                    <span className="text-amber-400">Timeout</span>
                                  ) : report.status === "retrying" ? (
                                    <>
                                      <div className="w-3 h-3 rounded-full border border-amber-500/20 border-t-amber-500 animate-spin" />
                                      <span className="text-amber-500">Retrying...</span>
                                    </>
                                  ) : (
                                    <span className="text-white/40">Pending</span>
                                  )}
                                </div>
                              )}
                            </div>

                            <button
                              onClick={() => setSelectedAiReport(report)}
                              className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all duration-200 cursor-pointer ${
                                isHovered 
                                  ? "bg-gradient-to-r from-brand to-[#22d3ee] text-white border-transparent shadow-sm" 
                                  : "bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              View Analysis
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

            </div>
          </>
        )}
      </div>

      {/* AI REPORT ANALYSIS MODAL */}
      <AnimatePresence>
        {selectedAiReport && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl flex justify-center items-center z-[100] p-6"
            onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-4xl liquid-glass rounded-3xl border border-white/10 flex flex-col overflow-hidden shadow-2xl max-h-[85vh]"
            >
              {/* Modal Header */}
              <div className="px-8 py-5 border-b border-white/5 display: flex justify-between items-center bg-white/[0.01]">
                <div className="flex items-center gap-2">
                  <Cpu size={16} className="text-[#22d3ee]" />
                  <h2 className="text-base font-extrabold text-white">Diagnostic AI Report</h2>
                </div>
                <button 
                  onClick={closeModal} 
                  className="text-white/40 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg w-8 h-8 flex items-center justify-center border border-transparent hover:border-white/10 transition-all cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Modal Body scrollable */}
              <div className="p-8 overflow-y-auto space-y-6 flex-1">
                {selectedAiReport.status && ['pending', 'retrying', 'processing'].includes(selectedAiReport.status) ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                    <div className="w-12 h-12 rounded-full border-[3px] border-brand/20 border-t-[#22d3ee] animate-spin" />
                    <div>
                      <h3 className="text-base font-extrabold text-white mb-1">AI Diagnostics Pending</h3>
                      <p className="text-xs text-white/50 max-w-sm mx-auto leading-relaxed">
                        Our model parser is compiling complexity benchmarks, accuracy rates, and feedback. This view will dynamically synchronize when completed.
                      </p>
                    </div>
                  </div>
                ) : selectedAiReport.status && ['failed_quota', 'failed_timeout', 'error'].includes(selectedAiReport.status) ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                    <div className="w-12 h-12 rounded-full border-[3px] border-rose-500/20 bg-rose-500/10 flex items-center justify-center text-rose-400 text-sm font-bold">
                      !</div>
                    <div>
                      <h3 className="text-base font-extrabold text-white mb-1">AI Diagnostics Unavailable</h3>
                      <p className="text-xs text-white/50 max-w-sm mx-auto leading-relaxed">
                        This report was saved while the AI service was unavailable or rate limited. The system will retry in the background, or you can click Re-evaluate.
                      </p>
                      <button
                        onClick={() => handleRetry(selectedAiReport.id)}
                        disabled={retryingIds.has(selectedAiReport.id)}
                        className="mt-4 px-4 py-2 bg-brand hover:brightness-[1.05] text-white rounded-lg text-xs font-bold transition-all"
                      >
                        {retryingIds.has(selectedAiReport.id) ? 'Retrying…' : 'Re-evaluate now'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Unavailability Alert Banner */}
                    {selectedAiReportIsUnavailable && (
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex items-start gap-3 text-left mb-6">
                        <HelpCircle size={18} className="text-amber-400 mt-0.5 shrink-0" />
                        <div>
                          <h5 className="text-xs font-extrabold text-amber-400">Notice: AI Diagnostics Offline or Incomplete</h5>
                          <p className="text-[11px] text-white/60 leading-relaxed mt-1">
                            This report was saved during an AI service disruption or rate limit, resulting in a temporary 0% score or missing metrics. 
                            Your correct report will be automatically regenerated by the background queue shortly. You can also click <strong>Re-evaluate</strong> to queue it immediately.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Top highlights summary card */}
                    <div className="flex flex-wrap gap-6 items-center justify-between p-5 bg-white/[0.015] border border-white/5 rounded-2xl">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#22d3ee]">
                          {React.createElement(topicIcons[getNormalizedCategory(selectedAiReport.questionType)] || Settings, { className: "w-5 h-5" })}
                        </div>
                        <div>
                          <span className="text-[9px] font-black text-white/35 uppercase tracking-wider block">Assessment Domain</span>
                          <div className="text-xs font-extrabold text-white mt-0.5 flex items-center gap-2">
                            <span>{getNormalizedCategory(selectedAiReport.questionType)}</span>
                            <span className="w-1 h-1 rounded-full bg-white/20" />
                            <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider ${getDifficultyColor(selectedAiReport.difficulty)}`}>
                              {selectedAiReport.difficulty || "easy"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-8 items-center text-right">
                        <div>
                          <span className="text-[9px] font-black text-white/35 uppercase tracking-wider block mb-0.5">Completed Date</span>
                          <span className="text-xs font-bold text-white/70">{new Date(selectedAiReport.timestamp).toLocaleString()}</span>
                        </div>
                        <div className="border-l border-white/10 pl-6 text-right">
                          <span className="text-[9px] font-black text-white/35 uppercase tracking-wider block mb-0.5">Evaluation Score</span>
                          {selectedAiReport.score !== null && selectedAiReport.score !== undefined ? (
                            <div className="flex items-center gap-3 justify-end">
                              <span className={`text-xl font-black ${
                                selectedAiReport.score >= 80 ? "text-emerald-400" : selectedAiReport.score >= 50 ? "text-amber-400" : "text-rose-400"
                              }`}>
                                {selectedAiReport.score}%
                              </span>
                              <button
                                onClick={() => handleRetry(selectedAiReport.id)}
                                disabled={retryingIds.has(selectedAiReport.id)}
                                className="px-3 py-1.5 bg-brand/10 hover:bg-brand/20 border border-brand/25 text-white rounded-lg text-[10px] font-bold active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
                              >
                                <RotateCw size={11} className={retryingIds.has(selectedAiReport.id) ? "animate-spin" : ""} />
                                <span>Re-evaluate</span>
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleRetry(selectedAiReport.id)}
                              disabled={retryingIds.has(selectedAiReport.id)}
                              className="px-3 py-1.5 bg-brand hover:brightness-[1.05] border-transparent text-white rounded-lg text-[10px] font-bold active:scale-[0.98] transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <RotateCw size={11} className={retryingIds.has(selectedAiReport.id) ? "animate-spin" : ""} />
                              <span>Regenerate</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Question and Answer Grid */}
                    {(!selectedAiReport.expectedSolution && !selectedAiReport.starterCode && (!selectedAiReport.timeComplexity || selectedAiReport.timeComplexity === "N/A")) ? (
                      // THEORY DETAIL PREVIEW
                      <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-brand tracking-widest uppercase mb-4 flex items-center gap-1.5">
                          <FileText size={14} className="text-brand" />
                          <span>Question Response Sheet</span>
                        </h4>
                        <div className="space-y-4">
                          {selectedAiReport.questionStatement?.split("\n\n").map((q, idx) => {
                            const cleanQ = q.replace(/^Q\d+:\s*/, "");
                            return (
                              <div key={idx} className="bg-white/[0.01] border border-white/5 rounded-2xl p-5">
                                <div className="text-xs font-extrabold text-[#22d3ee] flex gap-2">
                                  <span className="text-brand">Q{idx + 1}:</span>
                                  <span>{cleanQ}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      // CODING DETAIL PREVIEW
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-[10px] font-black text-brand tracking-widest uppercase mb-2">Question Statement</h4>
                          <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl text-xs text-white/70 leading-relaxed font-semibold">
                            {selectedAiReport.questionStatement}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-[10px] font-black text-rose-400 tracking-widest uppercase mb-2">Submitted Solution</h4>
                            <pre className="bg-[#0b0d16] p-4 rounded-xl border border-rose-500/10 text-[11px] text-white/85 font-mono overflow-auto max-h-[220px]">
                              <code>{selectedAiReport.submittedCode}</code>
                            </pre>
                          </div>
                          <div>
                            <h4 className="text-[10px] font-black text-emerald-400 tracking-widest uppercase mb-2">Model Expected Code</h4>
                            <pre className="bg-[#0b0d16] p-4 rounded-xl border border-emerald-500/10 text-[11px] text-white/85 font-mono overflow-auto max-h-[220px]">
                              <code>
                                {isPlaceholderOrEmptyExpectedSolution(selectedAiReport.expectedSolution)
                                  ? "// This model expected code will be generated soon after AI starts working."
                                  : selectedAiReport.expectedSolution}
                              </code>
                            </pre>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* AI Feedback assessment panel */}
                    <div className="bg-brand/5 border border-brand/20 p-6 rounded-2xl space-y-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#c084fc]">
                        <Sparkles size={14} className="animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest">AI Performance Diagnostic Evaluation</span>
                      </div>

                      {(!selectedAiReport.expectedSolution && !selectedAiReport.starterCode && (!selectedAiReport.timeComplexity || selectedAiReport.timeComplexity === "N/A")) ? null : (
                        <div className="flex gap-6 flex-wrap text-xs pb-3 border-b border-white/5">
                          <div>
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-wide block mb-0.5">Time Complexity</span>
                            <span className="font-extrabold text-white">{selectedAiReport.timeComplexity || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-wide block mb-0.5">Space Complexity</span>
                            <span className="font-extrabold text-white">{selectedAiReport.spaceComplexity || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-white/30 uppercase tracking-wide block mb-0.5">Code Quality</span>
                            <span className="font-extrabold text-white">{selectedAiReport.codeQuality || "N/A"}</span>
                          </div>
                        </div>
                      )}

                      <div className="text-xs text-white/85 leading-relaxed white-space: pre-wrap">
                        {selectedAiReport.feedback}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ====== DELETE BOOKING / REPORT CONFIRMATION MODAL ====== */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl flex items-center justify-center z-[200] p-6"
            onClick={() => !deletingId && setDeleteConfirm(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-md liquid-glass rounded-3xl p-8 border border-rose-500/20 shadow-2xl text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mx-auto mb-5 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
                <Trash2 size={24} />
              </div>

              <h2 className="text-xl font-extrabold text-white mb-2">Confirm Delete</h2>
              <p className="text-xs text-white/50 mb-6 leading-relaxed max-w-xs mx-auto">
                Are you sure you want to permanently delete the selected report?
              </p>

              <div className="bg-rose-500/5 border border-rose-500/15 rounded-xl p-4 mb-6">
                <span className="text-xs font-bold text-rose-300 truncate block max-w-xs mx-auto">{deleteConfirm.title}</span>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setDeleteConfirm(null)}
                  disabled={!!deletingId}
                  className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all rounded-xl text-xs font-bold text-white/70"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  disabled={!!deletingId}
                  className="flex-1 py-3 bg-gradient-to-r from-rose-500 to-rose-600 hover:brightness-[1.05] text-white rounded-xl text-xs font-bold active:scale-[0.98] transition-all shadow-md cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {deletingId ? (
                    <>
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={13} />
                      Yes, Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CandidateProfile;
