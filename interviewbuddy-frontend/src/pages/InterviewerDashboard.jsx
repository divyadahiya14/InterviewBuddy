import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Edit3, 
  Star, 
  Video, 
  Plus, 
  Folder,
  Sparkles,
  Inbox
} from "lucide-react";
import API from "../services/api";

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

export default function InterviewerDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || localStorage.getItem("email") || "";
  const [bookings, setBookings] = useState([]);
  const [profile, setProfile] = useState({ name: "", email, bio: "", rating: 0 });

  useEffect(() => { if (email) { fetchBookings(); fetchProfile(); } }, [email]);

  const fetchBookings = async () => {
    try { const res = await API.get(`/booking/interviewer?email=${email}`); setBookings(res.data); }
    catch (err) { console.log(err); }
  };

  const fetchProfile = async () => {
    try {
      const res = await API.get(`/interviewer/by-email?email=${email}`);
      setProfile(prev => ({ ...prev, name: res.data.name ?? prev.name, bio: res.data.bio ?? prev.bio, rating: res.data.rating ?? prev.rating ?? 0 }));
    } catch (err) { console.log(err); }
  };

  const statusColors = { 
    CONFIRMED: { bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" }, 
    PENDING: { bg: "bg-brand/10 text-brand border-brand/20" } 
  };
  const getStatus = (s) => statusColors[s] || statusColors.PENDING;

  const isPast = (dateStr, slotStr) => {
    if (!dateStr || !slotStr) return false;
    try {
      const endTimeStr = slotStr.split("-")[1]?.trim();
      if (!endTimeStr) return false;
      const [endH, endM] = endTimeStr.split(":").map(Number);
      const [y, m, d] = dateStr.split("-").map(Number);
      const slotEnd = new Date(y, m - 1, d, endH, endM);
      return new Date() > slotEnd;
    } catch(e) { return false; }
  };

  return (
    <div className="relative min-h-screen pb-24 text-white z-10">
      
      {/* NAVBAR */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/5 bg-[#0c0c0c]/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center gap-2.5 cursor-pointer select-none" onClick={() => navigate("/")}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-brand/25">
            <LogoMark className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg text-white tracking-tight">
            Interview <span className="text-[#22d3ee]">Buddy</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 text-[10px] font-extrabold tracking-widest text-[#f59e0b] uppercase">
            👨‍🏫 Expert Coach
          </span>
          
          <button 
            onClick={() => navigate("/interviewer-profile", { state: { email: profile.email || localStorage.getItem("email") } })}
            className="flex items-center gap-2 rounded-full px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all text-xs font-semibold text-white/80 cursor-pointer"
          >
            <Edit3 size={14} className="text-white/60" />
            Edit Profile
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 mt-12 md:mt-16 relative z-10">

        {/* PROFILE HEADER */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass rounded-3xl p-8 border border-white/5 flex flex-col md:flex-row items-center gap-6 mb-8 text-center md:text-left"
        >
          <div className="w-[72px] h-[72px] rounded-full bg-gradient-to-r from-brand to-[#8b5cf6] flex items-center justify-center text-3xl font-extrabold text-white shadow-[0_0_30px_rgba(61,129,227,0.35)] border-2 border-white/10 flex-shrink-0">
            {profile.name ? profile.name.charAt(0).toUpperCase() : <User />}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
              <h1 className="text-xl md:text-2xl font-black text-white leading-tight">{profile.name || "Expert Mentor"}</h1>
              <span className="self-center flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-extrabold text-amber-400">
                <Star size={13} fill="currentColor" /> {profile.rating || "0.0"}
              </span>
            </div>
            <p className="text-xs text-white/45">{profile.email}</p>
            {profile.bio && <p className="text-sm text-white/60 leading-relaxed max-w-xl">{profile.bio}</p>}
          </div>
        </motion.div>

        {/* STATS ROW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {[
            { label: "Total Sessions", value: bookings.length, icon: Calendar, color: "text-[#22d3ee]" },
            { label: "Confirmed", value: bookings.filter(b => b.status === "CONFIRMED").length, icon: CheckCircle, color: "text-emerald-400" },
            { label: "Pending", value: bookings.filter(b => b.status !== "CONFIRMED").length, icon: Clock, color: "text-brand" }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="liquid-glass rounded-2xl p-6 text-center border border-white/5 flex flex-col items-center justify-between"
              >
                <div className={`p-2.5 bg-white/5 border border-white/10 rounded-xl mb-3 ${stat.color}`}>
                  <Icon size={20} />
                </div>
                <div className="text-3xl font-black tracking-tight text-white/95 mt-1">{stat.value}</div>
                <div className="text-[10px] text-white/40 font-bold uppercase tracking-wider mt-1">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* BOOKINGS WORKSPACE */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass rounded-3xl p-6 md:p-8 border border-white/5"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              📋 Interview Bookings
              <span className="text-[10px] font-extrabold px-2.5 py-1 bg-brand/15 border border-brand/20 rounded-full text-brand tracking-wider">{bookings.length}</span>
            </h2>
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-20 text-white/30 flex flex-col items-center">
              <Inbox size={48} className="mb-4 text-white/10" />
              <p className="text-sm font-semibold">No active bookings. Your scheduled candidate sessions will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => {
                const sc = getStatus(b.status);
                const past = isPast(b.date, b.selectedSlot);
                return (
                  <div 
                    key={b.id} 
                    className={`bg-white/[0.01] hover:bg-white/[0.02] border border-white/5 hover:border-white/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300 ${
                      past ? "opacity-45" : "opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand flex-shrink-0">
                        <User size={18} />
                      </div>
                      <div>
                        <div className="font-extrabold text-sm text-white/95 leading-snug">{b.intervieweeEmail}</div>
                        <div className="flex items-center gap-3 text-[10px] text-white/45 mt-1 font-bold">
                          <span className="flex items-center gap-1"><Calendar size={11} /> {b.date}</span>
                          {b.selectedSlot && <span className="flex items-center gap-1"><Clock size={11} /> {b.selectedSlot}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 self-end sm:self-auto">
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold tracking-wide uppercase border ${
                        past 
                          ? "bg-white/5 text-white/50 border-white/5" 
                          : sc.bg
                      }`}>
                        {past ? "COMPLETED" : b.status}
                      </span>
                      
                      {b.meetLink && (
                        past ? (
                           <span className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/40 text-[10px] font-bold cursor-not-allowed flex items-center gap-1">
                             Session Ended
                           </span>
                        ) : (
                          <a 
                            href={b.meetLink} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="px-4 py-2 bg-brand/10 hover:bg-brand/20 border border-brand/25 text-[#818cf8] hover:text-white rounded-xl text-[10px] font-bold transition-all text-center flex items-center gap-1"
                          >
                            <Video size={12} /> Join Meet
                          </a>
                        )
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}