import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  Briefcase, 
  IndianRupee, 
  Star, 
  Calendar, 
  Clock, 
  User, 
  ExternalLink,
  X,
  CreditCard,
  Sparkles
} from "lucide-react";

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

export default function HumanInterview() {
  const navigate = useNavigate();
  const [interviewers, setInterviewers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const [ratingTarget, setRatingTarget] = useState(null);
  const [ratingScore, setRatingScore] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => { fetchInterviewers(); }, []);

  const fetchInterviewers = async () => {
    try {
      const res = await API.get("/interviewer/all");
      setInterviewers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBook = async (intv, date, time) => {
    if (!date || !time) { toast.error("Please select an available date and time slot first!"); return; }
    try {
      const res = await API.post("/booking/create-order", { amount: intv.price });
      const { orderId, amount, key } = res.data;
      const options = {
        key, amount: amount * 100, currency: "INR",
        name: "Interview Buddy", description: "Expert Interview Booking",
        order_id: orderId,
        handler: async function (response) {
          toast.success("Payment Successful! Check your email for details.");
          await API.post("/booking/confirm", {
            intervieweeEmail: JSON.parse(localStorage.getItem("user")).email,
            interviewerEmail: intv.email, interviewerId: intv.id,
            date, selectedSlot: time, paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id, status: "PAID",
          });
        },
        prefill: { email: JSON.parse(localStorage.getItem("user")).email },
        theme: { color: "#3D81E3" },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Please try again.");
    }
  };

  const handleRatingClick = (intv, e) => {
    e.stopPropagation();
    setRatingTarget(intv);
    setRatingScore(0);
    setHoverRating(0);
  };

  const handleRatingSubmit = async () => {
    if (ratingScore === 0) {
      toast.error("Please select a star rating first!");
      return;
    }
    try {
      await API.post(`/interviewer/${ratingTarget.id}/rate?score=${ratingScore}`);
      toast.success(`Successfully rated ${ratingTarget.name} ${ratingScore} Stars!`);
      setRatingTarget(null);
      fetchInterviewers();
    } catch (err) {
      console.error("Error submitting rating:", err);
      const errMsg = err.response?.data?.error || err.response?.data?.message || err.message || "Unknown error";
      toast.error(`Failed to submit rating: ${errMsg}`);
    }
  };

  const getInitials = (name) => name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?";

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

        <button 
          onClick={() => navigate("/interview-choice")} 
          className="flex items-center gap-2 rounded-full px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all text-xs font-semibold text-white/80"
        >
          <ArrowLeft size={14} className="text-white/75" />
          Back to Dashboard
        </button>
      </nav>

      {/* HEADER */}
      <div className="max-w-4xl mx-auto px-6 mt-12 md:mt-16 text-center relative z-10 mb-16">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-brand/20 bg-brand/10 text-[10px] font-extrabold tracking-widest text-brand uppercase">
          <Sparkles size={12} className="animate-pulse" />
          Expert Coaching Lobby
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
          Choose Your <span className="bg-gradient-to-r from-brand via-[#22d3ee] to-[#a4f4fd] bg-clip-text text-transparent animate-shiny">Expert Mentor</span>
        </h1>
        
        <p className="text-sm md:text-base text-white/60 max-w-xl mx-auto leading-relaxed">
          Select an experienced industry mentor based on your career goals. Pick a convenient time slot and schedule your mock session instantly.
        </p>
      </div>

      {/* INTERVIEWERS GRID */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {interviewers.length === 0 ? (
          <div className="col-span-full text-center py-20 text-white/30 flex flex-col items-center">
            <User size={48} className="mb-4 text-white/10 animate-pulse" />
            <p className="text-sm font-semibold">No expert interviewers available right now. Check back soon!</p>
          </div>
        ) : (
          interviewers.map((intv) => {
            const isSelected = selectedId === intv.id;
            return (
              <motion.div 
                key={intv.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className={`liquid-glass rounded-3xl p-6 border flex flex-col justify-between transition-all duration-300 ${
                  isSelected 
                    ? "border-brand/50 shadow-[0_0_30px_rgba(61,129,227,0.15)] bg-brand/5" 
                    : "border-white/5 hover:border-white/20 hover:-translate-y-1 hover:shadow-2xl"
                }`}
              >
                <div>
                  {/* Card Top / Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-3.5 items-center">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-brand to-[#22d3ee] flex items-center justify-center font-extrabold text-sm text-white border-2 border-white/10 shadow-lg">
                          {getInitials(intv.name)}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-sm text-white/95 leading-tight">{intv.name}</span>
                        </div>
                        <div className="inline-block mt-1 px-2.5 py-0.5 bg-brand/10 border border-brand/20 rounded-md text-[9px] font-bold text-white/80 tracking-wide">
                          {intv.speciality}
                        </div>
                      </div>
                    </div>
                    
                    {/* Social Shortcuts & Profile Action */}
                    <div className="flex flex-col items-end gap-2">
                      <button 
                        onClick={() => setSelected(intv)}
                        className="text-[10px] font-extrabold text-[#22d3ee] hover:text-white bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 transition-all hover:bg-brand/20 hover:border-brand/35"
                      >
                        Profile →
                      </button>
                      
                      {/* Direct Social Links */}
                      <div className="flex gap-1.5">
                        {intv.linkedin && (
                          <a 
                            href={intv.linkedin} 
                            target="_blank" 
                            rel="noreferrer" 
                            title="LinkedIn Profile"
                            className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-[#0077b5] hover:bg-[#0077b5]/10 hover:border-[#0077b5]/20 transition-all"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                          </a>
                        )}
                        {intv.github && (
                          <a 
                            href={intv.github} 
                            target="_blank" 
                            rel="noreferrer" 
                            title="GitHub Profile"
                            className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats Bar */}
                  <div className="flex gap-2.5 mb-6">
                    <div className="flex-1 bg-white/[0.015] border border-white/5 rounded-xl p-3 text-center">
                      <div className="text-xs text-[#22d3ee] font-black flex items-center justify-center gap-1">
                        <Briefcase size={12} /> {intv.experience}y
                      </div>
                      <div className="text-[9px] text-white/40 mt-1 font-bold uppercase tracking-wider">Experience</div>
                    </div>

                    <div className="flex-1 bg-white/[0.015] border border-white/5 rounded-xl p-3 text-center">
                      <div className="text-xs text-emerald-400 font-black flex items-center justify-center gap-0.5">
                        <IndianRupee size={12} />{intv.price}
                      </div>
                      <div className="text-[9px] text-white/40 mt-1 font-bold uppercase tracking-wider">Session</div>
                    </div>

                    <div 
                      onClick={(e) => handleRatingClick(intv, e)}
                      className="flex-1 bg-amber-500/[0.015] border border-amber-500/10 hover:border-amber-500/30 hover:bg-amber-500/10 hover:shadow-lg rounded-xl p-3 text-center cursor-pointer transition-all duration-300"
                      title="Click to submit a rating"
                    >
                      <div className="text-xs text-amber-400 font-black flex items-center justify-center gap-1">
                        <Star size={12} fill="currentColor" /> {intv.rating || "0.0"}
                      </div>
                      <div className="text-[9px] text-amber-400 mt-1 font-bold uppercase tracking-wider">Rate Mentor</div>
                    </div>
                  </div>

                  {/* Available Slots */}
                  <div className="mb-6">
                    <div className="text-[10px] font-black text-white/35 tracking-wider uppercase mb-3">Available Slots</div>
                    {(() => {
                      const todayStr = new Date().toLocaleDateString("en-CA");
                      const activeSlots = intv.availability?.filter(slot => 
                        slot.date >= todayStr && slot.timeSlots && slot.timeSlots.length > 0
                      ) || [];
                      
                      if (activeSlots.length === 0) {
                        return <p className="text-xs text-white/35 italic">No availability slots set.</p>;
                      }

                      return activeSlots.map((slot, i) => (
                        <div key={i} className="mb-3.5">
                          <div className="text-[10px] text-[#a78bfa] font-extrabold mb-1.5 flex items-center gap-1">
                            <Calendar size={11} />
                            {new Date(slot.date + "T00:00:00").toDateString()}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {slot.timeSlots?.map((time, j) => {
                              const active = isSelected && selectedDate === slot.date && selectedTime === time;
                              return (
                                <button 
                                  key={j} 
                                  onClick={() => { setSelectedId(intv.id); setSelectedDate(slot.date); setSelectedTime(time); }}
                                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all duration-150 border cursor-pointer ${
                                    active 
                                      ? "bg-gradient-to-r from-brand to-[#8b5cf6] text-white border-transparent shadow-sm" 
                                      : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10 hover:border-white/20 hover:text-white"
                                  }`}
                                >
                                  {time}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      ));
                    })()}
                  </div>
                </div>

                <div>
                  {isSelected && (!selectedDate || !selectedTime) && (
                    <p className="text-[10px] text-rose-400 font-bold mb-3 flex items-center gap-1 justify-center animate-pulse">
                      ⚠️ Please choose a date & slot bubble above
                    </p>
                  )}

                  <button 
                    onClick={() => handleBook(intv, selectedDate, selectedTime)}
                    className={`w-full py-3.5 rounded-2xl font-bold text-xs transition-all duration-300 border flex items-center justify-center gap-2 cursor-pointer ${
                      isSelected && selectedDate && selectedTime 
                        ? "bg-gradient-to-r from-brand to-[#8b5cf6] hover:brightness-[1.05] text-white border-transparent shadow-[0_4px_15px_rgba(61,129,227,0.3)] hover:-translate-y-0.5 active:scale-[0.98]" 
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-brand/30 hover:text-white active:scale-[0.98]"
                    }`}
                  >
                    {isSelected && selectedDate && selectedTime ? (
                      <>
                        <CreditCard size={14} /> Confirm & Pay Session
                      </>
                    ) : (
                      <>
                        <Calendar size={14} /> Schedule Interview Slot
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* RATING MODAL */}
      <AnimatePresence>
        {ratingTarget && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl flex items-center justify-center z-[1000] p-6"
            onClick={(e) => { if (e.target === e.currentTarget) setRatingTarget(null); }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-md liquid-glass rounded-3xl p-8 border border-white/10 text-center shadow-2xl relative"
            >
              <button 
                onClick={() => setRatingTarget(null)}
                className="absolute top-4 right-4 text-white/40 hover:text-white bg-white/5 border border-white/5 rounded-lg w-8 h-8 flex items-center justify-center transition-all"
              >
                <X size={15} />
              </button>

              <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto mb-5 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                <Star size={24} fill="currentColor" />
              </div>
              
              <h2 className="text-xl font-extrabold text-white mb-2">Rate {ratingTarget.name}</h2>
              <p className="text-xs text-white/50 mb-8 leading-relaxed max-w-xs mx-auto">
                Share your experience! Give a rating to help other candidate buddies choose the right expert mentor.
              </p>

              {/* Stars Row */}
              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = star <= (hoverRating || ratingScore);
                  return (
                    <Star
                      key={star}
                      onClick={() => setRatingScore(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      size={36}
                      fill={filled ? "#ffd700" : "transparent"}
                      className={`text-[#ffd700] cursor-pointer transition-all duration-150 ${
                        filled ? "scale-110 drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]" : "scale-100"
                      }`}
                    />
                  );
                })}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button 
                  onClick={() => setRatingTarget(null)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all rounded-xl text-xs font-bold text-white/70"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleRatingSubmit}
                  className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all duration-300 ${
                    ratingScore > 0 
                      ? "bg-gradient-to-r from-amber-400 to-[#d9a700] hover:brightness-[1.05] text-[#12152b] shadow-lg active:scale-[0.98]" 
                      : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed"
                  }`}
                >
                  Submit Rating
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROFILE DETAILS MODAL */}
      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl flex items-center justify-center z-[900] p-6"
            onClick={(e) => { if (e.target === e.currentTarget) setSelected(null); }}
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="w-full max-w-lg liquid-glass rounded-3xl p-8 border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Close */}
              <button 
                onClick={() => setSelected(null)}
                className="absolute top-5 right-5 text-white/40 hover:text-white bg-white/5 border border-white/5 rounded-lg w-8 h-8 flex items-center justify-center transition-all"
              >
                <X size={15} />
              </button>

              {/* Modal Header */}
              <div className="flex gap-4 items-center mb-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-brand to-[#8b5cf6] flex items-center justify-center text-lg font-extrabold text-white border-2 border-white/10 shadow-lg">
                  {getInitials(selected.name)}
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-white leading-tight">{selected.name}</h2>
                  <div className="inline-block mt-1.5 px-3 py-1 bg-brand/10 border border-brand/20 rounded-full text-[10px] font-bold text-white/80 tracking-wide">
                    {selected.speciality}
                  </div>
                </div>
              </div>

              {/* Intro & Bio */}
              <div className="space-y-3 mb-6">
                {selected.intro && <p className="text-xs text-white/70 leading-relaxed font-semibold">{selected.intro}</p>}
                {selected.bio && <p className="text-xs text-white/45 leading-relaxed">{selected.bio}</p>}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: Briefcase, label: "Experience", value: `${selected.experience} years`, color: "text-[#22d3ee]" },
                  { icon: IndianRupee, label: "Session Rate", value: `₹${selected.price}`, color: "text-emerald-400" },
                  { icon: Star, label: "Rating", value: selected.rating || "0.0", color: "text-amber-400" },
                  { icon: User, label: "Languages", value: selected.languages, color: "text-[#a5b4fc]" }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-white/[0.015] border border-white/5 rounded-2xl p-4 flex gap-3 items-center">
                      <div className={`p-2 bg-white/5 border border-white/10 rounded-xl ${stat.color}`}>
                        <Icon size={16} />
                      </div>
                      <div>
                        <div className="text-[9px] text-white/35 font-bold uppercase tracking-wider">{stat.label}</div>
                        <div className="text-xs font-extrabold text-white/90 mt-0.5">{stat.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* External Links */}
              {(selected.linkedin || selected.github) && (
                <div className="flex gap-2.5 mb-6">
                  {selected.linkedin && (
                    <a 
                      href={selected.linkedin} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex-1 flex items-center justify-center gap-1.5 py-3.5 bg-brand/10 border border-brand/20 hover:bg-brand/20 hover:border-brand/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-xl text-xs font-bold text-[#818cf8]"
                    >
                      LinkedIn Profile <ExternalLink size={12} />
                    </a>
                  )}
                  {selected.github && (
                    <a 
                      href={selected.github} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="flex-1 flex items-center justify-center gap-1.5 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5 active:scale-[0.98] transition-all rounded-xl text-xs font-bold text-white/70"
                    >
                      GitHub Profile <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              )}

              <button 
                onClick={() => setSelected(null)} 
                className="w-full py-3.5 bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 active:scale-[0.98] transition-all rounded-xl text-xs font-bold text-rose-400"
              >
                Close Profile
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}