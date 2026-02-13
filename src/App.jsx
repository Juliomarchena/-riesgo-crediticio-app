import { useState, useEffect } from "react";
import InputField from "./components/InputField";
import PurposeSelector from "./components/PurposeSelector";
import ResultPanel from "./components/ResultPanel";
import { styles } from "./styles/theme";
import { defaultFormData } from "./constants/purposes";
import { checkApiHealth as fetchApiHealth, predictRisk, API_URL } from "./services/api";

function App() {
  const [formData, setFormData] = useState({ ...defaultFormData });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiStatus, setApiStatus] = useState("checking");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    checkApiHealth();
    return () => clearInterval(timer);
  }, []);

  const checkApiHealth = async () => {
    const status = await fetchApiHealth();
    setApiStatus(status);
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await predictRisk(formData);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadTestData = () => {
    setFormData({ ...defaultFormData });
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.backgroundOverlay} />
      <div style={styles.gridPattern} />

      {/* Barra superior */}
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

      {/* Contenido principal */}
      <div style={styles.mainContent}>
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

            {/* Propósito del préstamo */}
            <div style={styles.card}>
              <PurposeSelector
                value={formData.purpose}
                onChange={(val) => setFormData((prev) => ({ ...prev, purpose: val }))}
              />
            </div>

            {/* Política crediticia */}
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

            {/* Campos financieros */}
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

            {/* Botón evaluar */}
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

        {/* Footer */}
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
