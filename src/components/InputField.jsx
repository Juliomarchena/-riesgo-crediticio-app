import { useState } from "react";

export default function InputField({ label, name, value, onChange, type = "text", min, max, step, hint, icon, tooltip }) {
  const [focused, setFocused] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "12px",
          fontWeight: 700,
          color: focused ? "#f0d060" : "#e2b93b",
          textTransform: "uppercase",
          letterSpacing: "1px",
          marginBottom: "6px",
          transition: "color 0.3s",
          cursor: tooltip ? "help" : "default",
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <span style={{ fontSize: "14px" }}>{icon}</span>
        {label}
        {tooltip && <span style={{ fontSize: "12px", marginLeft: "4px", opacity: 0.7 }}>ℹ️</span>}
      </label>
      {showTooltip && tooltip && (
        <div style={{
          position: "absolute",
          top: "-8px",
          left: "0",
          transform: "translateY(-100%)",
          background: "rgba(30,40,60,0.97)",
          border: "1px solid #e2b93b",
          borderRadius: "10px",
          padding: "10px 14px",
          fontSize: "12px",
          color: "#fef3c7",
          lineHeight: 1.5,
          maxWidth: "300px",
          zIndex: 100,
          boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
          pointerEvents: "none",
        }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#e2b93b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
            📌 {label}
          </div>
          {tooltip}
          <div style={{
            position: "absolute",
            bottom: "-6px",
            left: "20px",
            width: "12px",
            height: "12px",
            background: "rgba(30,40,60,0.97)",
            border: "1px solid #e2b93b",
            borderTop: "none",
            borderLeft: "none",
            transform: "rotate(45deg)",
          }} />
        </div>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        min={min}
        max={max}
        step={step}
        style={{
          width: "100%",
          padding: "12px 14px",
          background: focused ? "rgba(226,185,59,0.06)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${focused ? "rgba(226,185,59,0.4)" : "rgba(255,255,255,0.08)"}`,
          borderRadius: "10px",
          color: "white",
          fontSize: "15px",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          outline: "none",
          transition: "all 0.3s ease",
          boxSizing: "border-box",
          boxShadow: focused ? "0 0 20px rgba(226,185,59,0.08)" : "none",
        }}
      />
      {hint && (
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", marginTop: "4px", display: "block" }}>
          {hint}
        </span>
      )}
    </div>
  );
}
