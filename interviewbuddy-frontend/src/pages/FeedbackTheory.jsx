import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Home, RotateCcw, AlertTriangle, RefreshCw, CheckCircle, User } from "lucide-react";
import API from "../services/api";

export default function FeedbackTheory() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ score: 0, feedback: "No feedback available", scores: [] });
  const [reportId, setReportId] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evalSuccess, setEvalSuccess] = useState(false);
  const [evalError, setEvalError] = useState(null);

  const { questions = [], answers = [], type = "Fundamentals", level = "easy" } = location.state || {};
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;
    sessionStorage.setItem("interview_submitted", "true");

    const fetchFeedback = async () => {
      try {
        setLoading(true);
        const res = await API.post("/ai/interview/theory-feedback", { questions, answers });
        const result = res.data;
        setData({ score: result.score || 0, feedback: result.feedback || "No feedback available", scores: result.scores || [] });

        // Save report to Candidate Profile
        try {
          const studentEmail = localStorage.getItem("email");
          if (studentEmail) {
            const saveRes = await API.post("/ai/interview/save-report", {
              studentEmail,
              questionType: type || "Fundamentals",
              questionStatement: questions.map((q, idx) => `Q${idx + 1}: ${q}`).join("\n\n"),
              starterCode: "",
              submittedCode: answers.map((ans, idx) => `Ans ${idx + 1}: ${ans || "[No Answer]"}`).join("\n\n"),
              expectedSolution: "",
              timeComplexity: "N/A",
              spaceComplexity: "N/A",
              codeQuality: "N/A",
              feedback: result.feedback || "No feedback available",
              score: result.score || 0,
              scores: result.scores || [],
              difficulty: level || "easy",
              language: "theory",
              status: "completed"
            });
            setReportId(saveRes.data?.id || null);
          }
        } catch (saveErr) {
          console.error("Failed to save report to profile", saveErr);
        }

      } catch (err) { 
        console.error("Feedback API error, saving pending theory report:", err);
        try {
          const studentEmail = localStorage.getItem("email");
          if (studentEmail) {
            const pendingSaveRes = await API.post("/ai/interview/save-report", {
              studentEmail,
              questionType: type || "Fundamentals",
              questionStatement: questions.map((q, idx) => `Q${idx + 1}: ${q}`).join("\n\n"),
              starterCode: "",
              submittedCode: answers.map((ans, idx) => `Ans ${idx + 1}: ${ans || "[No Answer]"}`).join("\n\n"),
              expectedSolution: "",
              timeComplexity: "N/A",
              spaceComplexity: "N/A",
              codeQuality: "N/A",
              feedback: "AI report generation failed / quota exceeded. The system will regenerate your report in the background shortly.",
              score: 0,
              scores: [],
              difficulty: level || "easy",
              language: "theory",
              status: "pending"
            });
            setReportId(pendingSaveRes.data?.id || null);
          }
        } catch (saveErr) {
          console.error("Failed to save pending report in catch block", saveErr);
        }
        setData({ score: 0, feedback: "AI feedback generation failed due to rate limits. Your report has been marked as pending and will regenerate in the background shortly.", scores: [] });
      }
      finally { setLoading(false); }
    };
    fetchFeedback();
  }, []);

  const handleReEvaluate = useCallback(async () => {
    if (!reportId || isEvaluating) return;
    setIsEvaluating(true);
    setEvalError(null);
    setEvalSuccess(false);

    try {
      await API.post(`/candidate/report/${reportId}/retry`);

      // Poll every 3 seconds for up to 90 seconds
      let pollAttempts = 0;
      const maxAttempts = 30;

      const poll = async () => {
        try {
          const res = await API.get(`/candidate/report/${reportId}`);
          const report = res.data;

          if (report.status === "completed") {
            setData({
              score: report.score ?? 0,
              feedback: report.feedback || "No feedback available",
              scores: Array.isArray(report.scores) ? report.scores : []
            });
            setIsEvaluating(false);
            setEvalSuccess(true);
            return;
          }

          pollAttempts++;
          if (pollAttempts >= maxAttempts) {
            setIsEvaluating(false);
            setEvalError("Re-evaluation is taking longer than expected. Check your profile dashboard for updates.");
            return;
          }

          setTimeout(poll, 3000);
        } catch (pollErr) {
          console.error("Polling error:", pollErr);
          pollAttempts++;
          if (pollAttempts >= maxAttempts) {
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

  const scoreColor = data.score >= 80 ? "#10b981" : data.score >= 50 ? "#f59e0b" : "#f43f5e";
  const scoreLabel = data.score >= 80 ? "Excellent" : data.score >= 50 ? "Good" : "Needs Improvement";
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (data.score / 100) * circumference;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative z-10 select-none">
      <div className="text-center space-y-4 flex flex-col items-center">
        <div className="w-14 h-14 rounded-full border-3 border-brand/20 border-t-brand animate-spin" style={{ borderWidth: "3px" }} />
        <h2 className="text-lg font-bold text-white">Analyzing your answers...</h2>
        <p className="text-xs text-white/50 leading-relaxed max-w-[200px]">
          AI is generating highly customized feedback.
        </p>
      </div>
    </div>
  );

  const fbLower = data.feedback ? data.feedback.toLowerCase() : "";
  const isFailed =
    !data.feedback ||
    fbLower.includes("rate limit") ||
    fbLower.includes("busy") ||
    fbLower.includes("high volume") ||
    fbLower.includes("failed") ||
    fbLower.includes("quota") ||
    fbLower.includes("unavailable") ||
    fbLower.includes("temporarily") ||
    data.score === 0;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative z-10 select-none">
      
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Header Branding */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
              Theory Interview Result
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Interview Complete!
          </h2>
          
          <p className="text-xs md:text-sm text-white/50 leading-relaxed max-w-md mx-auto">
            Here's a detailed analytical report of your answers to theoretical fundamentals questions.
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
          
          {/* LEFT PANEL: SCORE (5/12 cols) */}
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
                  {isEvaluating ? "..." : data.score}
                </span>
                <span className="text-[9px] font-bold text-white/30 uppercase tracking-wider block">Score</span>
              </div>
            </div>

            {/* Score label */}
            <div className="space-y-1">
              <div className="text-base font-bold" style={{ color: scoreColor }}>
                {isEvaluating ? "Evaluating..." : scoreLabel}
              </div>
              <div className="text-[10px] font-semibold text-white/40 uppercase tracking-widest font-mono">Overall Score</div>
            </div>

          </div>

          {/* RIGHT PANEL: QUESTION ANALYSIS & FEEDBACK (7/12 cols) */}
          <div className="md:col-span-7 flex flex-col gap-6">
            
            {/* Question indicators list */}
            <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3.5">
              <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider font-mono">
                Question Analysis
              </div>
              
              <div id="feedback-scores-grid" className="flex flex-wrap gap-2.5">
                {Array.from({ length: questions.length || 5 }).map((_, idx) => {
                  const s = isEvaluating ? undefined : data.scores?.[idx];
                  const bg = s === 1 ? "bg-emerald-500 text-white border-emerald-500/30" : s === 0 ? "bg-rose-500 text-white border-rose-500/30" : "bg-white/5 text-white/40 border-white/10";
                  return (
                    <div 
                      key={idx} 
                      id={`feedback-score-dot-${idx}`} 
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold font-mono text-xs border ${bg} shadow-md transition-colors duration-500`}
                    >
                      {idx + 1}
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-4 pt-1 text-[11px] font-semibold text-white/60">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Correct
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" /> Wrong
                </span>
              </div>
            </div>

            {/* AI Feedback */}
            <div className="liquid-glass rounded-3xl p-6 border border-white/10 bg-black/45 backdrop-blur-2xl shadow-2xl flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-brand animate-pulse" />
                  <span>AI Feedback Report</span>
                </div>
                {isEvaluating ? (
                  <div className="flex items-center gap-3 py-4">
                    <RefreshCw className="w-4 h-4 text-brand animate-spin flex-shrink-0" />
                    <p className="text-xs text-white/50 leading-relaxed font-medium">
                      AI is re-evaluating your answers. This usually takes 10–30 seconds...
                    </p>
                  </div>
                ) : (
                  <p id="feedback-summary-text" className="text-xs text-white/70 leading-relaxed font-medium max-h-40 overflow-y-auto pr-2 scrollbar-thin whitespace-pre-line">
                    {data.feedback}
                  </p>
                )}
              </div>
            </div>

            {/* Actions triggers */}
            <div className="flex gap-4">
              <button 
                id="feedback-practice-again-btn"
                onClick={() => navigate("/interview-type")} 
                disabled={isEvaluating}
                className="flex-1 py-3.5 bg-white hover:bg-white/95 active:scale-[0.98] text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Practice Again</span>
              </button>
              
              <button 
                id="feedback-dashboard-btn"
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