import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Home, RotateCcw } from "lucide-react";

function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const feedback = location.state?.feedback || "No feedback available";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative z-10 select-none">
      
      {/* Centered Liquid-Glass Results Panel */}
      <div className="liquid-glass w-full max-w-lg rounded-3xl p-8 md:p-10 border border-white/10 bg-black/45 backdrop-blur-2xl shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Glow corner element */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-brand/20 filter blur-xl rounded-full opacity-20 pointer-events-none" />
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center text-3xl shadow-inner mx-auto">
            📊
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            AI Feedback
          </h2>
          
          <p className="text-xs text-white/50 leading-relaxed max-w-[240px] mx-auto">
            Detailed evaluation of your simulated interview performance logs.
          </p>
        </div>

        {/* AI Analysis Block */}
        <div className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-brand uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-brand animate-pulse" />
            <span>AI Analysis Report</span>
          </div>
          
          <p className="text-xs text-white/70 leading-relaxed max-h-56 overflow-y-auto pr-2 scrollbar-thin whitespace-pre-line font-medium">
            {feedback}
          </p>
        </div>

        {/* Navigation CTAs */}
        <div className="flex gap-4 pt-2">
          <button 
            onClick={() => navigate("/interview-type")} 
            className="flex-1 py-3.5 bg-white hover:bg-white/95 active:scale-[0.98] text-black text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Another</span>
          </button>
          
          <button 
            onClick={() => navigate("/")} 
            className="flex-1 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 active:scale-[0.98]"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </button>
        </div>

      </div>
    </div>
  );
}

export default Results;