import React, { useState, useEffect } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import { User, X, Check, Loader2 } from "lucide-react";

export default function EditProfileModal({ isOpen, onClose, currentName, onSave }) {
  const [name, setName] = useState(currentName || "");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);

  // Sync name when modal opens with updated currentName
  useEffect(() => {
    if (isOpen) setName(currentName || "");
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const email = localStorage.getItem("email");
      const res = await API.put("/auth/profile", { email, name });
      toast.success(res.data.message || "Profile updated successfully!");

      // Update local storage
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      user.name = res.data.name;
      localStorage.setItem("user", JSON.stringify(user));

      onSave(res.data.name);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") onClose();
  };

  const initial = name.trim().charAt(0).toUpperCase() || "?";

  return (
    /* Backdrop */
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        padding: "24px",
        animation: "fadeInBackdrop 0.2s ease",
      }}
    >
      <style>{`
        @keyframes fadeInBackdrop {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes slideUpCard {
          from { opacity: 0; transform: scale(0.95) translateY(16px); }
          to   { opacity: 1; transform: scale(1)   translateY(0); }
        }
        @keyframes avatarPop {
          0%   { transform: scale(0.7); opacity: 0; }
          70%  { transform: scale(1.1); opacity: 1; }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Modal Card */}
      <div
        style={{
          background: "linear-gradient(145deg, rgba(14,16,20,0.97) 0%, rgba(20,24,32,0.97) 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "36px 32px 32px",
          width: "100%",
          maxWidth: "420px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
          position: "relative",
          animation: "slideUpCard 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          fontFamily: "Inter, system-ui, sans-serif",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.04)",
            color: "rgba(255,255,255,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = "rgba(255,255,255,0.9)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.color = "rgba(255,255,255,0.45)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          }}
        >
          <X size={15} />
        </button>

        {/* Avatar Preview */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #3d81e3 0%, #8b5cf6 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "28px",
              fontWeight: "900",
              color: "white",
              boxShadow: "0 0 0 4px rgba(61,129,227,0.15), 0 8px 32px rgba(61,129,227,0.35)",
              animation: "avatarPop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.1s both",
              letterSpacing: "-0.5px",
              userSelect: "none",
            }}
          >
            {initial}
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <h2 style={{
            margin: "0 0 6px 0",
            fontSize: "20px",
            fontWeight: "800",
            color: "#ffffff",
            letterSpacing: "-0.4px",
          }}>
            Edit Profile
          </h2>
          <p style={{
            margin: 0,
            fontSize: "12.5px",
            color: "rgba(255,255,255,0.38)",
            lineHeight: "1.5",
            fontWeight: "500",
          }}>
            Update your display name across the platform
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "rgba(255,255,255,0.05)", marginBottom: "24px" }} />

        {/* Input Field */}
        <div style={{ marginBottom: "24px" }}>
          <label style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            fontSize: "11px",
            fontWeight: "700",
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: "10px",
          }}>
            <User size={11} style={{ opacity: 0.7 }} />
            Full Name
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="e.g. Divya Dahiya"
            style={{
              width: "100%",
              padding: "13px 16px",
              background: focused
                ? "rgba(61,129,227,0.06)"
                : "rgba(255,255,255,0.03)",
              border: `1px solid ${focused ? "rgba(61,129,227,0.5)" : "rgba(255,255,255,0.08)"}`,
              borderRadius: "12px",
              color: "#f8fafc",
              fontSize: "14px",
              fontWeight: "600",
              outline: "none",
              boxSizing: "border-box",
              fontFamily: "Inter, system-ui, sans-serif",
              transition: "all 0.2s ease",
              boxShadow: focused
                ? "0 0 0 3px rgba(61,129,227,0.15)"
                : "none",
              letterSpacing: "-0.2px",
            }}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px 16px",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "12px",
              color: "rgba(255,255,255,0.55)",
              fontSize: "13px",
              fontWeight: "700",
              cursor: "pointer",
              transition: "all 0.15s ease",
              fontFamily: "Inter, system-ui, sans-serif",
              letterSpacing: "-0.1px",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.14)";
              e.currentTarget.style.color = "rgba(255,255,255,0.85)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "rgba(255,255,255,0.55)";
            }}
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            style={{
              flex: 2,
              padding: "12px 20px",
              background: loading
                ? "rgba(61,129,227,0.4)"
                : "linear-gradient(135deg, #3d81e3 0%, #8b5cf6 100%)",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontSize: "13px",
              fontWeight: "800",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              fontFamily: "Inter, system-ui, sans-serif",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "7px",
              boxShadow: loading ? "none" : "0 4px 20px rgba(61,129,227,0.35)",
              letterSpacing: "-0.1px",
            }}
            onMouseEnter={e => {
              if (!loading) {
                e.currentTarget.style.filter = "brightness(1.1)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(61,129,227,0.45)";
              }
            }}
            onMouseLeave={e => {
              e.currentTarget.style.filter = "none";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(61,129,227,0.35)";
            }}
            onMouseDown={e => { if (!loading) e.currentTarget.style.transform = "scale(0.97)"; }}
            onMouseUp={e => { if (!loading) e.currentTarget.style.transform = "translateY(-1px)"; }}
          >
            {loading ? (
              <>
                <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                Saving...
              </>
            ) : (
              <>
                <Check size={14} strokeWidth={3} />
                Save Changes
              </>
            )}
          </button>
        </div>

        {/* Spinning loader keyframe */}
        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    </div>
  );
}
