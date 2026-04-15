import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { predictRisk } from "../services/api";

const REQUIRED_COLUMNS = [
  "credit_policy", "purpose", "int_rate", "installment",
  "log_annual_inc", "dti", "fico", "days_with_cr_line",
  "revol_bal", "revol_util", "inq_last_6mths", "delinq_2yrs", "pub_rec",
];

export default function BatchProcessor() {
  const [rows, setRows] = useState([]);
  const [results, setResults] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError(null);
    setResults([]);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = XLSX.read(evt.target.result, { type: "binary" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(ws, { defval: "" });

        if (data.length === 0) {
          setError("El archivo esta vacio.");
          return;
        }

        // Verificar columnas requeridas
        const cols = Object.keys(data[0]).map((c) => c.toLowerCase().trim());
        const missing = REQUIRED_COLUMNS.filter((r) => !cols.includes(r));
        if (missing.length > 0) {
          setError(`Faltan columnas: ${missing.join(", ")}`);
          return;
        }

        // Normalizar nombres de columna
        const normalized = data.map((row) => {
          const n = {};
          Object.entries(row).forEach(([k, v]) => { n[k.toLowerCase().trim()] = v; });
          return n;
        });

        setRows(normalized);
      } catch {
        setError("No se pudo leer el archivo. Asegurate de que sea .xlsx o .xls");
      }
    };
    reader.readAsBinaryString(file);
  };

  const handleProcess = async () => {
    setProcessing(true);
    setProgress(0);
    setError(null);
    const processed = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        const payload = {
          credit_policy: Number(row.credit_policy),
          purpose: String(row.purpose),
          int_rate: Number(row.int_rate),
          installment: Number(row.installment),
          log_annual_inc: Number(row.log_annual_inc),
          dti: Number(row.dti),
          fico: Number(row.fico),
          days_with_cr_line: Number(row.days_with_cr_line),
          revol_bal: Number(row.revol_bal),
          revol_util: Number(row.revol_util),
          inq_last_6mths: Number(row.inq_last_6mths),
          delinq_2yrs: Number(row.delinq_2yrs),
          pub_rec: Number(row.pub_rec),
        };
        const res = await predictRisk(payload);
        processed.push({
          ...row,
          _nivel_riesgo: res.nivel_riesgo,
          _clasificacion: res.riesgo,
          _prob_incumplimiento: `${(res.probabilidad_riesgo * 100).toFixed(1)}%`,
          _prob_cumplimiento: `${(res.probabilidad_no_riesgo * 100).toFixed(1)}%`,
          _confianza: res.confianza,
          _recomendacion: res.recomendacion,
          _estado: "OK",
        });
      } catch (err) {
        processed.push({
          ...row,
          _nivel_riesgo: "ERROR",
          _clasificacion: "-",
          _prob_incumplimiento: "-",
          _prob_cumplimiento: "-",
          _confianza: "-",
          _recomendacion: err.message || "Error en prediccion",
          _estado: "ERROR",
        });
      }
      setProgress(Math.round(((i + 1) / rows.length) * 100));
    }

    setResults(processed);
    setProcessing(false);
  };

  const handleDownloadExcel = () => {
    const exportData = results.map((r, idx) => ({
      "N°": idx + 1,
      "Politica Crediticia": r.credit_policy === 1 || r.credit_policy === "1" ? "Cumple" : "No Cumple",
      "Proposito": r.purpose,
      "Tasa Interes": r.int_rate,
      "Cuota Mensual": r.installment,
      "Log Ingreso Anual": r.log_annual_inc,
      "DTI": r.dti,
      "FICO": r.fico,
      "Dias Linea Credito": r.days_with_cr_line,
      "Balance Revolving": r.revol_bal,
      "Util. Revolving": r.revol_util,
      "Consultas 6m": r.inq_last_6mths,
      "Morosidades 2a": r.delinq_2yrs,
      "Reg. Negativos": r.pub_rec,
      "NIVEL RIESGO": r._nivel_riesgo,
      "CLASIFICACION": r._clasificacion,
      "PROB. INCUMPLIMIENTO": r._prob_incumplimiento,
      "PROB. CUMPLIMIENTO": r._prob_cumplimiento,
      "CONFIANZA": r._confianza,
      "RECOMENDACION": r._recomendacion,
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);

    // Estilos de cabecera (ancho de columnas)
    ws["!cols"] = [
      { wch: 4 }, { wch: 18 }, { wch: 20 }, { wch: 12 }, { wch: 14 },
      { wch: 16 }, { wch: 10 }, { wch: 8 }, { wch: 18 }, { wch: 16 },
      { wch: 14 }, { wch: 12 }, { wch: 14 }, { wch: 14 },
      { wch: 14 }, { wch: 20 }, { wch: 20 }, { wch: 18 }, { wch: 12 }, { wch: 40 },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resultados");

    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const timestamp = new Date().toISOString().slice(0, 10);
    saveAs(blob, `Resultados_Riesgo_Crediticio_${timestamp}.xlsx`);
  };

  const riskColor = { Bajo: "#34d399", Medio: "#fbbf24", Alto: "#f87171", ERROR: "#a78bfa" };
  const okCount = results.filter((r) => r._nivel_riesgo !== "ERROR").length;
  const bajoCount = results.filter((r) => r._nivel_riesgo === "Bajo").length;
  const medioCount = results.filter((r) => r._nivel_riesgo === "Medio").length;
  const altoCount = results.filter((r) => r._nivel_riesgo === "Alto").length;

  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: "16px",
      padding: "28px",
      marginTop: "24px",
    }}>
      <div style={{ marginBottom: "20px" }}>
        <span style={{
          fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px",
          color: "#60a5fa", fontWeight: 600,
        }}>
          Evaluacion Masiva
        </span>
        <h3 style={{ color: "white", fontSize: "20px", fontWeight: 700, margin: "6px 0 4px" }}>
          Carga de Clientes por Excel
        </h3>
        <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "13px", margin: 0 }}>
          Sube un archivo .xlsx con multiples clientes y descarga los resultados
        </p>
      </div>

      {/* Columnas requeridas */}
      <div style={{
        background: "rgba(96,165,250,0.06)",
        border: "1px solid rgba(96,165,250,0.15)",
        borderRadius: "10px",
        padding: "12px 16px",
        marginBottom: "20px",
      }}>
        <p style={{ color: "#93c5fd", fontSize: "11px", fontWeight: 600, margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "1px" }}>
          Columnas requeridas en el Excel:
        </p>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", margin: 0, fontFamily: "monospace", lineHeight: 1.8 }}>
          {REQUIRED_COLUMNS.join("  |  ")}
        </p>
      </div>

      {/* Input archivo */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px", flexWrap: "wrap" }}>
        <input
          ref={fileRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFile}
          style={{ display: "none" }}
        />
        <button
          onClick={() => fileRef.current.click()}
          style={{
            padding: "10px 20px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "10px",
            color: "white",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "'Segoe UI', sans-serif",
          }}
        >
          📂 Seleccionar archivo Excel
        </button>
        {fileName && (
          <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
            {fileName} — <span style={{ color: "#34d399" }}>{rows.length} clientes</span>
          </span>
        )}
      </div>

      {error && (
        <div style={{
          padding: "12px 16px",
          background: "rgba(248,113,113,0.08)",
          border: "1px solid rgba(248,113,113,0.2)",
          borderRadius: "10px",
          color: "#fca5a5",
          fontSize: "13px",
          marginBottom: "16px",
        }}>
          ❌ {error}
        </div>
      )}

      {rows.length > 0 && results.length === 0 && (
        <button
          onClick={handleProcess}
          disabled={processing}
          style={{
            padding: "12px 28px",
            background: processing ? "rgba(96,165,250,0.2)" : "rgba(96,165,250,0.15)",
            border: "1px solid rgba(96,165,250,0.35)",
            borderRadius: "10px",
            color: "#93c5fd",
            fontSize: "14px",
            fontWeight: 700,
            cursor: processing ? "wait" : "pointer",
            fontFamily: "'Segoe UI', sans-serif",
            marginBottom: "16px",
          }}
        >
          {processing ? `⏳ Procesando... ${progress}%` : `🚀 Evaluar ${rows.length} clientes`}
        </button>
      )}

      {/* Barra de progreso */}
      {processing && (
        <div style={{
          width: "100%",
          height: "6px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "999px",
          marginBottom: "16px",
          overflow: "hidden",
        }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #60a5fa, #34d399)",
            borderRadius: "999px",
            transition: "width 0.3s",
          }} />
        </div>
      )}

      {/* Resumen de resultados */}
      {results.length > 0 && (
        <>
          <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
            {[
              { label: "Total", value: results.length, color: "#60a5fa" },
              { label: "Riesgo Bajo", value: bajoCount, color: "#34d399" },
              { label: "Riesgo Medio", value: medioCount, color: "#fbbf24" },
              { label: "Riesgo Alto", value: altoCount, color: "#f87171" },
            ].map((s) => (
              <div key={s.label} style={{
                flex: 1, minWidth: "80px",
                padding: "12px",
                background: "rgba(255,255,255,0.03)",
                border: `1px solid ${s.color}33`,
                borderRadius: "10px",
                textAlign: "center",
              }}>
                <div style={{ fontSize: "22px", fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginTop: "2px" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <button
            onClick={handleDownloadExcel}
            style={{
              padding: "12px 28px",
              background: "rgba(52,211,153,0.12)",
              border: "1px solid rgba(52,211,153,0.3)",
              borderRadius: "10px",
              color: "#6ee7b7",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              fontFamily: "'Segoe UI', sans-serif",
              marginBottom: "20px",
            }}
          >
            ⬇️ Descargar Resultados Excel ({okCount}/{results.length})
          </button>

          {/* Tabla preview */}
          <div style={{ overflowX: "auto", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.07)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.06)" }}>
                  {["N°", "FICO", "DTI", "Tasa", "Proposito", "Nivel Riesgo", "Prob. Incump.", "Confianza"].map((h) => (
                    <th key={h} style={{ padding: "10px 12px", color: "rgba(255,255,255,0.5)", textAlign: "left", fontWeight: 600, whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.slice(0, 20).map((r, i) => (
                  <tr key={i} style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.3)" }}>{i + 1}</td>
                    <td style={{ padding: "8px 12px", color: "white" }}>{r.fico}</td>
                    <td style={{ padding: "8px 12px", color: "white" }}>{r.dti}</td>
                    <td style={{ padding: "8px 12px", color: "white" }}>{r.int_rate}</td>
                    <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.6)", maxWidth: "120px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.purpose}</td>
                    <td style={{ padding: "8px 12px" }}>
                      <span style={{
                        padding: "3px 10px",
                        borderRadius: "999px",
                        background: `${riskColor[r._nivel_riesgo] || "#888"}22`,
                        color: riskColor[r._nivel_riesgo] || "#888",
                        fontWeight: 600,
                        fontSize: "11px",
                      }}>
                        {r._nivel_riesgo}
                      </span>
                    </td>
                    <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.7)" }}>{r._prob_incumplimiento}</td>
                    <td style={{ padding: "8px 12px", color: "rgba(255,255,255,0.7)" }}>{r._confianza}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {results.length > 20 && (
              <p style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", fontSize: "12px", padding: "10px" }}>
                Mostrando 20 de {results.length} registros. Descarga el Excel para ver todos.
              </p>
            )}
          </div>

          <button
            onClick={() => { setRows([]); setResults([]); setFileName(null); setProgress(0); fileRef.current.value = ""; }}
            style={{
              marginTop: "14px",
              padding: "8px 18px",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: "8px",
              color: "rgba(255,255,255,0.4)",
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "'Segoe UI', sans-serif",
            }}
          >
            🔄 Nueva carga
          </button>
        </>
      )}
    </div>
  );
}
