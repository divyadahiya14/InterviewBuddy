// function Avatar({ speaking }) {
//   return (
//     <div className="avatar-container">
//       <img
//         src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
//         alt="AI Interviewer"
//         className={speaking ? "avatar speaking" : "avatar"}
//       />

//       <p>{speaking ? "🗣 Speaking..." : "🤖 Waiting for question..."}</p>
//     </div>
//   );
// }

// export default Avatar;
function Avatar({ speaking }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "12px",
    }}>
      {/* Avatar Circle */}
      <div style={{
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #1a1a2e, #16213e)",
        border: speaking ? "3px solid #00d4ff" : "3px solid #2a2a4a",
        boxShadow: speaking
          ? "0 0 20px #00d4ff88, 0 0 40px #00d4ff44"
          : "0 0 10px #00000088",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        transition: "all 0.3s ease",
        position: "relative",
      }}>

        {/* AI Face SVG */}
        <svg width="70" height="70" viewBox="0 0 100 100" fill="none">
          {/* Head */}
          <rect x="20" y="15" width="60" height="60" rx="12" fill="#0f3460" stroke="#00d4ff" strokeWidth="2"/>
          {/* Eyes */}
          <circle cx="37" cy="40" r="8" fill="#00d4ff" opacity="0.9"/>
          <circle cx="63" cy="40" r="8" fill="#00d4ff" opacity="0.9"/>
          <circle cx="37" cy="40" r="4" fill="#001a33"/>
          <circle cx="63" cy="40" r="4" fill="#001a33"/>
          {/* Eye glow */}
          <circle cx="37" cy="40" r="2" fill="white" opacity="0.8"/>
          <circle cx="63" cy="40" r="2" fill="white" opacity="0.8"/>
          {/* Mouth */}
          {speaking ? (
            <>
              <rect x="33" y="58" width="34" height="8" rx="4" fill="#00d4ff" opacity="0.9"/>
              <rect x="37" y="60" width="6" height="4" rx="1" fill="#001a33"/>
              <rect x="47" y="60" width="6" height="4" rx="1" fill="#001a33"/>
              <rect x="57" y="60" width="6" height="4" rx="1" fill="#001a33"/>
            </>
          ) : (
            <rect x="33" y="58" width="34" height="6" rx="3" fill="#00d4ff" opacity="0.6"/>
          )}
          {/* Antenna */}
          <line x1="50" y1="15" x2="50" y2="5" stroke="#00d4ff" strokeWidth="2"/>
          <circle cx="50" cy="4" r="3" fill="#00d4ff"/>
          {/* Ears */}
          <rect x="10" y="35" width="10" height="16" rx="4" fill="#0f3460" stroke="#00d4ff" strokeWidth="1.5"/>
          <rect x="80" y="35" width="10" height="16" rx="4" fill="#0f3460" stroke="#00d4ff" strokeWidth="1.5"/>
        </svg>

        {/* Speaking pulse ring */}
        {speaking && (
          <div style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "2px solid #00d4ff",
            animation: "pulse 1.2s ease-out infinite",
          }}/>
        )}
      </div>

      {/* Name */}
      <p style={{
        color: "#00d4ff",
        fontWeight: "600",
        fontSize: "14px",
        letterSpacing: "1px",
        margin: 0,
      }}>
        INTERVIEW BUDDY
      </p>

      {/* Status */}
      <div style={{
        background: speaking ? "#00d4ff22" : "#ffffff11",
        border: speaking ? "1px solid #00d4ff66" : "1px solid #ffffff22",
        borderRadius: "20px",
        padding: "4px 14px",
        fontSize: "12px",
        color: speaking ? "#00d4ff" : "#888",
        transition: "all 0.3s ease",
      }}>
        {speaking ? "● Speaking..." : "○ Waiting..."}
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default Avatar;