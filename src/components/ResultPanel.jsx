import { useState } from "react";
import GaugeChart from "./GaugeChart";
import { styles } from "../styles/theme";
import { generateWordReport } from "../services/generateWordReport";

const purposeLabels = {
  debt_consolidation: "Consolidación de Deuda",
  credit_card: "Tarjeta de Crédito",
  home_improvement: "Mejora del Hogar",
  major_purchase: "Compra Mayor",
  small_business: "Pequeño Negocio",
  educational: "Educativo",
  all_other: "Otro",
};

export default function ResultPanel({ result, formData, onReset }) {
  const [generatingWord, setGeneratingWord] = useState(false);

  const handleDownloadWord = async () => {
    setGeneratingWord(true);
    try {
      await generateWordReport(result, formData);
    } finally {
      setGeneratingWord(false);
    }
  };
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
          Datos del Cliente Evaluados
        </h4>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px 12px", background: "rgba(96,165,250,0.12)", color: "rgba(255,255,255,0.5)", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", borderRadius: "6px 0 0 6px" }}>Variable</th>
              <th style={{ textAlign: "left", padding: "8px 12px", background: "rgba(96,165,250,0.12)", color: "rgba(255,255,255,0.5)", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", borderRadius: "0 6px 6px 0" }}>Valor</th>
            </tr>
          </thead>
          <tbody>
            {[
              { label: "Política Crediticia", value: (formData?.credit_policy ?? result.datos_recibidos?.credit_policy) == 1 ? "Cumple Criterios" : "No Cumple" },
              { label: "Propósito del Préstamo", value: purposeLabels[result.datos_recibidos?.purpose] || result.datos_recibidos?.purpose || "-" },
              { label: "Tasa de Interés Anual", value: result.datos_recibidos?.int_rate ? `${(result.datos_recibidos.int_rate * 100).toFixed(2)}%` : "-" },
              { label: "Cuota Mensual", value: formData?.installment ? `$${Number(formData.installment).toFixed(2)}` : "-" },
              { label: "Ingreso Anual Aprox.", value: formData?.log_annual_inc ? `$${Math.round(Math.exp(formData.log_annual_inc)).toLocaleString("es-PE")}` : "-" },
              { label: "Puntaje FICO", value: result.datos_recibidos?.fico ?? "-" },
              { label: "Ratio Deuda/Ingreso (DTI)", value: result.datos_recibidos?.dti ?? "-" },
              { label: "Días con Línea de Crédito", value: formData?.days_with_cr_line ?? "-" },
              { label: "Balance Revolving", value: formData?.revol_bal ? `$${Number(formData.revol_bal).toLocaleString("es-PE")}` : "-" },
              { label: "Utilización Revolving", value: formData?.revol_util != null ? `${formData.revol_util}%` : "-" },
              { label: "Consultas últimos 6 meses", value: formData?.inq_last_6mths ?? "-" },
              { label: "Morosidades (2 años)", value: formData?.delinq_2yrs ?? "-" },
              { label: "Registros Públicos Neg.", value: formData?.pub_rec ?? "-" },
            ].map((item, i) => (
              <tr key={item.label} style={{ background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.55)", fontWeight: 500, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{item.label}</td>
                <td style={{ padding: "8px 12px", color: "white", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>{String(item.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
        <button
          onClick={handleDownloadWord}
          disabled={generatingWord}
          style={{
            width: "100%",
            padding: "14px",
            background: generatingWord ? "rgba(37,99,235,0.3)" : "rgba(37,99,235,0.15)",
            border: "1px solid rgba(96,165,250,0.3)",
            borderRadius: "12px",
            color: "#93c5fd",
            fontSize: "14px",
            fontWeight: 600,
            cursor: generatingWord ? "wait" : "pointer",
            fontFamily: "'Segoe UI', sans-serif",
            transition: "all 0.2s",
          }}
        >
          {generatingWord ? "⏳ Generando informe..." : "📄 Descargar Informe Word"}
        </button>
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
            fontFamily: "'Segoe UI', sans-serif",
            transition: "all 0.3s",
          }}
        >
          ← Nueva Evaluación
        </button>
      </div>
    </div>
  );
}
