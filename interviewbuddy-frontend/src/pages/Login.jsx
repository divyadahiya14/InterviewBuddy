import React, { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase";
import API from "../services/api";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles, Mail, Lock } from "lucide-react";

export default function Login() {
  const location = useLocation();
  const role = location.state?.role || localStorage.getItem("role") || "interviewee";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password, role });
      const loggedUser = {
        email: res.data?.email || email,
        name: res.data?.name || "",
        role: res.data?.role || role
      };
      const message = res.data?.message || "";
      if (message.toLowerCase().includes("another role")) { alert("⚠️ This email is registered for another role"); return; }
      localStorage.setItem("user", JSON.stringify(loggedUser));
      localStorage.setItem("email", loggedUser.email);
      localStorage.setItem("role", loggedUser.role.toLowerCase());
      if (role === "interviewee") navigate("/interview-choice");
      else navigate("/interviewer-dashboard", { state: { email: loggedUser.email, name: loggedUser.name || "" } });
    } catch (error) {
      const msg = typeof error.response?.data === "string" ? error.response.data : (error.response?.data?.error || error.response?.data?.message || error.message || "");
      if (msg.toLowerCase().includes("already registered")) { alert("⚠️ This email is registered for another role"); return; }
      alert(msg || "Login failed");
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const res = await API.post("/auth/google-login", { email: user.email, name: user.displayName, role });
      const message = res.data?.message || "";
      if (message.toLowerCase().includes("another role")) { alert("⚠️ This email is registered for another role"); return; }
      const loggedUser = {
        email: res.data?.email || user.email,
        name: res.data?.name || user.displayName,
        role: res.data?.role || role
      };
      localStorage.setItem("user", JSON.stringify(loggedUser));
      localStorage.setItem("email", loggedUser.email);
      localStorage.setItem("role", loggedUser.role.toLowerCase());
      if (role === "interviewee") navigate("/interview-choice");
      else navigate("/interviewer-dashboard", { state: { email: user.email, name: user.displayName } });
    } catch (error) {
      const msg = typeof error.response?.data === "string" ? error.response.data : (error.response?.data?.error || error.response?.data?.message || error.message || "");
      if (msg.toLowerCase().includes("already registered")) { alert("⚠️ This email is registered for another role"); return; }
      if (error.code === "auth/popup-blocked") alert("⚠️ Popup blocked! Please allow popups and try again.");
      else alert(msg || "Google login failed");
    }
  };

  const isInterviewer = role === "interviewer";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-transparent relative z-10 select-none">
      
      {/* Centered Liquid-Glass Form Card */}
      <div className="liquid-glass w-full max-w-md rounded-3xl p-8 md:p-10 border border-white/10 bg-black/45 backdrop-blur-2xl shadow-[0_32px_80px_rgba(0,0,0,0.65)] relative overflow-hidden space-y-6">
        
        {/* Glow corner elements */}
        <div className={`absolute top-0 right-0 w-24 h-24 filter blur-xl rounded-full opacity-20 pointer-events-none ${isInterviewer ? 'bg-amber-500' : 'bg-brand'}`} />
        
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/[0.02]">
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isInterviewer ? 'bg-amber-500' : 'bg-brand'}`} />
            <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">
              {isInterviewer ? "Expert Portal" : "Candidate Portal"}
            </span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center justify-center gap-2">
            <span>Sign in to</span>
            <span className="text-[#22d3ee]">Buddy</span>
          </h2>
          
          <p className="text-xs text-white/50 leading-relaxed max-w-[240px] mx-auto">
            {isInterviewer 
              ? "Welcome back. Access your human mock booking dashboard." 
              : "Practice real coding algorithm challenges with standard AI feedback."}
          </p>
        </div>

        {/* Google Authentication */}
        <button 
          onClick={handleGoogleLogin} 
          className="w-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] rounded-xl py-3 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md select-none"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Divider separator */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-[1px] bg-white/5" />
          <span className="text-[10px] font-bold text-white/35 font-mono">OR</span>
          <div className="flex-1 h-[1px] bg-white/5" />
        </div>

        {/* Inputs */}
        <div className="space-y-4">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-white/55 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <input 
                type="email" 
                placeholder="name@example.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-white/30 focus:border-brand/40 focus:bg-white/[0.04] transition-all focus:outline-none"
              />
              <Mail className="w-4 h-4 text-white/30 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-white/55 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs text-white placeholder-white/30 focus:border-brand/40 focus:bg-white/[0.04] transition-all focus:outline-none"
              />
              <Lock className="w-4 h-4 text-white/30 absolute left-3.5 top-3.5" />
            </div>
          </div>
        </div>

        {/* Forgot password */}
        <div className="flex items-center justify-between text-xs select-none">
          <span className="text-white/40">
            Don't have an account?{" "}
            <span 
              onClick={() => navigate("/register", { state: { role } })} 
              className="text-[#22d3ee] font-semibold hover:underline cursor-pointer"
            >
              Register
            </span>
          </span>
          
          <span 
            onClick={() => navigate("/forgot-password", { state: { role } })} 
            className="text-brand font-semibold hover:underline cursor-pointer"
          >
            Forgot password?
          </span>
        </div>

        {/* Submit */}
        <button 
          onClick={handleLogin} 
          disabled={loading} 
          className={`w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all select-none shadow-lg
            ${loading 
              ? 'bg-white/10 text-white/40 cursor-not-allowed border border-white/5' 
              : 'bg-white text-black hover:bg-white/95 active:scale-[0.98]'
            }
          `}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

      </div>
    </div>
  );
}