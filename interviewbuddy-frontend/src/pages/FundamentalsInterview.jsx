import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Clock, 
  HelpCircle, 
  Mic, 
  MicOff, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle,
  FileText,
  AlertTriangle,
  Award,
  Sparkles,
  ArrowRight
} from "lucide-react";
import API from "../services/api";
import "./FundamentalsInterview.css";

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

export default function FundamentalsInterview() {
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(Array(10).fill(""));
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const location = useLocation();
  const type = location.state?.type || "fundamentals";
  const level = location.state?.level || "easy";
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const recognitionRef = useRef(null);
  const isIntentionalStop = useRef(false);

  useEffect(() => {
    document.title = `${type.toUpperCase()} Mock Interview - Interview Buddy`;
  }, [type]);

  useEffect(() => {
    if (timeLeft <= 0) { endTest(); return; }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60), s = timeLeft % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const endTest = () => {
    saveAnswer(text);
    navigate("/feedback-theory", { state: { questions, answers, type, level } });
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      if (location.state?.questions && location.state.questions.length > 0) {
        setQuestions(location.state.questions);
        setAnswers(new Array(location.state.questions.length).fill(""));
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await API.post("/ai/interview/theoryQuestions", { type, level });
        let data = res.data;
        let fetchedQuestions = Array.isArray(data) ? data : data.questions || [];
        
        if (fetchedQuestions.length === 0) {
          fetchedQuestions = [
            "Explain the concept of inheritance in Object-Oriented Programming.",
            "What is the difference between a primary key and a foreign key?",
            "How does the browser render a web page (DOM, CSSOM)?",
            "What are the benefits of using a version control system like Git?",
            "Explain the concept of RESTful APIs and their key principles."
          ];
        }
        
        setQuestions(fetchedQuestions);
        setAnswers(new Array(fetchedQuestions.length).fill(""));
      } catch (err) { 
        console.error("Error fetching questions:", err);
        const failSafe = [
          "Explain the difference between a process and a thread.",
          "What is polymorphism in OOP?",
          "How does the Internet Protocol (IP) work?",
          "What are the ACID properties in a database?",
          "Explain the concept of Big O notation."
        ];
        setQuestions(failSafe);
        setAnswers(new Array(failSafe.length).fill(""));
      }
      finally { setLoading(false); }
    };
    fetchQuestions();
  }, [type, level]);

  useEffect(() => { setText(answers[current]); }, [current]);

  const saveAnswer = (value) => {
    const updated = [...answers];
    updated[current] = value;
    setAnswers(updated);
  };

  const next = () => { saveAnswer(text); if (current < questions.length - 1) setCurrent(current + 1); };
  const prev = () => { saveAnswer(text); if (current > 0) setCurrent(current - 1); };

  const toggleVoice = () => {
    if (isListening) {
      isIntentionalStop.current = true;
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
    } else {
      isIntentionalStop.current = false;
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        alert("Speech Recognition is not supported in your browser. Please try Chrome.");
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = false;
      setIsListening(true);
      
      let baseText = text;
      
      recognition.onresult = (e) => {
        let transcript = "";
        for (let i = e.resultIndex; i < e.results.length; ++i) {
          if (e.results[i].isFinal) {
            transcript += (transcript ? " " : "") + e.results[i][0].transcript;
          }
        }
        if (transcript) {
          const newText = baseText + (baseText ? " " : "") + transcript;
          setText(newText);
          saveAnswer(newText);
          baseText = newText;
        }
      };
      
      recognition.onend = () => {
        if (!isIntentionalStop.current) {
          try {
            recognition.start();
          } catch (err) {
            console.error("Auto-restart failed:", err);
            setIsListening(false);
          }
        } else {
          setIsListening(false);
        }
      };
      
      recognition.onerror = (e) => {
        console.error("Speech Recognition error:", e.error);
        if (e.error === 'not-allowed' || e.error === 'audio-capture') {
          isIntentionalStop.current = true;
          setIsListening(false);
        }
      };
      
      recognition.start();
      recognitionRef.current = recognition;
    }
  };

  const timerColorClass = timeLeft < 300 
    ? "text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.1)] animate-pulse" 
    : timeLeft < 600 
    ? "text-amber-400 bg-amber-500/10 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.1)]" 
    : "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_15px_rgba(34,211,238,0.1)]";

  const progress = ((current + 1) / (questions.length || 1)) * 100;

  if (loading) return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center bg-[#0c0c0c] z-10 relative">
      <div className="relative w-16 h-16 mb-8 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-[3px] border-cyan-500/10 border-t-cyan-400 animate-spin" />
        <div className="absolute inset-2 rounded-full border-[3px] border-brand/10 border-t-brand animate-spin [animation-duration:1.5s]" />
        <Sparkles size={20} className="text-cyan-400 animate-pulse" />
      </div>
      <h2 className="text-xl font-bold tracking-tight text-white mb-2">Preparing your interview...</h2>
      <p className="text-xs text-white/40 uppercase tracking-widest">{type} · {level}</p>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-[#0c0c0c]/30 text-white z-10">
      
      {/* Immersive Top Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-white/5 z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-brand via-[#22d3ee] to-[#a4f4fd]" 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* TOP BAR */}
      <header className="flex flex-col md:flex-row md:items-center justify-between px-6 md:px-12 py-5 border-b border-white/5 bg-[#0c0c0c]/60 backdrop-blur-xl sticky top-0 z-40 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-brand/25">
            <LogoMark className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-extrabold text-sm text-white tracking-tight">
              {type.toLowerCase().includes("fundamentals") ? "📘 Fundamentals Interview" : 
               type.toLowerCase().includes("web") ? "🌐 Web Development Interview" :
               type.toLowerCase().includes("db") ? "🗄️ Database Interview" :
               type.toLowerCase().includes("ai") ? "🤖 AI/ML Interview" :
               type.toLowerCase().includes("resume") ? "📄 Resume AI Mock Session" :
               `📘 ${type} Interview`}
            </h2>
            <div className="text-[10px] text-white/40 uppercase tracking-wider mt-0.5">
              {type.toLowerCase().includes("resume") ? "Customized session based on your profile" : "AI-powered theory session"}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 self-end md:self-auto">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/15 text-xs font-semibold text-white/80" id="fundamentals-question-badge">
            <HelpCircle size={13} className="text-white/60" />
            <span>{current + 1} / {questions.length} Questions</span>
          </div>
          <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border text-xs font-extrabold tracking-wider ${timerColorClass}`} id="fundamentals-timer-badge">
            <Clock size={13} />
            <span>⏱ {formatTime()}</span>
          </div>
        </div>
      </header>

      {/* MAIN LAYOUT */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8 relative z-10">
        
        {/* SIDEBAR PANEL */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="liquid-glass rounded-2xl p-5 border border-white/5">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-wider block mb-4">Question Navigator</span>
            <div className="grid grid-cols-5 gap-2" id="fundamentals-question-grid">
              {questions.map((_, idx) => {
                const isCurrent = idx === current;
                const isAnswered = answers[idx]?.trim().length > 0;
                return (
                  <button 
                    key={idx} 
                    id={`fundamentals-nav-dot-${idx}`}
                    onClick={() => { saveAnswer(text); setCurrent(idx); }}
                    className={`h-9 rounded-lg flex items-center justify-center text-xs font-black transition-all border duration-200 ${
                      isCurrent 
                        ? "bg-brand text-white border-brand shadow-[0_0_15px_rgba(61,129,227,0.4)] scale-[1.05]" 
                        : isAnswered 
                        ? "bg-cyan-500/10 border-cyan-500/20 text-[#22d3ee]" 
                        : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="liquid-glass rounded-2xl p-5 border border-white/5 space-y-4">
            <span className="text-[10px] font-black text-white/40 uppercase tracking-wider block">Session Info</span>
            <div className="space-y-3 text-xs text-white/50">
              <div className="flex justify-between items-center py-1.5 border-b border-white/5">
                <span>Domain:</span>
                <span className="text-white/80 font-bold truncate max-w-[120px]">{type}</span>
              </div>
              <div className="flex justify-between items-center py-1.5">
                <span>Difficulty:</span>
                <span className="text-white/80 font-bold uppercase tracking-wider">{level}</span>
              </div>
            </div>
          </div>
        </aside>

        {/* WORKSPACE AREA */}
        <section className="lg:col-span-3 space-y-6">
          {type.toLowerCase().includes("resume") && (
            <div className="flex gap-3 bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4 text-xs text-amber-300/80 leading-relaxed" id="fundamentals-resume-alert">
              <span className="text-base flex-shrink-0">💡</span>
              <div>
                <strong className="text-amber-300 font-bold block mb-0.5">Resume integration active</strong>
                This mock interview is dynamically tailored to your parsed resume skills. Speak or type your answers naturally as you would in a real company interview.
              </div>
            </div>
          )}

          <div className="liquid-glass rounded-3xl p-6 md:p-8 border border-white/5" id="fundamentals-question-card">
            
            {/* Question Details Banner */}
            <div className="border-b border-white/5 pb-6 mb-6">
              <div className="inline-block text-[10px] font-extrabold text-[#22d3ee] bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full mb-3 uppercase tracking-widest">
                Question {current + 1}
              </div>
              <h3 className="text-xl md:text-2xl font-extrabold text-white leading-relaxed">
                {questions[current]}
              </h3>
            </div>

            {/* Answer Input Sub-system */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <label className="text-[10px] font-black text-white/40 uppercase tracking-wider">Your Answer Response</label>
                <span className="text-white/40 font-semibold">{text.trim().split(/\s+/).filter(Boolean).length} words</span>
              </div>

              {/* Dictation visualizer overlay */}
              <AnimatePresence>
                {isListening && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-3 bg-cyan-500/5 border border-cyan-500/15 rounded-2xl p-4" id="fundamentals-voice-visualizer">
                      <div className="flex items-end gap-1 h-5 w-16">
                        <div className="w-1 bg-[#22d3ee] rounded-full animate-[ib-bounce-bar_0.5s_infinite_alternate]" style={{ height: "4px" }} />
                        <div className="w-1 bg-[#22d3ee] rounded-full animate-[ib-bounce-bar_0.4s_infinite_alternate_0.1s]" style={{ height: "4px" }} />
                        <div className="w-1 bg-[#22d3ee] rounded-full animate-[ib-bounce-bar_0.6s_infinite_alternate_0.2s]" style={{ height: "4px" }} />
                        <div className="w-1 bg-[#22d3ee] rounded-full animate-[ib-bounce-bar_0.5s_infinite_alternate_0.3s]" style={{ height: "4px" }} />
                        <div className="w-1 bg-[#22d3ee] rounded-full animate-[ib-bounce-bar_0.7s_infinite_alternate_0.15s]" style={{ height: "4px" }} />
                      </div>
                      <span className="text-xs text-cyan-300 font-semibold animate-pulse">Voice dictation active. Speak clearly...</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <textarea 
                id="fundamentals-answer-textarea"
                className="w-full min-h-[220px] bg-white/[0.015] focus:bg-white/[0.03] border border-white/10 focus:border-cyan-500/40 rounded-2xl p-5 text-white placeholder-white/20 text-sm leading-relaxed focus:shadow-[0_0_25px_rgba(34,211,238,0.05)] transition-all duration-300 outline-none resize-y"
                value={text} 
                onChange={(e) => { setText(e.target.value); saveAnswer(e.target.value); }}
                placeholder="Compose your detailed answer here. You can also use the microphone to dictate your response..."
              />
              
              {/* Action Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                
                {/* Left group */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <button 
                    id="fundamentals-nav-prev-btn" 
                    className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] transition-all px-5 py-3 text-xs font-bold text-white/80" 
                    onClick={prev} 
                    disabled={current === 0}
                  >
                    <ChevronLeft size={14} /> Previous
                  </button>

                  <button 
                    id="fundamentals-voice-toggle-btn"
                    className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-full px-5 py-3 text-xs font-black transition-all duration-300 border ${
                      isListening 
                        ? "bg-rose-500 text-white border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] animate-pulse" 
                        : "bg-white/5 border-white/10 text-white/90 hover:bg-white/10 hover:border-cyan-500/30 hover:text-cyan-400"
                    }`} 
                    onClick={toggleVoice}
                  >
                    {isListening ? (
                      <>
                        <MicOff size={14} /> Stop Dictation
                      </>
                    ) : (
                      <>
                        <Mic size={14} /> Use Voice
                      </>
                    )}
                  </button>
                </div>

                {/* Right group */}
                <div className="w-full sm:w-auto">
                  {current === questions.length - 1 ? (
                    <button 
                      id="fundamentals-nav-finish-btn" 
                      className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:brightness-[1.05] active:scale-[0.98] transition-all px-6 py-3 text-xs font-bold text-white shadow-[0_4px_15px_rgba(16,185,129,0.3)]" 
                      onClick={endTest}
                    >
                      Finish Interview <CheckCircle size={14} />
                    </button>
                  ) : (
                    <button 
                      id="fundamentals-nav-next-btn" 
                      className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand to-[#22d3ee] hover:brightness-[1.05] active:scale-[0.98] transition-all px-6 py-3 text-xs font-bold text-white shadow-[0_4px_15px_rgba(61,129,227,0.3)]" 
                      onClick={next}
                    >
                      Next Question <ChevronRight size={14} />
                    </button>
                  )}
                </div>
                
              </div>
            </div>

          </div>
        </section>
      </main>

    </div>
  );
}