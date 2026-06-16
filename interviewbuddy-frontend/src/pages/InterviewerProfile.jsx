import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, 
  User, 
  Briefcase, 
  MapPin, 
  Save, 
  Plus, 
  X, 
  Calendar, 
  Clock, 
  Sparkles,
  Link,
  Lock,
  Globe,
  Settings,
  CheckCircle
} from "lucide-react";
import API from "../services/api";

const Field = ({ name, placeholder, type = "text", fullWidth = false, disabled = false, form, handleChange }) => (
  <div className={fullWidth ? "col-span-full" : ""}>
    <label className="block text-[10px] font-black text-white/35 uppercase tracking-wider mb-2">{placeholder}</label>
    <div className="relative">
      <input 
        name={name} 
        type={type} 
        placeholder={placeholder} 
        value={form[name] || ""} 
        onChange={handleChange} 
        disabled={disabled}
        className={`w-full px-5 py-3.5 bg-white/[0.015] border border-white/10 rounded-2xl text-white placeholder-white/20 text-xs font-semibold focus:border-brand/40 focus:bg-white/[0.03] focus:shadow-[0_0_25px_rgba(61,129,227,0.05)] outline-none transition-all duration-300 ${
          disabled ? "cursor-not-allowed opacity-45" : "cursor-text opacity-100"
        }`}
      />
      {disabled && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25" title="Field is locked">
          <Lock size={12} />
        </div>
      )}
    </div>
  </div>
);

