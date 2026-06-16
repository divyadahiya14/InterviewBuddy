import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Search, 
  ChevronRight, 
  ArrowRight,
  Clock, 
  Menu, 
  X,
  Volume2,
  FileText,
  Bot,
  Users,
  Code2,
  Layers,
  BarChart3,
  Coins,
  Rocket
} from "lucide-react";
import API from "../services/api";

// Inline Primitives
const LogoMark = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className}>
    <path d="M16 5C13.3 5 11 6.7 10.2 9.2C8 9.7 6.3 11.7 6.3 14C6.3 15.7 7.1 17.2 8.5 18.1V22.5H23.5V18.1C24.9 17.2 25.7 15.7 25.7 14C25.7 11.7 24 9.7 21.8 9.2C21 6.7 18.7 5 16 5Z" fill="currentColor"/>
    <line x1="16" y1="6.5" x2="16" y2="22" stroke="rgba(100,140,230,0.4)" strokeWidth="1"/>
    <path d="M10.5 12.5C11.5 11.8 12.5 12.5 12 13.8" stroke="rgba(100,140,230,0.45)" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
    <path d="M19.5 12.5C20.5 11.8 21.5 12.5 21 13.8" stroke="rgba(100,140,230,0.45)" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
    <rect x="12.5" y="22.5" width="7" height="2.5" rx="1.25" fill="currentColor" opacity="0.85"/>
    <line x1="6.3" y1="14" x2="3" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    <circle cx="3" cy="14" r="1.5" fill="currentColor" opacity="0.7"/>
    <line x1="25.7" y1="14" x2="29" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    <circle cx="29" cy="14" r="1.5" fill="currentColor" opacity="0.7"/>
    <line x1="16" y1="5" x2="16" y2="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.7"/>
    <circle cx="16" cy="2" r="1.5" fill="currentColor" opacity="0.7"/>
  </svg>
);

const AppleButton = ({ label = "Download Aura", onClick, full = false }) => (
  <button 
    onClick={onClick}
    className={`group inline-flex items-center justify-center gap-2 rounded-full bg-white text-black font-semibold text-sm px-6 py-3 transition-all hover:bg-white/90 active:scale-[0.98] ${full ? "w-full" : ""}`}
  >
    <LogoMark className="w-3.5 h-3.5 text-black" />
    <span>{label}</span>
    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-[1px]" />
  </button>
);

const SectionEyebrow = ({ label, tag, icon: Icon }) => (
  <div className="inline-flex items-center gap-2">
    {Icon ? (
      <Icon className="w-3.5 h-3.5 text-brand animate-pulse" />
    ) : (
      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
    )}
    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">{label}</span>
    {tag && (
      <span className="ml-2 px-2 py-0.5 rounded-full border border-white/10 text-[9px] font-semibold text-white/50 bg-white/[0.02] tracking-wider uppercase">
        {tag}
      </span>
    )}
  </div>
);

// Gradient style from spec
const gradientStyle = {
  backgroundImage: 'linear-gradient(to right, #091020 0%, #0B2551 12.5%, #A4F4FD 32.5%, #00d2ff 50%, #0B2551 67.5%, #091020 87.5%, #091020 100%)',
  backgroundSize: '200% auto',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
  filter: 'url(#c3-noise)'
};

