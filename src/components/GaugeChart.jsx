export default function GaugeChart({ value, label, color }) {
  const radius = 58;
  const circumference = Math.PI * radius;
  const progress = (value / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
      <svg width="140" height="80" viewBox="0 0 140 80">
        <defs>
          <linearGradient id={`gauge-${label.replace(/\\s/g, "")}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        <path
          d="M 12 70 A 58 58 0 0 1 128 70"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M 12 70 A 58 58 0 0 1 128 70"
          fill="none"
          stroke={`url(#gauge-${label.replace(/\\s/g, "")})`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{ transition: "stroke-dasharray 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
        <text
          x="70" y="58"
          textAnchor="middle"
          fill="white"
          fontSize="22"
          fontWeight="700"
          fontFamily="'Segoe UI', sans-serif"
        >
          {value.toFixed(1)}%
        </text>
      </svg>
      <span style={{
        fontSize: "11px",
        color: "rgba(255,255,255,0.45)",
        textTransform: "uppercase",
        letterSpacing: "1.5px",
        fontWeight: 600,
      }}>
        {label}
      </span>
    </div>
  );
}
