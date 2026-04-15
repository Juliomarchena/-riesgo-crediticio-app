import * as XLSX from "xlsx";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// NOTA: El modelo binariza inq_last_6mths, delinq_2yrs y pub_rec (0 vs >0).
// Para Medio: prob_riesgo 30-70%. Para Alto: prob_riesgo >70%.
// Clave: int_rate muy alto (0.5+), fico muy bajo (300-400), log_annual_inc bajo (8-9).

const clientes = [
  // ── RIESGO BAJO (prob < 30%) ──────────────────────────────────────────────
  { credit_policy: 1, purpose: "debt_consolidation", int_rate: 0.0800, installment: 300.50, log_annual_inc: 11.80, dti: 12.5, fico: 780, days_with_cr_line: 6500, revol_bal: 15000, revol_util: 30.0, inq_last_6mths: 0, delinq_2yrs: 0, pub_rec: 0 },
  { credit_policy: 1, purpose: "credit_card",        int_rate: 0.0950, installment: 162.34, log_annual_inc: 11.35, dti: 16.3, fico: 760, days_with_cr_line: 5600, revol_bal: 12000, revol_util: 22.0, inq_last_6mths: 0, delinq_2yrs: 0, pub_rec: 0 },
  { credit_policy: 1, purpose: "home_improvement",   int_rate: 0.0850, installment: 215.00, log_annual_inc: 11.50, dti: 10.0, fico: 800, days_with_cr_line: 7000, revol_bal:  8000, revol_util: 15.0, inq_last_6mths: 0, delinq_2yrs: 0, pub_rec: 0 },
  { credit_policy: 1, purpose: "major_purchase",     int_rate: 0.1050, installment: 280.00, log_annual_inc: 11.20, dti: 14.0, fico: 740, days_with_cr_line: 5200, revol_bal:  9000, revol_util: 28.0, inq_last_6mths: 1, delinq_2yrs: 0, pub_rec: 0 },
  { credit_policy: 1, purpose: "educational",        int_rate: 0.1100, installment: 190.00, log_annual_inc: 10.90, dti: 13.5, fico: 725, days_with_cr_line: 4000, revol_bal:  5000, revol_util: 20.0, inq_last_6mths: 0, delinq_2yrs: 0, pub_rec: 0 },

  // ── RIESGO MEDIO (prob 30-70%) ────────────────────────────────────────────
  { credit_policy: 0, purpose: "debt_consolidation", int_rate: 0.2000, installment: 500.00, log_annual_inc: 10.20, dti: 38.0, fico: 620, days_with_cr_line: 2000, revol_bal: 30000, revol_util: 72.0, inq_last_6mths: 1, delinq_2yrs: 1, pub_rec: 1 },
  { credit_policy: 0, purpose: "small_business",     int_rate: 0.2200, installment: 580.00, log_annual_inc: 10.10, dti: 42.0, fico: 600, days_with_cr_line: 1800, revol_bal: 35000, revol_util: 78.0, inq_last_6mths: 1, delinq_2yrs: 1, pub_rec: 1 },
  { credit_policy: 0, purpose: "credit_card",        int_rate: 0.1900, installment: 460.00, log_annual_inc: 10.30, dti: 35.0, fico: 640, days_with_cr_line: 2200, revol_bal: 28000, revol_util: 68.0, inq_last_6mths: 1, delinq_2yrs: 1, pub_rec: 0 },
  { credit_policy: 0, purpose: "all_other",          int_rate: 0.2100, installment: 540.00, log_annual_inc: 10.00, dti: 40.0, fico: 610, days_with_cr_line: 1600, revol_bal: 32000, revol_util: 75.0, inq_last_6mths: 1, delinq_2yrs: 1, pub_rec: 1 },
  { credit_policy: 0, purpose: "home_improvement",   int_rate: 0.2300, installment: 620.00, log_annual_inc: 10.15, dti: 44.0, fico: 595, days_with_cr_line: 1500, revol_bal: 38000, revol_util: 80.0, inq_last_6mths: 1, delinq_2yrs: 1, pub_rec: 1 },

  // ── RIESGO ALTO (prob > 70%) — int_rate 0.5+, fico 300-400, inc muy bajo ──
  { credit_policy: 0, purpose: "debt_consolidation", int_rate: 0.5500, installment: 1200.0, log_annual_inc: 8.50, dti: 65.0, fico: 350, days_with_cr_line:  300, revol_bal: 80000, revol_util: 99.0, inq_last_6mths: 1, delinq_2yrs: 1, pub_rec: 1 },
  { credit_policy: 0, purpose: "small_business",     int_rate: 0.6000, installment: 1400.0, log_annual_inc: 8.20, dti: 70.0, fico: 320, days_with_cr_line:  200, revol_bal: 90000, revol_util: 99.0, inq_last_6mths: 1, delinq_2yrs: 1, pub_rec: 1 },
  { credit_policy: 0, purpose: "all_other",          int_rate: 0.7000, installment: 1600.0, log_annual_inc: 8.00, dti: 75.0, fico: 300, days_with_cr_line:  100, revol_bal: 95000, revol_util: 99.0, inq_last_6mths: 1, delinq_2yrs: 1, pub_rec: 1 },
  { credit_policy: 0, purpose: "credit_card",        int_rate: 0.5800, installment: 1300.0, log_annual_inc: 8.30, dti: 68.0, fico: 330, days_with_cr_line:  250, revol_bal: 85000, revol_util: 99.0, inq_last_6mths: 1, delinq_2yrs: 1, pub_rec: 1 },
  { credit_policy: 0, purpose: "debt_consolidation", int_rate: 0.6500, installment: 1500.0, log_annual_inc: 8.10, dti: 72.0, fico: 310, days_with_cr_line:  150, revol_bal: 92000, revol_util: 99.0, inq_last_6mths: 1, delinq_2yrs: 1, pub_rec: 1 },
];

const ws = XLSX.utils.json_to_sheet(clientes);

// Anchos de columna
ws["!cols"] = [
  { wch: 14 }, // credit_policy
  { wch: 20 }, // purpose
  { wch: 10 }, // int_rate
  { wch: 12 }, // installment
  { wch: 16 }, // log_annual_inc
  { wch: 8  }, // dti
  { wch: 8  }, // fico
  { wch: 18 }, // days_with_cr_line
  { wch: 12 }, // revol_bal
  { wch: 12 }, // revol_util
  { wch: 16 }, // inq_last_6mths
  { wch: 14 }, // delinq_2yrs
  { wch: 10 }, // pub_rec
];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, "Clientes");

const outputPath = path.join(__dirname, "clientes_prueba.xlsx");
XLSX.writeFile(wb, outputPath);
console.log(`Archivo generado: ${outputPath}`);
console.log(`Total de clientes: ${clientes.length}`);
console.log(" - Bajo riesgo:  5 clientes (filas 1-5)");
console.log(" - Medio riesgo: 5 clientes (filas 6-10)");
console.log(" - Alto riesgo:  5 clientes (filas 11-15)");