function LandingPage() {
  const navigate = useNavigate();
  
  // Section Scroll Refs
  const featuresRef = useRef(null);
  const workflowRef = useRef(null);
  const earnRef = useRef(null);
  const faqRef = useRef(null);

  // States
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeWorkflow, setActiveWorkflow] = useState("resume");

  // Set meta title and description on mount
  useEffect(() => {
    document.title = "Interview Buddy - Premium AI Mock & Expert Interviews";
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Practice technical DSA, System Design, Core Fundamentals, or upload your resume for personalized AI mock interviews and expert coaching.";
  }, []);

  // Retrieve user session info
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const role = localStorage.getItem("role") || "interviewee";

  // Role selections and logins
  const handleRoleSelect = (roleToSelect) => {
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const currentRole = localStorage.getItem("role") || "";

    if (currentUser && currentRole && currentRole.toLowerCase() === roleToSelect.toLowerCase()) {
      if (roleToSelect.toLowerCase() === "interviewer") {
        navigate("/interviewer-dashboard");
      } else {
        navigate("/interview-choice");
      }
      return;
    }

    if (currentUser && currentRole && currentRole.toLowerCase() !== roleToSelect.toLowerCase()) {
      if (window.confirm(`You are currently logged in as a ${currentRole === "interviewer" ? "Expert" : "Candidate"}. To switch to the ${roleToSelect === "INTERVIEWER" ? "Expert" : "Candidate"} role, you must log out first. Proceed?`)) {
        handleLogoutDirect();
      }
      return;
    }

    localStorage.setItem("role", roleToSelect.toLowerCase());
    navigate("/login", { state: { role: roleToSelect.toLowerCase() } });
  };

  const handleLogoutDirect = async () => {
    try {
      await API.post("/auth/logout");
    } catch (err) {
      console.error(err);
    }
    localStorage.clear();
    window.location.reload();
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      await handleLogoutDirect();
    }
  };

  const goToDashboard = () => {
    if (role === "interviewer") navigate("/interviewer-dashboard");
    else navigate("/interview-choice");
  };

  // Original Features List (Preserved Exactly)
  const features = [
    { icon: FileText, title: "Resume AI Practice", desc: "Upload your resume PDF to extract skills locally and practice with 5 highly customized AI questions." },
    { icon: Bot, title: "Free AI Mock Interviews", desc: "Practice unlimited AI-driven interviews anytime with instant personalized feedback." },
    { icon: Users, title: "Expert Human Interviews", desc: "Real sessions with industry professionals at affordable prices." },
    { icon: Code2, title: "DSA & Coding", desc: "Structured problems from basics to advanced with live code execution." },
    { icon: Layers, title: "System Design", desc: "Learn scalable architecture with real interview-based questions." },
    { icon: BarChart3, title: "Performance Analytics", desc: "Track growth with detailed reports, scores, and improvement insights." },
  ];

  // Original FAQs (Preserved Exactly)
  const faqs = [
    { q: "How does Interview Buddy work?", a: "Choose AI or Expert path, pick your domain (DSA, System Design, AI/ML, Web Dev) or upload your Resume for personalized practice, and start practicing instantly." },
    { q: "Is AI interview practice free?", a: "Yes! AI-powered mock interviews (including resume-based interviews) are completely free with instant feedback." },
    { q: "Are expert interviews paid?", a: "Yes, expert-led sessions are paid but offered at very affordable prices." },
    { q: "What topics are covered?", a: "DSA, System Design, Core Fundamentals (OS, DBMS, CN), AI/ML, Full Stack Web Development, and Resume-Based Mock Interviews." },
    { q: "Do I get feedback after interviews?", a: "Yes — AI interviews give instant feedback, expert sessions include detailed personalized review." },
  ];

  // Smooth scroll handler
  const scrollTo = (ref) => {
    setMobileMenuOpen(false);
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0c0c0c] text-white selection:bg-brand/30 selection:text-white">
      
      {/* 1. Global Full-Screen Looping Background Video */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover pointer-events-none opacity-30 brightness-75"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_064122_c4750c0e-7476-4b44-94a2-a85a65c63bf2.mp4" 
        />
        {/* Subtle radial gradient overlay to enrich background glassiness */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] via-transparent to-[#0c0c0c]/85" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_0%,rgba(12,12,12,0.95)_90%)]" />
      </div>

      {/* 2. Fixed Vertical Guides */}
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 -translate-x-[calc(50%+36rem)] w-px bg-white/10 z-[5]" />
      <div className="hidden md:block pointer-events-none fixed inset-y-0 left-1/2 translate-x-[calc(-50%+36rem)] w-px bg-white/10 z-[5]" />

      {/* 3. Global SVG Noise Filter (Root level for shiny headline text) */}
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

      {/* SECTION 1 — NAVBAR */}
      <motion.nav 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-[100] bg-[#0c0c0c]/40 backdrop-blur-xl border-b border-white/10 shadow-lg"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: LogoMark + "Interview Buddy" Text */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="cursor-pointer hover:opacity-90 active:scale-95 transition-all flex items-center gap-3 select-none"
          >
            <div className="w-9 h-9 bg-gradient-to-br from-brand to-[#8b5cf6] rounded-xl flex items-center justify-center shadow-lg shadow-brand/20">
              <LogoMark className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight text-white flex items-center gap-1">
              Interview <span className="text-[#22d3ee]">Buddy</span>
            </span>
          </div>

          {/* Center Links - Desktop */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Features", target: featuresRef },
              { label: "Workflow", target: workflowRef },
              { label: "For Experts", target: earnRef },
              { label: "FAQs", target: faqRef }
            ].map((link, idx) => (
              <motion.span
                key={link.label}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
                onClick={() => scrollTo(link.target)}
                className="text-white/70 text-sm font-semibold hover:text-white cursor-pointer transition-colors tracking-wide"
              >
                {link.label}
              </motion.span>
            ))}
          </div>

          {/* Right Actions - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <button 
                  onClick={handleLogout} 
                  className="text-white/60 hover:text-rose-400 text-xs font-bold uppercase tracking-wider transition-colors px-4 py-2"
                >
                  Logout
                </button>
                <AppleButton label="Dashboard" onClick={goToDashboard} />
              </>
            ) : (
              <>
                <button 
                  onClick={() => handleRoleSelect("INTERVIEWER")} 
                  className="text-white/70 hover:text-brand text-xs font-bold uppercase tracking-wider transition-colors px-4 py-2 mr-1"
                >
                  Join as Expert
                </button>
                <AppleButton label="Join as Candidate" onClick={() => handleRoleSelect("INTERVIEWEE")} />
              </>
            )}
          </div>

          {/* Mobile Right Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center hover:bg-white/10 active:scale-95 transition-all text-white animate-pulse"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-white/10 bg-[#0c0c0c]/95 backdrop-blur-2xl"
            >
              <div className="px-6 py-6 flex flex-col gap-5">
                {[
                  { label: "Features", target: featuresRef },
                  { label: "Workflow", target: workflowRef },
                  { label: "For Experts", target: earnRef },
                  { label: "FAQs", target: faqRef }
                ].map((link) => (
                  <span
                    key={link.label}
                    onClick={() => scrollTo(link.target)}
                    className="text-white/75 text-base font-semibold hover:text-white cursor-pointer"
                  >
                    {link.label}
                  </span>
                ))}
                
                <hr className="border-white/10 my-1" />

                {user ? (
                  <div className="flex flex-col gap-3">
                    <AppleButton label="Dashboard" onClick={goToDashboard} full />
                    <button 
                      onClick={handleLogout} 
                      className="w-full text-center py-3 text-rose-400 font-bold border border-rose-500/20 bg-rose-500/5 rounded-full hover:bg-rose-500/10 active:scale-[0.98] transition-all text-sm uppercase tracking-wide"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <AppleButton label="Join as Candidate" onClick={() => handleRoleSelect("INTERVIEWEE")} full />
                    <button 
                      onClick={() => handleRoleSelect("INTERVIEWER")} 
                      className="w-full py-3 text-center border border-white/10 rounded-full font-bold hover:bg-white/5 active:scale-[0.98] transition-all text-white text-sm uppercase tracking-wide"
                    >
                      Become an Expert
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* SECTION 2 — HERO */}
      <section className="relative z-10 pt-16 md:pt-28 pb-20 px-6 max-w-6xl mx-auto flex flex-col items-center text-center">
        
        {/* Decorative Badge Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <SectionEyebrow label="AI-Powered Interview Platform" tag="v2.4" />
        </motion.div>

        {/* Cinematic Headline (Original content preserved) */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-7xl font-bold tracking-tight leading-[1.05] max-w-4xl text-white select-none"
        >
          Land Your Dream Job<br />
          <span className="animate-shiny inline-block pb-3 select-none" style={gradientStyle}>
            with Confidence
          </span>
        </motion.h1>

        {/* Original Content Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 text-white/60 max-w-xl text-base md:text-lg leading-[1.6]"
        >
          Practice real interview scenarios with AI and expert mentors. Upload your resume for customized questions, or master DSA and Core Fundamentals to ace your next tech interview.
        </motion.p>

        {/* Hero CTA Actions (Original content preserved) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-10 flex flex-col items-center gap-4 w-full"
        >
          <div className="flex flex-wrap gap-4 justify-center">
            <AppleButton label="Start Free AI Practice" onClick={() => handleRoleSelect("INTERVIEWEE")} />
            
            <button 
              id="landing-hero-resume-practice-btn"
              onClick={() => { localStorage.setItem("preselectedDomain", "Resume"); handleRoleSelect("INTERVIEWEE"); }}
              className="rounded-full border border-amber-500/25 bg-amber-500/5 text-amber-500 text-sm font-semibold px-6 py-3 hover:bg-amber-500/10 hover:border-amber-500/40 active:scale-[0.98] transition-all flex items-center gap-2 group shadow-[0_8px_32px_rgba(245,158,11,0.1)]"
            >
              <FileText className="w-4 h-4" />
              <span>Resume AI Practice</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
 
            <button 
              id="landing-hero-expert-practice-btn"
              onClick={() => handleRoleSelect("INTERVIEWEE")}
              className="rounded-full border border-white/15 bg-white/5 text-white text-sm font-semibold px-6 py-3 hover:bg-white/10 hover:border-white/30 active:scale-[0.98] transition-all flex items-center gap-2 group"
            >
              <Users className="w-4 h-4" />
              <span>Practice with Experts</span>
            </button>
          </div>
          
          <span className="text-xs text-white/45 font-mono tracking-wider mt-4">
            ⚡ Instant voice feedback & code execution sandbox
          </span>
        </motion.div>
      </section>

      {/* SECTION 4 — INTERACTIVE MOCKUP */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-16 md:py-24">
        
        {/* Main macOS window wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative rounded-2xl overflow-hidden border border-white/10 bg-[#0e1014]/90 backdrop-blur-2xl shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
        >
          {/* macOS window title bar */}
          <div className="h-12 bg-black/40 border-b border-white/5 flex items-center px-4 justify-between relative select-none">
            {/* Traffic Lights */}
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#ff5f57] border border-black/10 hover:brightness-75 transition-all cursor-pointer" />
              <span className="w-3 h-3 rounded-full bg-[#febc2e] border border-black/10 hover:brightness-75 transition-all cursor-pointer" />
              <span className="w-3 h-3 rounded-full bg-[#28c840] border border-black/10 hover:brightness-75 transition-all cursor-pointer" />
            </div>

            {/* Title label */}
            <div className="absolute inset-x-0 mx-auto text-center pointer-events-none">
              <span className="text-xs text-white/40 font-mono tracking-wide">
                AI Interview Session — Interview Buddy
              </span>
            </div>

            {/* Extra spacer */}
            <div className="w-16" />
          </div>

          {/* Window Body Grid */}
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center">
            
            {/* Left Column: Interview Q&A Block */}
            <div className="flex-1 space-y-5 w-full">
              {/* AI Interviewer block */}
              <div className="space-y-2">
                <div className="text-[11px] text-brand font-bold tracking-widest uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-brand" />
                  <span>AI INTERVIEWER</span>
                </div>
                <div className="background: rgba(99,102,241,0.08) border border-brand/20 bg-brand/5 rounded-xl p-4 md:p-5 text-sm text-white/90 leading-relaxed font-medium">
                  Explain the difference between BFS and DFS. When would you choose one over the other?
                </div>
              </div>

              {/* Candidate answer block */}
              <div className="space-y-2">
                <div className="text-[11px] text-emerald-400 font-bold tracking-widest uppercase flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <span>YOUR ANSWER</span>
                </div>
                <div className="border border-emerald-500/15 bg-emerald-500/[0.03] rounded-xl p-4 md:p-5 text-sm text-white/60 leading-relaxed font-medium">
                  BFS uses a queue and explores level by level — ideal for shortest path. DFS uses a stack and goes deep first — better for cycle detection and topological sorting.
                </div>
              </div>
            </div>

            {/* Right Column: Voice and Accuracy Metrics Block */}
            <div className="w-full md:w-52 flex-shrink-0 flex flex-col items-center justify-center space-y-4">
              
              {/* Score indicator card */}
              <div className="w-full bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5 text-center shadow-lg">
                <div className="text-3xl font-black text-emerald-400 font-mono">
                  87%
                </div>
                <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider mt-1">
                  Accuracy Score
                </div>
              </div>

              {/* Voice analysis waveforms */}
              <div className="w-full bg-white/[0.02] border border-white/5 rounded-xl p-4 flex flex-col items-center gap-3">
                
                {/* Waveform columns */}
                <div className="flex items-end justify-center gap-1.5 h-12 w-full py-1">
                  {[6, 14, 10, 20, 8, 24, 12, 18, 28, 16].map((h, i) => (
                    <motion.div 
                      key={i} 
                      animate={{ 
                        height: [4, h, 4],
                      }}
                      transition={{
                        duration: 0.8 + i * 0.08,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="w-1.5 rounded-full bg-gradient-to-t from-brand to-[#22d3ee]"
                    />
                  ))}
                </div>
                
                <span className="text-[10px] text-white/40 font-semibold tracking-wider uppercase font-mono">
                  Voice analysis
                </span>
              </div>

            </div>

          </div>
        </motion.div>
      </section>

      {/* SECTION 5 — FEATURES GRID (Original Content & Icon set) */}
      <section ref={featuresRef} className="max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <SectionEyebrow label="Features" tag="Domain Tracks" />
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
            Everything You Need to <span className="bg-gradient-to-r from-brand to-[#22d3ee] WebkitBackgroundClip: text background-clip: text text-transparent bg-clip-text font-black">Crack Interviews</span>
          </h2>
          <p className="text-white/60 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Comprehensive tools to prepare, practice, and perform your absolute best
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              onClick={() => handleRoleSelect("INTERVIEWEE")}
              className="liquid-glass rounded-2xl p-6 md:p-8 space-y-4 border border-white/10 hover:border-brand/40 bg-white/[0.01] hover:bg-white/[0.02] cursor-pointer transition-all duration-300 shadow-xl"
            >
              <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center shadow-inner select-none">
                <f.icon className="w-6 h-6 text-brand" />
              </div>
              <h3 className="text-base font-bold text-white tracking-wide">
                {f.title}
              </h3>
              <p className="text-xs text-white/50 leading-[1.6]">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 5.5 — WORKFLOW INTEGRATION */}
      <section ref={workflowRef} className="max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/5 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <SectionEyebrow label="Workflow" tag="Intelligent Engine" />
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
            How does <span className="bg-gradient-to-r from-[#22d3ee] to-brand WebkitBackgroundClip: text background-clip: text text-transparent bg-clip-text font-black">it work?</span>
          </h2>
          <p className="text-white/60 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Select a pathway below to view the optimized process from baseline preparation to direct hiring
          </p>
        </div>

        {/* Stateful Tab Selector Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 select-none max-w-2xl mx-auto">
          {[
            { id: "resume", label: "Resume AI Practice", icon: FileText, activeColor: "bg-amber-500/20 border-amber-500/40 text-amber-400" },
            { id: "ai", label: "AI Mock Interview", icon: Bot, activeColor: "bg-cyan-500/20 border-cyan-500/40 text-cyan-400" },
            { id: "expert", label: "Book an Expert", icon: Users, activeColor: "bg-brand/20 border-brand/40 text-brand" }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveWorkflow(tab.id)}
                className={`px-5 py-3 rounded-full border text-xs md:text-sm font-semibold transition-all active:scale-[0.98] duration-300 backdrop-blur-md cursor-pointer flex items-center gap-2
                  \${activeWorkflow === tab.id 
                    ? tab.activeColor 
                    : "border-white/10 bg-white/[0.02] text-white/60 hover:text-white hover:border-white/20"
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Step Content based on active state */}
        <div className="space-y-6">
          <div className="text-center mb-10">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-white/40">
              {activeWorkflow === "resume" && "Optimized Resume Practice Round"}
              {activeWorkflow === "ai" && "Instant AI Mock Session"}
              {activeWorkflow === "expert" && "Expert Human Coaching"}
            </span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {activeWorkflow === "resume" && [
              { num: "01", title: "Upload & Parse", desc: "Simply upload your PDF resume. Our advanced system parses your experience, skills, and projects.", color: "text-amber-500", border: "hover:border-amber-500/40" },
              { num: "02", title: "Custom Tailoring", desc: "The parsed profile is analyzed to curate high-fidelity technical and situational questions matching your level.", color: "text-brand", border: "hover:border-brand/40" },
              { num: "03", title: "Interactive Practice", desc: "Start a realistic practice round with 5 custom-tailored questions, voice support, and actionable insights.", color: "text-emerald-400", border: "hover:border-emerald-500/40" }
            ].map((w, idx) => (
              <motion.div 
                key={`resume-${idx}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`liquid-glass rounded-2xl p-8 border border-white/10 relative overflow-hidden transition-all duration-300 shadow-2xl bg-white/[0.01] ${w.border}`}
              >
                <div className={`text-5xl font-black ${w.color} opacity-[0.08] absolute top-4 right-6 font-mono select-none`}>
                  {w.num}
                </div>
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full bg-current ${w.color}`} />
                  <span>{w.title}</span>
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  {w.desc}
                </p>
              </motion.div>
            ))}

            {activeWorkflow === "ai" && [
              { num: "01", title: "Select Domain Track", desc: "Choose from key technical disciplines like DSA, System Design, Frontend, Backend, or CS Fundamentals.", color: "text-cyan-400", border: "hover:border-cyan-400/40" },
              { num: "02", title: "Instant Generation", desc: "An interactive mock session is instantiated instantly with customized levels and custom parameters.", color: "text-brand", border: "hover:border-brand/40" },
              { num: "03", title: "Detailed Analytics", desc: "Submit your speech or code to receive detailed score breakdown charts, ratings, and expert tips.", color: "text-emerald-400", border: "hover:border-emerald-500/40" }
            ].map((w, idx) => (
              <motion.div 
                key={`ai-${idx}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`liquid-glass rounded-2xl p-8 border border-white/10 relative overflow-hidden transition-all duration-300 shadow-2xl bg-white/[0.01] ${w.border}`}
              >
                <div className={`text-5xl font-black ${w.color} opacity-[0.08] absolute top-4 right-6 font-mono select-none`}>
                  {w.num}
                </div>
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full bg-current ${w.color}`} />
                  <span>{w.title}</span>
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  {w.desc}
                </p>
              </motion.div>
            ))}

            {activeWorkflow === "expert" && [
              { num: "01", title: "Match Verified Pro", desc: "Browse software engineers and expert interviewers from companies like Google, Meta, and Stripe.", color: "text-purple-500", border: "hover:border-purple-500/40" },
              { num: "02", title: "Schedule Your Slot", desc: "Select a date and exact time slot directly on the booking calendar. Seamless checkout in seconds.", color: "text-indigo-400", border: "hover:border-indigo-400/40" },
              { num: "03", title: "Live 1-on-1 Feedback", desc: "Participate in a realistic 1-on-1 interview with actionable oral advice and written metric scorecards.", color: "text-emerald-400", border: "hover:border-emerald-500/40" }
            ].map((w, idx) => (
              <motion.div 
                key={`expert-${idx}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`liquid-glass rounded-2xl p-8 border border-white/10 relative overflow-hidden transition-all duration-300 shadow-2xl bg-white/[0.01] ${w.border}`}
              >
                <div className={`text-5xl font-black ${w.color} opacity-[0.08] absolute top-4 right-6 font-mono select-none`}>
                  {w.num}
                </div>
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full bg-current ${w.color}`} />
                  <span>{w.title}</span>
                </h3>
                <p className="text-xs text-white/50 leading-relaxed">
                  {w.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </section>

      {/* SECTION 5.6 — EARN SECTION (Original Conduct & Earn preserved exactly) */}
      <section ref={earnRef} className="max-w-6xl mx-auto px-6 py-20 md:py-28 border-t border-white/10 grid md:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">
        
        {/* Left Column Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="space-y-6"
        >
          <SectionEyebrow label="For Experts" icon={Coins} />
          
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white leading-tight">
            Conduct Interviews<br />
            <span className="bg-gradient-to-r from-amber-500 to-rose-500 WebkitBackgroundClip: text background-clip: text text-transparent bg-clip-text font-black">
              & Earn Money
            </span>
          </h2>

          <p className="text-white/60 text-base leading-[1.6]">
            Build your expertise, grow your reputation, and earn by conducting real mock interviews with aspiring candidates.
          </p>

          <button 
            onClick={() => handleRoleSelect("INTERVIEWER")} 
            className="rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white text-sm font-bold px-6 py-3.5 hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] transition-all flex items-center gap-2 shadow-[0_8px_32px_rgba(245,158,11,0.25)] group"
          >
            <Rocket className="w-4 h-4" />
            <span>Become an Expert Interviewer</span>
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>

        {/* Right Column: Earnings Mockup Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="liquid-glass rounded-2xl p-6 border border-white/10 bg-[#0e1014]/50 shadow-2xl space-y-4"
        >
          {[{ label: "Completed Session", name: "DSA — LeetCode Hard", amt: "+₹800", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" }, { label: "Scheduled Session", name: "System Design Interview", amt: "Tomorrow 3PM", color: "text-brand bg-brand/10 border-brand/20" }, { label: "Pending Review", name: "Web Dev Interview", amt: "Rating: ★★★★★", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" }].map((item, i) => (
            <div key={i} className={`p-4 flex justify-between items-center bg-white/[0.01] border border-white/5 rounded-xl`}>
              <div className="space-y-1">
                <div className="text-[9px] text-white/40 font-bold uppercase tracking-wider font-mono">
                  {item.label}
                </div>
                <div className="text-xs font-bold text-white/95">
                  {item.name}
                </div>
              </div>
              <div className={`text-xs font-bold font-mono px-2.5 py-1 rounded-md border ${item.color.split(' ')[0]} ${item.color.split(' ').slice(1).join(' ')}`}>
                {item.amt}
              </div>
            </div>
          ))}
          
          <div className="text-center pt-5 border-t border-white/5 space-y-1">
            <div className="text-3xl font-black text-emerald-400 font-mono tracking-tight">
              ₹12,400
            </div>
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest font-mono">
              Earned this month
            </div>
          </div>
        </motion.div>
      </section>



      {/* SECTION 8.5 — FAQ ACCORDION (Original content accordion styled in glassmorphism) */}
      <section ref={faqRef} className="max-w-3xl mx-auto px-6 py-20 md:py-28 border-t border-white/5 relative z-10">
        <div className="text-center mb-12">
          <SectionEyebrow label="FAQ" tag="Frequently Asked" />
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-white mt-4 leading-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => (
            <motion.details
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="liquid-glass rounded-2xl border border-white/10 overflow-hidden bg-white/[0.01] hover:bg-white/[0.02] transition-colors"
            >
              <summary className="p-5 font-semibold text-sm md:text-base text-white/95 cursor-pointer select-none flex items-center justify-between hover:text-white">
                <span>{faq.q}</span>
                <span className="text-brand text-lg font-mono font-bold transition-transform duration-200">+</span>
              </summary>
              <p className="px-5 pb-5 text-xs md:text-sm text-white/60 leading-relaxed border-t border-white/5 pt-3">
                {faq.a}
              </p>
            </motion.details>
          ))}
        </div>
      </section>

      {/* SECTION 9 — FINAL CTA */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="liquid-glass relative overflow-hidden rounded-3xl px-8 py-16 md:py-24 text-center border border-white/10 shadow-[0_24px_64px_rgba(0,0,0,0.4)]"
        >
          {/* Radial glow overlay inside CTA */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-30 bg-center bg-no-repeat"
            style={{ 
              backgroundImage: 'radial-gradient(600px circle at 50% 0%, rgba(255,255,255,0.15), transparent 70%)'
            }}
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-[1.05]">
              Master the interview.<br />
              Land the offer.
            </h2>

            <p className="text-white/60 max-w-md mx-auto text-xs md:text-sm leading-[1.6]">
              Practice unlimited AI rounds, upload your resume for specialized technical rounds, or match with expert engineers to refine your coding game.
            </p>

            <div className="pt-4 flex flex-wrap gap-4 justify-center">
              <AppleButton label="Start Free AI Practice" onClick={() => handleRoleSelect("INTERVIEWEE")} />
              
              <button 
                onClick={() => scrollTo(faqRef)}
                className="rounded-full border border-white/15 text-white text-xs font-semibold px-6 py-3.5 hover:bg-white/5 active:scale-95 transition-all flex items-center gap-1.5 group uppercase tracking-wider"
              >
                <span>View FAQs</span>
                <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-[1px]" />
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-xl select-none">
        <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-gradient-to-br from-brand to-[#8b5cf6] rounded-lg flex items-center justify-center">
              <LogoMark className="w-4 h-4 text-white" />
            </div>
            <span className="font-extrabold text-sm tracking-tight">
              Interview<span className="text-[#22d3ee]">Buddy</span>
            </span>
          </div>

          <p className="text-[11px] text-white/40 font-medium font-mono">
            © 2026 InterviewBuddy. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Local custom rules to support summary toggle */}
      <style>{`
        details > summary::-webkit-details-marker { display: none; }
        details[open] > summary span { content: '−'; }
      `}</style>
    </div>
  );
}

export default LandingPage;