export default function InterviewerProfile() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || localStorage.getItem("email") || "";

  const [form, setForm] = useState({ name: "", email, password: "", intro: "", speciality: "", experience: "", price: "", linkedin: "", github: "", bio: "", languages: "", upiId: "" });
  const [selectedDates, setSelectedDates] = useState([]);
  const [availability, setAvailability] = useState({});

  React.useEffect(() => {
    if (!email) return;
    API.get(`/interviewer/by-email?email=${email}`)
      .then(res => {
        if (res.data) {
          const d = res.data;
          setForm({
            name: d.name || "", email: d.email || email, password: d.password || "",
            intro: d.intro || "", speciality: d.speciality || "", experience: d.experience || "",
            price: d.price || "", linkedin: d.linkedin || "", github: d.github || "",
            bio: d.bio || "", languages: d.languages || "", upiId: d.upiId || ""
          });
          if (d.availability && d.availability.length > 0) {
            const availObj = {};
            const dates = [];
            d.availability.forEach(a => {
              dates.push(a.date);
              availObj[a.date] = a.timeSlots || [];
            });
            setSelectedDates(dates);
            setAvailability(availObj);
          }
        }
      }).catch(err => console.log(err));
  }, [email]);

  const generateSlots = () => {
    const slots = []; let h = 9, m = 0;
    while (h < 22) {
      let nh = h, nm = m + 40;
      if (nm >= 60) { nh += 1; nm -= 60; }
      slots.push(`${String(h).padStart(2,"0")}:${String(m).padStart(2,"0")} - ${String(nh).padStart(2,"0")}:${String(nm).padStart(2,"0")}`);
      h = nh; m = nm;
    }
    return slots;
  };
  const timeSlots = generateSlots();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const toggleDate = date => {
    if (!date) return;
    setSelectedDates(prev => prev.includes(date) ? prev.filter(d => d !== date) : [...prev, date]);
  };
  const toggleSlot = (date, slot) => setAvailability(prev => { const ex = prev[date] || []; return { ...prev, [date]: ex.includes(slot) ? ex.filter(s => s !== slot) : [...ex, slot] }; });

  const saveProfile = async () => {
    if (!form.name.trim()) return alert("Name is required");
    if (!form.password.trim()) return alert("Password is required");
    if (!form.speciality.trim()) return alert("Speciality is required");
    if (!form.bio.trim()) return alert("Bio is required");
    const payload = { ...form, email, experience: parseInt(form.experience) || 0, price: parseInt(form.price) || 0, availability: Object.keys(availability).map(date => ({ date, timeSlots: availability[date] || [] })) };
    try { await API.put("/interviewer", payload); alert("Profile Updated 🚀"); navigate("/interviewer-dashboard", { state: { email } }); }
    catch { alert("Update Failed ❌"); }
  };

  return (
    <div className="relative min-h-screen pb-24 text-white z-10">
      <div className="max-w-4xl mx-auto px-6 mt-12 md:mt-16 relative z-10">

        {/* Header */}
        <div className="mb-10">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 rounded-full px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 active:scale-[0.98] transition-all text-xs font-semibold text-white/80 cursor-pointer mb-6 w-fit"
          >
            <ArrowLeft size={14} className="text-white/75" />
            Back to Dashboard
          </button>
          
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 text-[10px] font-extrabold tracking-widest text-[#22d3ee] uppercase">
            <Settings size={12} className="animate-spin [animation-duration:10s]" />
            Expert Hub Settings
          </div>
          
          <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2">Interviewer Profile Setup</h1>
          <p className="text-xs text-white/50 leading-relaxed">Configure your diagnostic billing parameters, specializations, and time slots availability.</p>
        </div>

        {/* Profile Form */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass rounded-3xl p-6 md:p-8 border border-white/5 mb-8"
        >
          <h2 className="text-base font-extrabold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
            <User size={16} className="text-brand" /> Personal Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field name="name" placeholder="Full Name" form={form} handleChange={handleChange} />
            <Field name="email" placeholder="Email Address" disabled form={form} handleChange={handleChange} />
            <Field name="password" placeholder="Dashboard Access Password" type="password" form={form} handleChange={handleChange} />
            <Field name="speciality" placeholder="Speciality (e.g. DSA, System Design)" form={form} handleChange={handleChange} />
            <Field name="experience" placeholder="Years of Experience" type="number" form={form} handleChange={handleChange} />
            <Field name="price" placeholder="Price Per Interview Session (₹)" type="number" form={form} handleChange={handleChange} />
            <Field name="languages" placeholder="Fluent Languages (e.g. English, Hindi)" form={form} handleChange={handleChange} />
            <Field name="linkedin" placeholder="LinkedIn Profile URL" form={form} handleChange={handleChange} />
            <Field name="github" placeholder="GitHub Repository URL" form={form} handleChange={handleChange} />
            <Field name="upiId" placeholder="UPI ID (for automated payments)" form={form} handleChange={handleChange} />
            
            <div className="col-span-full">
              <label className="block text-[10px] font-black text-white/35 uppercase tracking-wider mb-2">Profile Pitch Bio (Short)</label>
              <input 
                name="bio" 
                placeholder="Brief high-impact bio..." 
                value={form.bio} 
                onChange={handleChange} 
                className="w-full px-5 py-3.5 bg-white/[0.015] border border-white/10 rounded-2xl text-white placeholder-white/20 text-xs font-semibold focus:border-brand/40 focus:bg-white/[0.03] focus:shadow-[0_0_25px_rgba(61,129,227,0.05)] outline-none transition-all duration-300"
              />
            </div>
            
            <div className="col-span-full">
              <label className="block text-[10px] font-black text-white/35 uppercase tracking-wider mb-2">Comprehensive Introduction / About Me</label>
              <textarea 
                name="intro" 
                placeholder="Introduce your engineering achievements and coaching methodology..." 
                value={form.intro} 
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-white/[0.015] border border-white/10 rounded-2xl text-white placeholder-white/20 text-xs font-semibold focus:border-brand/40 focus:bg-white/[0.03] focus:shadow-[0_0_25px_rgba(61,129,227,0.05)] outline-none min-h-[100px] resize-y transition-all duration-300"
              />
            </div>
          </div>
        </motion.div>

        {/* Availability setup */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass rounded-3xl p-6 md:p-8 border border-white/5 mb-8"
        >
          <h2 className="text-base font-extrabold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
            <Calendar size={16} className="text-[#22d3ee]" /> Set Availability Calendar
          </h2>
          
          <div className="mb-6 max-w-sm">
            <label className="block text-[10px] font-black text-white/35 uppercase tracking-wider mb-2">Add a Date slot</label>
            <input 
              type="date" 
              onChange={e => toggleDate(e.target.value)} 
              className="w-full px-5 py-3.5 bg-white/[0.015] border border-white/10 rounded-2xl text-white outline-none focus:border-cyan-500/40 focus:bg-white/[0.03] transition-all duration-300 text-xs font-semibold colorScheme:dark" 
            />
          </div>

          <AnimatePresence>
            {selectedDates.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-wrap gap-2 mb-6"
              >
                {selectedDates.map(d => (
                  <span 
                    key={d} 
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-xs font-extrabold text-brand tracking-wide"
                  >
                    📅 {d} 
                    <button 
                      onClick={() => toggleDate(d)} 
                      className="ml-1 cursor-pointer text-rose-400 hover:text-rose-300 font-extrabold"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-6">
            {selectedDates.map(date => (
              <div key={date} className="bg-white/[0.01] border border-white/5 rounded-2xl p-5 md:p-6">
                <h4 className="text-sm font-extrabold text-[#22d3ee] mb-4 flex items-center gap-1.5">
                  <Calendar size={14} /> Available Slots for {date}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map(slot => {
                    const isSelected = availability[date]?.includes(slot);
                    return (
                      <button 
                        key={slot} 
                        onClick={() => toggleSlot(date, slot)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-bold border transition-all duration-200 cursor-pointer ${
                          isSelected 
                            ? "bg-gradient-to-r from-brand to-[#8b5cf6] text-white border-transparent shadow-sm" 
                            : "bg-white/5 border-white/10 text-white/50 hover:bg-white/10 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <AnimatePresence>
            {Object.keys(availability).some(d => availability[d]?.length > 0) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-6 p-5 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl space-y-4"
              >
                <h4 className="text-xs font-extrabold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wide">
                  <CheckCircle size={14} /> Selected Active Slots Grid
                </h4>
                <div className="space-y-3">
                  {Object.keys(availability).map(date => availability[date]?.length > 0 && (
                    <div key={date} className="flex flex-col sm:flex-row sm:items-center gap-3 py-2 border-b border-white/5 last:border-b-0 text-xs">
                      <div className="font-extrabold text-white/70 min-w-[90px]">{date}</div>
                      <div className="flex flex-wrap gap-1.5">
                        {availability[date].map(t => (
                          <span 
                            key={t} 
                            className="px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[9px] text-emerald-400 font-extrabold tracking-wide"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Save CTA */}
        <button 
          onClick={saveProfile} 
          className="w-full py-5 rounded-2xl bg-gradient-to-r from-brand to-[#8b5cf6] hover:brightness-[1.05] active:scale-[0.98] transition-all text-sm font-extrabold text-white shadow-[0_8px_25px_rgba(61,129,227,0.35)] cursor-pointer flex items-center justify-center gap-2"
        >
          <Save size={16} /> Save Profile & Active Slots
        </button>

      </div>
    </div>
  );
}