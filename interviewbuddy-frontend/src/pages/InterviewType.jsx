import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Play, CheckCircle, Puzzle, BookOpen, Bot, Database, Globe, Target } from "lucide-react";

const topicIcons = { DSA: Puzzle, Fundamentals: BookOpen, AIML: Bot, Database: Database, "Web Development": Globe };
const difficultyColors = { Easy: "#10b981", Medium: "#f59e0b", Hard: "#f43f5e" };

export default function InterviewType() {
  const [topic, setTopic] = useState(() => {
    const pre = localStorage.getItem("preselectedDomain");
    if (pre) {
      localStorage.removeItem("preselectedDomain");
      return pre;
    }
    return "DSA";
  });
  const [difficulty, setDifficulty] = useState("Easy");
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const enterFullScreen = async () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) await elem.requestFullscreen();
    else if (elem.webkitRequestFullscreen) await elem.webkitRequestFullscreen();
    else if (elem.msRequestFullscreen) await elem.msRequestFullscreen();
  };

  const handleStart = () => {
    // Clear old AI questions from sessionStorage to ensure a fresh question is fetched
    Object.keys(sessionStorage).forEach((key) => {
      if (key.endsWith("_question")) {
        sessionStorage.removeItem(key);
      }
    });

    const t = topic.toLowerCase();
    const path = t === "dsa" || t === "aiml" || t === "database"
      ? "/ai-interview/coding"
      : t === "fundamentals" || t === "web development"
      ? "/ai-interview/theory"
      : "/ai-interview";
    enterFullScreen();
    navigate(path, { state: { type: topic, level: difficulty.toLowerCase() } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative z-10 select-none">
      
      {/* Outer 2-Column Grid */}
      <div className="w-full max-w-4xl grid md:grid-cols-12 gap-6 items-start">
        
        {/* LEFT PANEL: CONFIGURATION (7/12 cols) */}
        <div className="md:col-span-7 liquid-glass rounded-3xl p-6 md:p-8 border border-white/10 bg-black/45 backdrop-blur-2xl shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="space-y-1.5 border-b border-white/5 pb-4">
            <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand" />
              <span>Configure Interview</span>
            </h2>
            <p className="text-xs text-white/50 leading-relaxed">
              Choose your topic & difficulty level to begin your AI-powered mock interview session
            </p>
          </div>

          {/* TOPIC SELECT */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">Select Topic</h3>
            <div className="flex flex-wrap gap-2.5">
              {["DSA", "Fundamentals", "AIML", "Database", "Web Development"].map((t) => {
                const isActive = topic === t;
                const Icon = topicIcons[t];
                return (
                  <button 
                    key={t} 
                    onClick={() => setTopic(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all active:scale-[0.98] flex items-center gap-1.5
                      ${isActive 
                        ? 'bg-white text-black border-white shadow-md' 
                        : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    {Icon && <Icon size={14} className={isActive ? "text-black" : "text-white/40"} />}
                    <span>{t}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* DIFFICULTY SELECT */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider">Select Difficulty</h3>
            <div className="flex gap-2.5">
              {["Easy", "Medium", "Hard"].map((d) => {
                const isActive = difficulty === d;
                return (
                  <button 
                    key={d} 
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-[0.98] border
                      ${isActive 
                        ? 'border-transparent text-white shadow-lg' 
                        : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'
                      }
                    `}
                    style={isActive ? { backgroundColor: difficultyColors[d] } : {}}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SELECTION SUMMARY */}
          <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center gap-4">
            {(() => {
              const SummaryIcon = topicIcons[topic] || Puzzle;
              return (
                <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand shadow-inner">
                  <SummaryIcon className="w-5 h-5" />
                </div>
              );
            })()}
            <div>
              <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider font-mono">Selected Configuration</div>
              <div className="text-xs font-bold text-white/90 mt-0.5">
                {topic} • <span style={{ color: difficultyColors[difficulty] }} className="font-extrabold uppercase font-mono">{difficulty}</span>
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT PANEL: GUIDELINES & LAUNCH (5/12 cols) */}
        <div className="md:col-span-5 flex flex-col gap-6">
          
          {/* Guidelines block */}
          <div className="liquid-glass rounded-3xl p-6 border border-white/10 bg-black/45 backdrop-blur-2xl shadow-2xl space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-2">
              Session Guidelines
            </h2>
            <ul className="space-y-2.5">
              {[
                { label: "Total Time", val: "40 Minutes", color: "text-[#22d3ee]" },
                { label: "Stability", val: "Do not refresh window", color: "text-rose-400" },
                { label: "Session lock", val: "One sitting only", color: "text-amber-500" },
                { label: "Active Timer", val: "Will not stop", color: "text-rose-500" },
                { label: "Evaluation", val: "Best of your ability", color: "text-white/70" }
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-white/70 font-semibold select-none leading-relaxed">
                  <CheckCircle size={14} className="text-white/30 flex-shrink-0 mt-0.5" />
                  <span>
                    {item.label}: <strong className={item.color}>{item.val}</strong>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* What to expect block */}
          <div className="p-4 bg-[#22d3ee]/5 border border-[#22d3ee]/10 rounded-2xl space-y-2">
            <div className="text-[9px] font-bold text-[#22d3ee] tracking-widest uppercase flex items-center gap-1.5">
              <Target size={12} className="text-[#22d3ee]" />
              <span>What to Expect</span>
            </div>
            {(topic === "DSA" || topic === "AIML" || topic === "Database") ? (
              <p className="text-xs text-white/60 leading-relaxed font-semibold">
                You'll receive a <strong className="text-white">coding problem</strong> with a split Monaco editor. Write your solution, run test cases, fetch AI hints, and compile for scoring.
              </p>
            ) : (
              <p className="text-xs text-white/60 leading-relaxed font-semibold">
                You'll answer <strong className="text-white">10 theory questions</strong> with text or speech input. Navigate freely between questions and submit when done.
              </p>
            )}
          </div>

          {/* Launch Box */}
          <div className="liquid-glass rounded-3xl p-5 border border-white/10 bg-black/45 backdrop-blur-2xl shadow-2xl flex items-center gap-2">
            <input
              type="text"
              placeholder='Type "start" to launch'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && input.trim().toLowerCase() === "start" && handleStart()}
              className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/30 focus:border-brand/40 focus:bg-white/[0.04] transition-all focus:outline-none"
            />
            
            <button 
              disabled={input.trim().toLowerCase() !== "start"} 
              onClick={handleStart}
              className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all select-none shadow-md flex items-center gap-1.5
                ${input.trim().toLowerCase() === "start"
                  ? 'bg-white text-black hover:bg-white/95 active:scale-[0.98]'
                  : 'bg-white/5 text-white/20 border border-white/5 cursor-not-allowed'
                }
              `}
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Launch</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}