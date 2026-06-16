import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import { Mail, Lock, Key } from "lucide-react";

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [otp, setOtp] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || "interviewee";

  const sendOtp = async () => {
    try {
      setLoading(true); setCanResend(false);
      await API.post("/auth/send-otp", { email, role, type: "FORGOT" });
      alert("OTP sent successfully 📩"); setStep(2);
      let time = 30; setTimer(time);
      const interval = setInterval(() => { time--; setTimer(time); if (time === 0) { clearInterval(interval); setCanResend(true); } }, 1000);
    } catch (error) {
      const msg = typeof error.response?.data === "string" ? error.response.data : (error.response?.data?.error || error.response?.data?.message || error.message || "");
      if (msg.includes("EMAIL_ALREADY_REGISTERED_AS_OTHER_ROLE") || msg.toLowerCase().includes("another role") || msg.toLowerCase().includes("different role")) { alert("This email is registered with another role."); return; }
      if (msg.toLowerCase().includes("not registered")) { alert("No account found with this email ❌ Please register first."); return; }
      alert(msg || "Failed to send OTP ❌");
    } finally { setLoading(false); }
  };

  const verifyOtp = async () => {
    try { await API.post("/auth/verify-otp", { email, otp }); alert("OTP verified ✅"); setStep(3); }
    catch { alert("Invalid OTP ❌"); }
  };

  const resetPassword = async () => {
    if (password !== confirmPassword) { alert("Passwords do not match ❌"); return; }
    if (!password) { alert("Please fill both fields ❌"); return; }
    try {
      await API.post("/auth/reset-password", { email, newPassword: password });
      alert("Password reset successful 🚀"); navigate("/login");
    } catch { alert("Reset failed ❌"); }
  };

  const steps = ["Email", "Verify OTP", "New Password"];
  const isInterviewer = role === "interviewer";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative z-10 select-none">
      
      {/* Centered Liquid-Glass Form Card */}
      <div className="liquid-glass w-full max-w-md rounded-3xl p-8 md:p-10 border border-white/10 bg-black/45 backdrop-blur-2xl shadow-[0_32px_80px_rgba(0,0,0,0.65)] relative overflow-hidden space-y-6">
        
        {/* Glow corner element */}
        <div className={`absolute top-0 right-0 w-24 h-24 filter blur-xl rounded-full opacity-20 pointer-events-none ${isInterviewer ? 'bg-amber-500' : 'bg-brand'}`} />
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02]">
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isInterviewer ? 'bg-amber-500' : 'bg-brand'}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
              Recover Account
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>Reset Password</span>
          </h2>
          
          <p className="text-xs text-white/50 leading-relaxed max-w-[240px] mx-auto">
            Follow the steps to securely recover your account parameters.
          </p>
        </div>

        {/* Progress steps dots */}
        <div className="flex items-center justify-between px-2 py-1 bg-white/[0.02] border border-white/5 rounded-2xl select-none">
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all duration-200">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black tracking-wider transition-all duration-300
                    ${i + 1 <= step 
                      ? 'bg-white text-black font-extrabold shadow-md' 
                      : 'bg-white/5 text-white/30 border border-white/10'
                    }
                  `}
                >
                  {i + 1 < step ? "✓" : i + 1}
                </div>
                <span className={`text-[10px] font-bold ${i + 1 <= step ? 'text-white' : 'text-white/30'}`}>{s}</span>
              </div>
              {i < steps.length - 1 && <div className="flex-1 h-[1px] bg-white/5" />}
            </React.Fragment>
          ))}
        </div>

        {/* Step 1: Info (Email) */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/55 uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <input 
                  type="email" 
                  placeholder="you@example.com" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-white/30 focus:border-brand/40 focus:bg-white/[0.04] transition-all focus:outline-none"
                />
                <Mail className="w-4 h-4 text-white/30 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button 
              onClick={sendOtp} 
              disabled={loading || !email} 
              className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all select-none shadow-lg mt-2
                ${loading || !email 
                  ? 'bg-white/10 text-white/40 cursor-not-allowed border border-white/5' 
                  : 'bg-white text-black hover:bg-white/95 active:scale-[0.98]'
                }
              `}
            >
              {loading ? "Sending OTP..." : timer > 0 ? `Wait ${timer}s` : "Send OTP"}
            </button>

            {canResend && (
              <button 
                onClick={sendOtp} 
                className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-white/70 hover:bg-white/10 active:scale-[0.98] transition-all text-xs font-semibold"
              >
                Resend OTP
              </button>
            )}
          </div>
        )}

        {/* Step 2: Verify OTP */}
        {step === 2 && (
          <div className="space-y-4">
            <p className="text-xs text-white/50 leading-relaxed text-center">
              Enter the verification code sent to <strong className="text-brand">{email}</strong>
            </p>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/55 uppercase tracking-wider block text-center">OTP Code</label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Enter OTP" 
                  value={otp} 
                  onChange={e => setOtp(e.target.value)} 
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3.5 text-center text-base tracking-[0.2em] font-mono text-white focus:border-brand/40 focus:bg-white/[0.04] transition-all focus:outline-none font-bold"
                />
              </div>
            </div>

            <button 
              onClick={verifyOtp} 
              className="w-full py-3.5 bg-white text-black hover:bg-white/95 active:scale-[0.98] rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg"
            >
              Verify OTP
            </button>
            
            <button 
              onClick={() => setStep(1)} 
              className="w-full py-2.5 bg-transparent border border-white/10 hover:bg-white/5 rounded-xl text-white/40 hover:text-white transition-all text-xs font-semibold"
            >
              ← Change Email
            </button>
          </div>
        )}

        {/* Step 3: New Password Configuration */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/55 uppercase tracking-wider block">New Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Min. 8 characters" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-white/30 focus:border-brand/40 focus:bg-white/[0.04] transition-all focus:outline-none"
                />
                <Lock className="w-4 h-4 text-white/30 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-white/55 uppercase tracking-wider block">Confirm Password</label>
              <div className="relative">
                <input 
                  type="password" 
                  placeholder="Re-enter new password" 
                  value={confirmPassword} 
                  onChange={e => setConfirmPassword(e.target.value)} 
                  className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-white/30 focus:border-brand/40 focus:bg-white/[0.04] transition-all focus:outline-none"
                />
                <Lock className="w-4 h-4 text-white/30 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button 
              onClick={resetPassword} 
              className="w-full py-3.5 bg-white text-black hover:bg-white/95 active:scale-[0.98] rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-lg mt-2"
            >
              Reset Password
            </button>
          </div>
        )}

        {/* Forgot password footer link */}
        <div className="text-center text-xs">
          <span className="text-white/40">
            Remember your password?{" "}
            <span 
              onClick={() => navigate("/login")} 
              className="text-[#22d3ee] font-semibold hover:underline cursor-pointer"
            >
              Sign in
            </span>
          </span>
        </div>

      </div>
    </div>
  );
}
