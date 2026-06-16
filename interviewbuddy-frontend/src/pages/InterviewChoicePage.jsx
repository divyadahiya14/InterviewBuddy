import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Bot, 
  User, 
  Zap, 
  Brain, 
  BarChart, 
  Target, 
  CheckCircle, 
  Sparkles, 
  ChevronDown, 
  LogOut,
  ArrowRight,
  TrendingUp,
  Settings
} from "lucide-react";
import API from "../services/api";
import EditProfileModal from "../components/EditProfileModal";

// Inline Primitives
const LogoMark = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    {/* Brain body */}
    <path d="M16 5C13.3 5 11 6.7 10.2 9.2C8 9.7 6.3 11.7 6.3 14C6.3 15.7 7.1 17.2 8.5 18.1V22.5H23.5V18.1C24.9 17.2 25.7 15.7 25.7 14C25.7 11.7 24 9.7 21.8 9.2C21 6.7 18.7 5 16 5Z" fill="white"/>
    {/* Hemisphere divider */}
    <line x1="16" y1="6.5" x2="16" y2="22" stroke="rgba(100,140,230,0.4)" strokeWidth="1"/>
    {/* Brain folds */}
    <path d="M10.5 12.5C11.5 11.8 12.5 12.5 12 13.8" stroke="rgba(100,140,230,0.45)" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
    <path d="M19.5 12.5C20.5 11.8 21.5 12.5 21 13.8" stroke="rgba(100,140,230,0.45)" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
    {/* Base connector */}
    <rect x="12.5" y="22.5" width="7" height="2.5" rx="1.25" fill="white" opacity="0.85"/>
    {/* Circuit line left */}
    <line x1="6.3" y1="14" x2="3" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    <circle cx="3" cy="14" r="1.5" fill="white" opacity="0.7"/>
    {/* Circuit line right */}
    <line x1="25.7" y1="14" x2="29" y2="14" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    <circle cx="29" cy="14" r="1.5" fill="white" opacity="0.7"/>
    {/* Circuit line top */}
    <line x1="16" y1="5" x2="16" y2="2" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    <circle cx="16" cy="2" r="1.5" fill="white" opacity="0.7"/>
  </svg>
);

const SectionEyebrow = ({ label, tag }) => (
  <div className="inline-flex items-center gap-2">
    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">{label}</span>
    {tag && (
      <span className="ml-2 px-2 py-0.5 rounded-full border border-white/10 text-[9px] font-semibold text-white/50 bg-white/[0.02] tracking-wider uppercase">
        {tag}
      </span>
    )}
  </div>
);

