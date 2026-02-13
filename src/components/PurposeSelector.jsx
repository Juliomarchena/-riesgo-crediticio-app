import { purposeOptions } from "../constants/purposes";
import { styles } from "../styles/theme";

export default function PurposeSelector({ value, onChange }) {
  return (
    <div>
      <span style={styles.sectionLabel}>📌 Propósito del Préstamo</span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(155px, 1fr))", gap: "8px" }}>
        {purposeOptions.map((opt) => {
          const isActive = value === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              style={{
                padding: "10px 12px",
                background: isActive ? "rgba(96,165,250,0.12)" : "rgba(255,255,255,0.02)",
                border: `1px solid ${isActive ? "rgba(96,165,250,0.45)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: "10px",
                color: isActive ? "#93c5fd" : "rgba(255,255,255,0.45)",
                cursor: "pointer",
                fontSize: "12px",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                fontWeight: isActive ? 600 : 400,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.25s ease",
                boxShadow: isActive ? "0 0 15px rgba(96,165,250,0.08)" : "none",
              }}
            >
              <span style={{ fontSize: "15px" }}>{opt.icon}</span>
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
