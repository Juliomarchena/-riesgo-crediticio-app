import GaugeChart from "./GaugeChart";
import { styles } from "../styles/theme";

export default function ResultPanel({ result, onReset }) {
  if (!result) return null;

  const riskConfig = {
    Bajo: { color: "#34d399", icon: "✅", bg: "rgba(52,211,153,0.08)" },
    Medio: { color: "#fbbf24", icon: "⚠️", bg: "rgba(251,191,36,0.08)" },
    Alto: { color: "#f87171", icon: "🚨", bg: "rgba(248,113,113,0.08)" },
  };

  const cfg = riskConfig[result.nivel_riesgo] || riskConfig.Medio;

  return (
    <div style={{
      ...styles.card,
      border: `1px solid ${cfg.color}22`,
      padding: "36px",
    }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: cfg.bg,
          border: `2px solid ${cfg.color}44`,
          marginBottom: "16px",
        }}>
          <span style={{ fontSize: "32px" }}>{cfg.icon}</span>
        </div>
        <h2 style={{
          fontSize: "28px",
          fontWeight: 700,
          color: cfg.color,
          margin: "0 0 4px",
        }}>
          Riesgo {result.nivel_riesgo}
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", margin: 0 }}>
          {result.riesgo}
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginBottom: "32px", flexWrap: "wrap" }}>
        <GaugeChart value={result.probabilidad_no_riesgo} label="No Riesgoso" color="#34d399" />
        <GaugeChart value={result.probabilidad_riesgo} label="Riesgoso" color="#f87171" />
      </div>

      <div style={{
        textAlign: "center",
        padding: "14px",
        background: "rgba(255,255,255,0.03)",
        borderRadius: "12px",
        marginBottom: "24px",
        border: "1px solid rgba(255,255,255,0.05)",
      }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
          Confianza del Modelo
        </span>
        <div style={{ fontSize: "24px", fontWeight: 700, color: "white", marginTop: "4px" }}>
          {result.confianza}
        </div>
      </div>

      <div style={{
        padding: "16px 20px",
        background: cfg.bg,
        borderRadius: "12px",
        borderLeft: `3px solid ${cfg.color}`,
        marginBottom: "28px",
      }}>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", margin: 0, lineHeight: 1.6 }}>
          {result.recomendacion}
        </p>
      </div>

      <div style={{ marginBottom: "28px" }}>
        <h4 style={{
          fontSize: "11px",
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase",
          letterSpacing: "1.5px",
          marginBottom: "12px",
        }}>
          Datos Procesados
        </h4>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "8px" }}>
          {[
            { label: "FICO", value: result.datos_recibidos.fico },
            { label: "Tasa", value: `${(result.datos_recibidos.int_rate * 100).toFixed(2)}%` },
            { label: "DTI", value: result.datos_recibidos.dti },
            { label: "Propósito", value: result.datos_recibidos.purpose.replace(/_/g, " ") },
          ].map((item) => (
            <div key={item.label} style={{
              padding: "10px 14px",
              background: "rgba(255,255,255,0.02)",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.05)",
            }}>
              <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", textTransform: "uppercase", letterSpacing: "1px" }}>
                {item.label}
              </div>
              <div style={{ fontSize: "15px", color: "white", fontWeight: 600, marginTop: "2px", textTransform: "capitalize" }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={onReset}
        style={{
          width: "100%",
          padding: "14px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "12px",
          color: "rgba(255,255,255,0.7)",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          transition: "all 0.3s",
        }}
      >
        ← Nueva Evaluación
      </button>
    </div>
  );
}
