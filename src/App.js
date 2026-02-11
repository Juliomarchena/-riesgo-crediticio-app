import React, { useState, useEffect } from "react";

// ============================================
// CONFIGURACIÓN - Cambia estos valores si es necesario
// ============================================
const API_URL = "https://web-production-c1189.up.railway.app";
const API_KEY = "mi-clave-super-secreta-2026";

// ============================================
// DATOS DE PROPÓSITOS DE PRÉSTAMO
// ============================================
const purposeOptions = [
  { value: "debt_consolidation", label: "Consolidación de Deuda", icon: "📋" },
  { value: "credit_card", label: "Tarjeta de Crédito", icon: "💳" },
  { value: "home_improvement", label: "Mejora del Hogar", icon: "🏠" },
  { value: "major_purchase", label: "Compra Mayor", icon: "🛒" },
  { value: "small_business", label: "Pequeño Negocio", icon: "🏢" },
  { value: "educational", label: "Educativo", icon: "🎓" },
  { value: "all_other", label: "Otro", icon: "📄" },
];

// ============================================
// ESTILOS CSS EN JAVASCRIPT
// ============================================
const styles = {
  // ---- Layout principal ----
  pageContainer: {
    minHeight: "100vh",
    background: "#0a0e1a",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    color: "white",
    position: "relative",
    overflow: "hidden",
  },
  backgroundOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: `
      radial-gradient(ellipse 800px 600px at 20% 20%, rgba(59,130,246,0.07) 0%, transparent 60%),
      radial-gradient(ellipse 600px 400px at 80% 80%, rgba(139,92,246,0.05) 0%, transparent 60%),
      radial-gradient(ellipse 400px 300px at 50% 50%, rgba(6,182,212,0.03) 0%, transparent 60%)
    `,
    pointerEvents: "none",
  },
  gridPattern: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
    `,
    backgroundSize: "60px 60px",
    pointerEvents: "none",
  },

  // ---- Barra superior ----
  topBar: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    background: "rgba(10,14,26,0.85)",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    padding: "14px 32px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoBox: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },
  logoTitle: {
    fontSize: "16px",
    fontWeight: 700,
    margin: 0,
    letterSpacing: "-0.3px",
  },
  logoSubtitle: {
    fontSize: "10px",
    color: "rgba(255,255,255,0.3)",
    margin: 0,
    letterSpacing: "1px",
    textTransform: "uppercase",
  },

  // ---- Contenido principal ----
  mainContent: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 24px 60px",
  },

  // ---- Secciones del formulario ----
  card: {
    background: "rgba(255,255,255,0.02)",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.06)",
    padding: "24px",
    marginBottom: "16px",
  },
  sectionLabel: {
    display: "block",
    fontSize: "12px",
    fontWeight: 700,
    color: "#e2b93b",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
    marginBottom: "16px",
  },

  // ---- Botón principal ----
  submitButton: {
    width: "100%",
    padding: "18px",
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)",
    border: "none",
    borderRadius: "14px",
    color: "white",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    letterSpacing: "0.5px",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 24px rgba(59,130,246,0.25)",
  },
  submitButtonLoading: {
    width: "100%",
    padding: "18px",
    background: "rgba(96,165,250,0.15)",
    border: "1px solid rgba(96,165,250,0.2)",
    borderRadius: "14px",
    color: "white",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "wait",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    boxShadow: "none",
  },

  // ---- Grid de inputs ----
  inputGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "18px",
  },

  // ---- Footer ----
  footer: {
    textAlign: "center",
    marginTop: "48px",
    paddingTop: "24px",
    borderTop: "1px solid rgba(255,255,255,0.04)",
  },
};

// ============================================
// COMPONENTE: Campo de entrada
// ============================================
function InputField({ label, name, value, onChange, type = "text", min, max, step, hint, icon, tooltip }) {
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
      {/* Tooltip / Banderita */}
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
          {/* Flechita */}
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

// ============================================
// COMPONENTE: Selector de propósito
// ============================================
function PurposeSelector({ value, onChange }) {
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

// ============================================
// COMPONENTE: Gauge semicircular
// ============================================
function GaugeChart({ value, label, color }) {
  const radius = 58;
  const circumference = Math.PI * radius;
  const progress = (value / 100) * circumference;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
      <svg width="140" height="80" viewBox="0 0 140 80">
        <defs>
          <linearGradient id={`gauge-${label.replace(/\s/g, "")}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} />
          </linearGradient>
        </defs>
        {/* Fondo del arco */}
        <path
          d="M 12 70 A 58 58 0 0 1 128 70"
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="8"
          strokeLinecap="round"
        />
        {/* Arco de progreso */}
        <path
          d="M 12 70 A 58 58 0 0 1 128 70"
          fill="none"
          stroke={`url(#gauge-${label.replace(/\s/g, "")})`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${progress} ${circumference}`}
          style={{ transition: "stroke-dasharray 1.5s cubic-bezier(0.4, 0, 0.2, 1)" }}
        />
        {/* Texto del porcentaje */}
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

// ============================================
// COMPONENTE: Panel de resultados
// ============================================
function ResultPanel({ result, onReset }) {
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
      {/* Icono y título */}
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

      {/* Gauges */}
      <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginBottom: "32px", flexWrap: "wrap" }}>
        <GaugeChart value={result.probabilidad_no_riesgo} label="No Riesgoso" color="#34d399" />
        <GaugeChart value={result.probabilidad_riesgo} label="Riesgoso" color="#f87171" />
      </div>

      {/* Confianza */}
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

      {/* Recomendación */}
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

      {/* Datos procesados */}
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

      {/* Botón nueva evaluación */}
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

// ============================================
// COMPONENTE PRINCIPAL: App
// ============================================
function App() {
  // Estado del formulario con datos de ejemplo precargados
  const [formData, setFormData] = useState({
    credit_policy: 1,
    purpose: "debt_consolidation",
    int_rate: 0.1357,
    installment: 366.86,
    log_annual_inc: 11.35,
    dti: 19.48,
    fico: 737,
    days_with_cr_line: 5639.96,
    revol_bal: 28854,
    revol_util: 52.1,
    inq_last_6mths: 1,
    delinq_2yrs: 0,
    pub_rec: 0,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState("checking");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Reloj en tiempo real y verificación de API al iniciar
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    checkApiHealth();
    return () => clearInterval(timer);
  }, []);

  // Verificar si la API está activa
  const checkApiHealth = async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      const data = await response.json();
      setApiStatus(data.status === "healthy" ? "online" : "offline");
    } catch (err) {
      setApiStatus("offline");
    }
  };

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  // Enviar datos a la API para predicción
  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": API_KEY,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.mensaje || "Error en la predicción");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos de prueba
  const loadTestData = () => {
    setFormData({
      credit_policy: 1,
      purpose: "debt_consolidation",
      int_rate: 0.1357,
      installment: 366.86,
      log_annual_inc: 11.35,
      dti: 19.48,
      fico: 737,
      days_with_cr_line: 5639.96,
      revol_bal: 28854,
      revol_util: 52.1,
      inq_last_6mths: 1,
      delinq_2yrs: 0,
      pub_rec: 0,
    });
  };

  // ============================================
  // RENDER
  // ============================================
  return (
    <div style={styles.pageContainer}>
      {/* Efectos de fondo */}
      <div style={styles.backgroundOverlay} />
      <div style={styles.gridPattern} />

      {/* ====== BARRA SUPERIOR ====== */}
      <div style={styles.topBar}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={styles.logoBox}>🏦</div>
          <div>
            <h1 style={styles.logoTitle}>
              Credit Risk <span style={{ color: "#60a5fa" }}>AI</span>
            </h1>
            <p style={styles.logoSubtitle}>Sistema de Evaluación Crediticia</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", fontVariantNumeric: "tabular-nums" }}>
            {currentTime.toLocaleTimeString("es-PE")}
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: apiStatus === "online" ? "#34d399" : apiStatus === "offline" ? "#f87171" : "#fbbf24",
              boxShadow: apiStatus === "online" ? "0 0 8px rgba(52,211,153,0.5)" : "none",
            }} />
            <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontWeight: 500 }}>
              {apiStatus === "online" ? "API Online" : apiStatus === "offline" ? "API Offline" : "Verificando..."}
            </span>
          </div>
        </div>
      </div>

      {/* ====== CONTENIDO PRINCIPAL ====== */}
      <div style={styles.mainContent}>

        {/* Título hero */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{
            fontSize: "11px",
            textTransform: "uppercase",
            letterSpacing: "3px",
            color: "#60a5fa",
            marginBottom: "12px",
            fontWeight: 600,
          }}>
            Machine Learning · Clasificación Binaria
          </p>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 42px)",
            fontWeight: 800,
            lineHeight: 1.15,
            margin: "0 0 12px",
            color: "white",
          }}>
            Evaluación de Riesgo<br />Crediticio
          </h2>
          <p style={{
            fontSize: "15px",
            color: "rgba(255,255,255,0.35)",
            maxWidth: "500px",
            margin: "0 auto",
            lineHeight: 1.6,
          }}>
            Modelo predictivo con 19 características para evaluar
            la probabilidad de incumplimiento de pago
          </p>
        </div>

        {/* ====== RESULTADO O FORMULARIO ====== */}
        {result ? (
          <ResultPanel result={result} onReset={() => setResult(null)} />
        ) : (
          <div>
            {/* Botones de acción rápida */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "24px", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={loadTestData}
                style={{
                  padding: "8px 18px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontFamily: "'Segoe UI', sans-serif",
                  fontWeight: 500,
                  transition: "all 0.2s",
                }}
              >
                🧪 Cargar Datos de Prueba
              </button>
              <button
                onClick={checkApiHealth}
                style={{
                  padding: "8px 18px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "8px",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: "12px",
                  cursor: "pointer",
                  fontFamily: "'Segoe UI', sans-serif",
                  fontWeight: 500,
                  transition: "all 0.2s",
                }}
              >
                🔄 Verificar API
              </button>
            </div>

            {/* SECCIÓN 1: Propósito del préstamo */}
            <div style={styles.card}>
              <PurposeSelector
                value={formData.purpose}
                onChange={(val) => setFormData((prev) => ({ ...prev, purpose: val }))}
              />
            </div>

            {/* SECCIÓN 2: Política crediticia */}
            <div style={styles.card}>
              <span style={styles.sectionLabel}>🏛️ Política Crediticia</span>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {[
                  { value: 1, label: "Cumple Criterios", desc: "El cliente cumple con la política de suscripción" },
                  { value: 0, label: "No Cumple", desc: "El cliente no cumple con la política de suscripción" },
                ].map((opt) => {
                  const isActive = formData.credit_policy === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setFormData((prev) => ({ ...prev, credit_policy: opt.value }))}
                      style={{
                        flex: 1,
                        minWidth: "200px",
                        padding: "14px 16px",
                        background: isActive ? "rgba(96,165,250,0.1)" : "rgba(255,255,255,0.02)",
                        border: `1px solid ${isActive ? "rgba(96,165,250,0.4)" : "rgba(255,255,255,0.06)"}`,
                        borderRadius: "10px",
                        color: isActive ? "#93c5fd" : "rgba(255,255,255,0.5)",
                        cursor: "pointer",
                        fontFamily: "'Segoe UI', sans-serif",
                        textAlign: "left",
                        transition: "all 0.25s",
                      }}
                    >
                      <div style={{ fontSize: "14px", fontWeight: 600 }}>{opt.label}</div>
                      <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "4px" }}>{opt.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* SECCIÓN 3: Campos financieros */}
            <div style={styles.card}>
              <span style={styles.sectionLabel}>📊 Información Financiera del Cliente</span>
              <div style={styles.inputGrid}>
                <InputField label="Puntaje FICO" name="fico" value={formData.fico} onChange={handleChange} type="number" min={300} max={850} hint="Rango: 300 - 850" icon="📈" tooltip="Calificación de riesgo crediticio del cliente. 737 sugiere bajo riesgo crediticio. Rango: 300 (malo) a 850 (excelente)." />
                <InputField label="Tasa de Interés" name="int_rate" value={formData.int_rate} onChange={handleChange} type="number" step={0.0001} min={0} max={1} hint="Decimal entre 0 y 1 (ej: 0.1357)" icon="💰" tooltip="Tasa de interés anual del préstamo en decimal. Ejemplo: 0.1357 equivale a una tasa de 13.57% anual." />
                <InputField label="Cuota Mensual ($)" name="installment" value={formData.installment} onChange={handleChange} type="number" step={0.01} hint="Monto de la cuota mensual" icon="📅" tooltip="Monto mensual a pagar por el préstamo. Ejemplo: 366.86 significa que el cliente paga $366.86 al mes." />
                <InputField label="Log Ingreso Anual" name="log_annual_inc" value={formData.log_annual_inc} onChange={handleChange} type="number" step={0.01} hint="Logaritmo natural del ingreso" icon="🏷️" tooltip="Logaritmo natural del ingreso anual del cliente. Ejemplo: 11.35 implica un ingreso anual ≈ $85,000." />
                <InputField label="Ratio Deuda/Ingreso" name="dti" value={formData.dti} onChange={handleChange} type="number" step={0.01} hint="DTI del cliente" icon="⚖️" tooltip="Relación deuda-ingreso mensual (% del ingreso comprometido con deudas). Ejemplo: 19.48% del ingreso mensual se usa para pagar deudas." />
                <InputField label="Días con Línea de Crédito" name="days_with_cr_line" value={formData.days_with_cr_line} onChange={handleChange} type="number" step={0.01} hint="Antigüedad de crédito en días" icon="📆" tooltip="Días desde que el cliente abrió su primera línea de crédito. Ejemplo: 5639.96 días ≈ 15.4 años de historial de crédito." />
                <InputField label="Balance Revolving ($)" name="revol_bal" value={formData.revol_bal} onChange={handleChange} type="number" hint="Saldo de crédito revolving" icon="🔄" tooltip="Monto de deuda rotativa (tarjetas de crédito, etc.). Ejemplo: $28,854 en deuda rotativa." />
                <InputField label="Utilización Revolving (%)" name="revol_util" value={formData.revol_util} onChange={handleChange} type="number" step={0.01} hint="Porcentaje de utilización" icon="📊" tooltip="Porcentaje de utilización del crédito rotativo disponible. Ejemplo: 52.1% del crédito disponible ha sido utilizado." />
                <InputField label="Consultas últimos 6 meses" name="inq_last_6mths" value={formData.inq_last_6mths} onChange={handleChange} type="number" min={0} hint="Número de consultas crediticias" icon="🔍" tooltip="Consultas duras de crédito en los últimos 6 meses. Ejemplo: 1 = una solicitud de crédito reciente." />
                <InputField label="Morosidades (2 años)" name="delinq_2yrs" value={formData.delinq_2yrs} onChange={handleChange} type="number" min={0} hint="Eventos de mora en 2 años" icon="⚠️" tooltip="Número de moras (>30 días) en los últimos 2 años. 0 = no ha tenido moras recientes." />
                <InputField label="Registros Públicos Neg." name="pub_rec" value={formData.pub_rec} onChange={handleChange} type="number" min={0} hint="Registros públicos negativos" icon="📋" tooltip="Número de registros públicos negativos (quiebra, juicio, etc.). 0 = sin registros negativos como quiebras." />
              </div>
            </div>

            {/* Mensaje de error */}
            {error && (
              <div style={{
                padding: "14px 20px",
                background: "rgba(248,113,113,0.08)",
                borderRadius: "12px",
                border: "1px solid rgba(248,113,113,0.2)",
                color: "#fca5a5",
                fontSize: "14px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}>
                <span>❌</span> {error}
              </div>
            )}

            {/* Botón EVALUAR */}
            <button
              onClick={handleSubmit}
              disabled={loading || apiStatus === "offline"}
              style={{
                ...(loading ? styles.submitButtonLoading : styles.submitButton),
                opacity: apiStatus === "offline" ? 0.4 : 1,
              }}
            >
              {loading ? "⏳ Analizando..." : "🔮 Evaluar Riesgo Crediticio"}
            </button>

            {apiStatus === "offline" && (
              <p style={{ textAlign: "center", color: "rgba(248,113,113,0.7)", fontSize: "12px", marginTop: "10px" }}>
                La API no está disponible. Verifica que el servicio esté activo en Railway.
              </p>
            )}
          </div>
        )}

        {/* ====== FOOTER ====== */}
        <div style={styles.footer}>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
            Credit Risk AI v2.0 · Modelo ML con 19 características · Desarrollado por Julius
          </p>
          <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.1)", marginTop: "4px" }}>
            API: {API_URL}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
