import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Clock, Database, Home, RotateCcw, AlertTriangle, RefreshCw, CheckCircle, User } from "lucide-react";
import API from "../services/api";

export default function Feedback() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    score: initScore = 0,
    attempts = 0,
    timeComplexity: initTimeComplexity = "-",
    spaceComplexity: initSpaceComplexity = "-",
    codeQuality: initCodeQuality = "-",
    feedback: initFeedback = "No feedback available",
    reportId: initReportId = null
  } = location.state || {};

  const [score, setScore] = useState(initScore);
  const [timeComplexity, setTimeComplexity] = useState(initTimeComplexity);
  const [spaceComplexity, setSpaceComplexity] = useState(initSpaceComplexity);
  const [codeQuality, setCodeQuality] = useState(initCodeQuality);
  const [feedback, setFeedback] = useState(initFeedback);
  const [reportId] = useState(initReportId);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalSuccess, setEvalSuccess] = useState(false);
  const [evalError, setEvalError] = useState(null);

  useEffect(() => {
    sessionStorage.setItem("interview_submitted", "true");
  }, []);

  const fbLower = feedback ? feedback.toLowerCase() : "";
  const isFailed =
    !feedback ||
    fbLower.includes("rate limit") ||
    fbLower.includes("busy") ||
    fbLower.includes("high volume") ||
    fbLower.includes("failed") ||
    fbLower.includes("quota") ||
    fbLower.includes("unavailable") ||
    fbLower.includes("temporarily") ||
    score === 0;

  const scoreColor = score >= 80 ? "#10b981" : score >= 50 ? "#f59e0b" : "#f43f5e";
  const scoreLabel = score >= 80 ? "Excellent" : score >= 50 ? "Good" : "Needs Improvement";
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const handleReEvaluate = useCallback(async () => {
    if (!reportId || isEvaluating) return;
    setIsEvaluating(true);
    setEvalError(null);
    setEvalSuccess(false);

    try {
      await API.post(`/candidate/report/${reportId}/retry`);

      // Poll every 3 seconds for up to 90 seconds
      let attempts = 0;
      const maxAttempts = 30;

      const poll = async () => {
        try {
          const res = await API.get(`/candidate/report/${reportId}`);
          const report = res.data;

          if (report.status === "completed") {
            setScore(report.score ?? 0);
            setFeedback(report.feedback || "No feedback available");
            setTimeComplexity(report.timeComplexity || "-");
            setSpaceComplexity(report.spaceComplexity || "-");
            setCodeQuality(report.codeQuality || "-");
            setIsEvaluating(false);
            setEvalSuccess(true);
            return;
          }

          attempts++;
          if (attempts >= maxAttempts) {
            setIsEvaluating(false);
            setEvalError("Re-evaluation is taking longer than expected. Check your profile dashboard for updates.");
            return;
          }

          setTimeout(poll, 3000);
        } catch (pollErr) {
          console.error("Polling error:", pollErr);
          attempts++;
          if (attempts >= maxAttempts) {
            setIsEvaluating(false);
            setEvalError("Re-evaluation polling failed. Check your profile dashboard for updates.");
            return;
          }
          setTimeout(poll, 3000);
        }
      };

      setTimeout(poll, 3000);
    } catch (err) {
      console.error("Re-evaluate trigger failed:", err);
      setIsEvaluating(false);
      setEvalError("Failed to queue re-evaluation. Please try again from your profile dashboard.");
    }
  }, [reportId, isEvaluating]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative z-10 select-none">
      
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Header Branding */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02]">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
              Performance Summary
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Interview Complete!
          </h2>
          
          <p className="text-xs md:text-sm text-white/50 leading-relaxed max-w-md mx-auto">
            Here's how you performed in this technical algorithm practice session.
          </p>
        </div>

        {/* Eval success banner */}
        {evalSuccess && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-5 text-left flex items-start gap-3.5 max-w-4xl mx-auto">
            <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-1">
              <h4 className="text-sm font-extrabold text-emerald-400">Re-evaluation Complete!</h4>
              <p className="text-xs text-white/60 leading-relaxed">
                Your report has been successfully updated with fresh AI evaluation results.
              </p>
            </div>
          </div>
        )}

        {/* Unavailability Alert Banner */}
        {(isFailed && !evalSuccess) && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 text-left max-w-4xl mx-auto space-y-3">
            <div className="flex items-start gap-3.5">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
              <div className="space-y-1 flex-1">
                <h4 className="text-sm font-extrabold text-amber-400">Notice: AI Diagnostics Offline</h4>
                <p className="text-xs text-white/60 leading-relaxed">
                  The evaluation service experienced a temporary API rate limit or outage. 
                  Your report has been marked as <strong>Pending</strong> and is queued to automatically regenerate in the background shortly. 
                  {reportId ? " You can also re-evaluate immediately below." : " Monitor its status from your Candidate Profile Dashboard."}
                </p>
              </div>
            </div>

            {evalError && (
              <p className="text-xs text-rose-400 font-semibold pl-8">{evalError}</p>
            )}

            {reportId && (
              <div className="pl-8">
                <button
                  onClick={handleReEvaluate}
                  disabled={isEvaluating}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 hover:text-amber-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all active:scale-[0.97] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isEvaluating ? "animate-spin" : ""}`} />
                  <span>{isEvaluating ? "Evaluating... Please wait" : "Re-evaluate Now"}</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* 2-Column Grid */}
        <div className="grid md:grid-cols-12 gap-6 items-stretch">
          
          {/* LEFT PANEL: SCORE & BASIC METRICS (5/12 cols) */}
          <div className="md:col-span-5 liquid-glass rounded-3xl p-6 md:p-8 border border-white/10 bg-black/45 backdrop-blur-2xl shadow-2xl flex flex-col items-center justify-center text-center space-y-6">
            
            {/* Score circle */}
            <div className="relative flex items-center justify-center">
              <svg width="110" height="110" viewBox="0 0 100 100" className="transform -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
                <circle cx="50" cy="50" r="40" fill="none" stroke={scoreColor} strokeWidth="8"
                  strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  style={{ transition: "stroke-dashoffset 1s ease", filter: `drop-shadow(0 0 8px ${scoreColor})` }} 
                />
              </svg>
              <div className="absolute text-center space-y-0.5">
                <span className="text-3xl font-black font-mono block leading-none" style={{ color: scoreColor }}>
                  {isEvaluating ? "..." : score}
                </span>
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider block">Score</span>
              </div>
            </div>

            {/* Score label */}
            <div className="space-y-1">
              <div className="text-base font-bold" style={{ color: scoreColor }}>
                {isEvaluating ? "Evaluating..." : scoreLabel}
              </div>
              <div className="text-[10px] font-semibold text-white/40 uppercase tracking-widest font-mono">out of 100 points</div>
            </div>

            {/* Micro details list */}
            <div className="w-full space-y-2 border-t border-white/5 pt-5 select-none">
              {[
                { label: "Attempts Used", val: attempts },
                { label: "Code Quality", val: isEvaluating ? "..." : codeQuality }
              ].map((m) => (
                <div key={m.label} className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex justify-between items-center text-xs">
                  <span className="font-semibold text-white/55">{m.label}</span>
                  <span className="font-bold text-white/90 font-mono">{m.val}</span>
                </div>
              ))}
            </div>

          </div>

          {/* RIGHT PANEL: COMPLEXITY & FEEDBACK (7/12 cols) */}
          <div className="md:col-span-7 flex flex-col gap-6">
            
            {/* Complexity highlights */}
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { icon: Clock, label: "Time Complexity", val: isEvaluating ? "..." : timeComplexity, color: "text-[#22d3ee]", bg: "bg-[#22d3ee]/5 border-[#22d3ee]/10" },
                { icon: Database, label: "Space Complexity", val: isEvaluating ? "..." : spaceComplexity, color: "text-[#8b5cf6]", bg: "bg-[#8b5cf6]/5 border-[#8b5cf6]/10" }
              ].map((c) => (
                <div key={c.label} className={`p-5 rounded-2xl border ${c.bg} flex items-center gap-4`}>
                  <div className={`w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner ${c.color}`}>
                    <c.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider font-mono">{c.label}</div>
                    <div className={`text-base font-black font-mono mt-0.5 ${c.color}`}>{c.val}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Feedback Suggestion */}
            <div className="liquid-glass rounded-3xl p-6 border border-white/10 bg-black/45 backdrop-blur-2xl shadow-2xl flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-brand animate-pulse" />
                  <span>AI Suggestion Report</span>
                </div>
                {isEvaluating ? (
                  <div className="flex items-center gap-3 py-4">
                    <RefreshCw className="w-4 h-4 text-brand animate-spin flex-shrink-0" />
                    <p className="text-xs text-white/50 leading-relaxed font-medium">
                      AI is re-evaluating your submission. This usually takes 10–30 seconds...
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-white/70 leading-relaxed font-medium max-h-40 overflow-y-auto pr-2 scrollbar-thin whitespace-pre-line">
                    {feedback}
                  </p>
                )}
              </div>
            </div>

            {/* Actions triggers */}
            <div className="flex gap-4">
              <button 
                onClick={() => navigate("/interview-type")} 
                disabled={isEvaluating}
                className="flex-1 py-3.5 bg-white hover:bg-white/95 active:scale-[0.98] text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Practice Again</span>
              </button>
              
              <button 
                onClick={() => navigate("/candidate-profile")} 
                disabled={isEvaluating}
                className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <User className="w-3.5 h-3.5 text-[#22d3ee]" />
                <span>User Profile</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}