export default function InterviewLandingPage() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
    document.title = "Candidate Dashboard - Interview Buddy";
    const pre = localStorage.getItem("preselectedDomain");
    if (pre === "Resume") {
      localStorage.removeItem("preselectedDomain");
      navigate("/resume-interview");
    }
  }, [navigate]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        await API.post("/auth/logout");
      } catch (err) {
        console.error("Logout failed", err);
      }
      localStorage.clear();
      navigate("/");
    }
  };

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userEmail = localStorage.getItem("email") || "";
  const [displayName, setDisplayName] = useState(user.name || userEmail.split("@")[0] || "Candidate");
  const displayInitial = displayName.charAt(0).toUpperCase();
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const whyItems = [
    { icon: <Zap size={20} />, title: "Precision Practice", desc: "Start specialized sessions in seconds" },
    { icon: <Brain size={20} />, title: "Hybrid Learning", desc: "Leverage AI speed and Human expertise" },
    { icon: <BarChart size={20} />, title: "Performance Metrics", desc: "Detailed analytics on every answer" },
    { icon: <Target size={20} />, title: "Industry Standard", desc: "Prep for top-tier tech companies" },
    { icon: <Bot size={20} />, title: "Instant Evaluation", desc: "AI feedback available 24/7" },
    { icon: <User size={20} />, title: "Expert Coaching", desc: "1-on-1 sessions with industry pros" },
  ];

  return (
    <div className="relative min-h-screen bg-transparent text-white select-none">

      {/* STICKY GLASSY NAVBAR */}
      <nav className="sticky top-0 z-[100] bg-[#0c0c0c]/40 backdrop-blur-xl border-b border-white/10 shadow-lg">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div 
            onClick={() => navigate("/")}
            className="cursor-pointer hover:opacity-90 active:scale-95 transition-all flex items-center gap-3 select-none"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-brand to-[#8b5cf6] rounded-xl flex items-center justify-center shadow-lg">
              <LogoMark className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight text-white flex items-center gap-1">
              Interview <span className="text-[#22d3ee]">Buddy</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            {[["Home", "start"], ["How it works", "how"], ["Why us", "why"]].map(([label, id]) => (
              <span 
                key={id} 
                onClick={() => scrollTo(id)} 
                className="text-white/70 hover:text-white cursor-pointer transition-colors"
              >
                {label}
              </span>
            ))}
          </div>

          {/* Profile Dropdown Actions */}
          <div className="relative" ref={dropdownRef}>
            <button 
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 active:scale-95 transition-all duration-150"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand to-[#8b5cf6] text-white flex items-center justify-center text-xs font-black shadow-md uppercase">
                {displayInitial}
              </div>
              <span className="text-xs font-bold text-white/90 hidden sm:inline">{displayName}</span>
              <ChevronDown size={14} className={`text-white/50 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-60 rounded-2xl border border-white/10 bg-[#0e1014]/95 backdrop-blur-2xl p-4 shadow-2xl space-y-3 select-none">
                <div className="space-y-0.5 px-2">
                  <p className="text-xs font-bold text-white leading-tight truncate">{displayName}</p>
                  <p className="text-[10px] font-mono text-white/40 truncate">{userEmail}</p>
                </div>
                
                <div className="h-[1px] bg-white/5" />
                
                <div className="flex flex-col gap-1">
                  <button onClick={() => { setDropdownOpen(false); setIsEditProfileOpen(true); }} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-white/5 text-white/70 hover:text-white transition-all text-left">
                    <Settings size={14} /> <span>Edit Profile</span>
                  </button>
                  <button onClick={() => { setDropdownOpen(false); navigate("/interview-type"); }} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-white/5 text-[#22d3ee] hover:bg-[#22d3ee]/5 transition-all text-left">
                    <Bot size={14} /> <span>AI Mock Interview</span>
                  </button>
                  <button onClick={() => { setDropdownOpen(false); navigate("/resume-interview"); }} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-white/5 text-amber-500 hover:bg-amber-500/5 transition-all text-left">
                    <Sparkles size={14} /> <span>Resume Practice</span>
                  </button>
                  <button onClick={() => { setDropdownOpen(false); navigate("/human-interview"); }} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-white/5 text-purple-400 hover:bg-purple-400/5 transition-all text-left">
                    <User size={14} /> <span>Book Expert</span>
                  </button>
                  <button onClick={() => { setDropdownOpen(false); navigate("/candidate-profile"); }} className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg hover:bg-white/5 text-brand hover:bg-brand/5 transition-all text-left">
                    <TrendingUp size={14} /> <span>My Profile</span>
                  </button>
                </div>
                
                <div className="h-[1px] bg-white/5" />
                
                <button onClick={() => { setDropdownOpen(false); handleLogout(); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold rounded-lg hover:bg-rose-500/10 text-rose-400 transition-all text-left">
                  <LogOut size={14} /> <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section id="start" className="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center flex flex-col items-center select-none">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <SectionEyebrow label="Platform Dashboard" tag="Candidate Core" />
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl md:text-6xl font-black tracking-tight leading-[1.02] max-w-3xl"
        >
          Elevate Your <span className="bg-gradient-to-r from-brand to-[#22d3ee] WebkitBackgroundClip: text background-clip: text text-transparent bg-clip-text font-black">Interview Performance</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 text-white/50 max-w-lg text-sm md:text-base leading-relaxed"
        >
          Bridge the gap between your technical potential and your dream engineering offer with our highly specialized preparation tracks.
        </motion.p>
      </section>

      {/* DUAL PATH ENTRY CARDS (Tailwind Grid & Liquid-Glass Cards) */}
      <section className="max-w-6xl mx-auto px-6 pb-20 relative z-10">
        <div className="grid md:grid-cols-3 gap-6">
          
          {/* Card 1: AI mock (highlight cyan) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="liquid-glass rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-white/10 hover:border-cyan-500/40 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-300 shadow-2xl h-[480px]"
          >
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-inner">
                <Bot size={26} />
              </div>
              
              <div className="space-y-2">
                <span className="text-[9px] font-bold tracking-widest text-cyan-400 uppercase font-mono bg-cyan-500/10 px-2 py-0.5 rounded">
                  AI-Powered Track
                </span>
                <h3 className="text-xl font-bold text-white">AI Mock Interview</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Practice specialized technical simulations with our intelligent agent. Get instant voice scores and complexity metrics.
                </p>
              </div>

              <ul className="space-y-2 pt-2">
                {[
                  "Technical simulation rounds",
                  "Real-time hint assistance",
                  "Instant performance scoring"
                ].map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs text-white/70 font-semibold select-none">
                    <CheckCircle size={14} className="text-[#22d3ee] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => navigate("/interview-type")}
              className="w-full py-3.5 rounded-xl bg-cyan-500 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-cyan-400 active:scale-[0.98] transition-all shadow-lg mt-6"
            >
              Start AI Interview
            </button>
          </motion.div>

          {/* Card 2: Resume Mock (highlight amber) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="liquid-glass rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-white/10 hover:border-amber-500/40 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-300 shadow-2xl h-[480px]"
          >
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner">
                <Sparkles size={26} />
              </div>
              
              <div className="space-y-2">
                <span className="text-[9px] font-bold tracking-widest text-amber-500 uppercase font-mono bg-amber-500/10 px-2 py-0.5 rounded">
                  Resume-Driven Track
                </span>
                <h3 className="text-xl font-bold text-white">Resume AI Practice</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Upload your PDF resume to extract skills locally and practice 5 highly customized questions based on your profile experience.
                </p>
              </div>

              <ul className="space-y-2 pt-2">
                {[
                  "Offline resume skill parsing",
                  "5 customized Gemini questions",
                  "Immersive mock practice round"
                ].map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs text-white/70 font-semibold select-none">
                    <CheckCircle size={14} className="text-[#f59e0b] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => navigate("/resume-interview")}
              className="w-full py-3.5 rounded-xl bg-amber-500 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-amber-400 active:scale-[0.98] transition-all shadow-lg mt-6"
            >
              Start Resume Practice
            </button>
          </motion.div>

          {/* Card 3: Human Expert (highlight purple) */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="liquid-glass rounded-3xl p-6 md:p-8 flex flex-col justify-between border border-white/10 hover:border-purple-500/40 bg-white/[0.01] hover:bg-white/[0.02] transition-all duration-300 shadow-2xl h-[480px]"
          >
            <div className="space-y-5">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shadow-inner">
                <User size={26} />
              </div>
              
              <div className="space-y-2">
                <span className="text-[9px] font-bold tracking-widest text-purple-400 uppercase font-mono bg-purple-500/10 px-2 py-0.5 rounded">
                  Expert-Led Track
                </span>
                <h3 className="text-xl font-bold text-white">Human Expert</h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  Connect with senior engineers from top tech companies. Receive deep behavioral and technical evaluation logs.
                </p>
              </div>

              <ul className="space-y-2 pt-2">
                {[
                  "1-on-1 expert live sessions",
                  "Comprehensive feedback report",
                  "Behavioral round coaching"
                ].map(item => (
                  <li key={item} className="flex items-center gap-2 text-xs text-white/70 font-semibold select-none">
                    <CheckCircle size={14} className="text-[#a855f7] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button 
              onClick={() => navigate("/human-interview")}
              className="w-full py-3.5 rounded-xl bg-purple-500 text-black font-extrabold text-xs uppercase tracking-wider hover:bg-purple-400 active:scale-[0.98] transition-all shadow-lg mt-6"
            >
              Book Expert
            </button>
          </motion.div>

        </div>
      </section>

      {/* STRATEGIC PREPARATION PATH */}
      <section id="how" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/5 relative z-10">
        <div className="text-center mb-16 space-y-4">
          <SectionEyebrow label="Rigorous pipeline" tag="Workflow" />
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
            How it Works
          </h2>
          <p className="text-white/60 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            A rigorous framework for technical and behavioral mock mastery
          </p>
        </div>

        {/* Workflow steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
          {[
            { icon: <Target size={22} className="text-[#22d3ee]" />, title: "Domain Select", desc: "Choose your target field or role" },
            { icon: <Zap size={22} className="text-amber-500" />, title: "Interactive Mock", desc: "Real-time practice simulation" },
            { icon: <BarChart size={22} className="text-purple-400" />, title: "Smart Insights", desc: "Data-driven performance report" },
            { icon: <TrendingUp size={22} className="text-emerald-400" />, title: "Skill Mastery", desc: "Targeted resources for growth" }
          ].map((step, i) => (
            <div key={i} className="liquid-glass rounded-2xl p-6 border border-white/10 bg-white/[0.01] hover:bg-white/[0.02] transition-colors relative space-y-4">
              <span className="absolute top-4 right-6 text-5xl font-black text-white/5 font-mono select-none">
                0{i + 1}
              </span>
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-2xl border border-white/10 shadow-inner">
                {step.icon}
              </div>
              <h3 className="text-base font-bold text-white tracking-wide">
                {step.title}
              </h3>
              <p className="text-xs text-white/50 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY US */}
      <section id="why" className="max-w-6xl mx-auto px-6 py-20 border-t border-white/10 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <SectionEyebrow label="Performance Edge" />
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
            Why Professionals <span className="bg-gradient-to-r from-brand to-[#22d3ee] WebkitBackgroundClip: text background-clip: text text-transparent bg-clip-text font-black">Choose Us</span>
          </h2>
          <p className="text-white/60 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Everything you need to secure your next career milestone
          </p>
        </div>

        {/* Why us grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyItems.map((item, i) => (
            <div 
              key={i} 
              className="liquid-glass rounded-2xl p-6 border border-white/10 bg-white/[0.01] hover:bg-white/[0.02] transition-colors space-y-3"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner ${i % 2 === 0 ? 'text-[#22d3ee] bg-[#22d3ee]/5 border-[#22d3ee]/15' : 'text-[#8b5cf6] bg-[#8b5cf6]/5 border-[#8b5cf6]/15'}`}>
                {item.icon}
              </div>
              <h3 className="text-sm font-bold text-white tracking-wide">{item.title}</h3>
              <p className="text-xs text-white/50 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <EditProfileModal 
        isOpen={isEditProfileOpen} 
        onClose={() => setIsEditProfileOpen(false)} 
        currentName={user.name || ""}
        onSave={(newName) => setDisplayName(newName)} 
      />
    </div>
  );
}