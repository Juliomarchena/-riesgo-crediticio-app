import * as XLSX from "xlsx";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const clientes = [
  // Riesgo BAJO (buen perfil)
  { credit_policy: 1, purpose: "debt_consolidation", int_rate: 0.1189, installment: 366.86, log_annual_inc: 11.35, dti: 19.48, fico: 737, days_with_cr_line: 5639.96, revol_bal: 28854, revol_util: 52.1, inq_last_6mths: 1, delinq_2yrs: 0, pub_rec: 0 },
  { credit_policy: 1, purpose: "credit_card",         int_rate: 0.1008, installment: 162.34, log_annual_inc: 11.08, dti: 16.29, fico: 742, days_with_cr_line: 4200.00, revol_bal: 15000, revol_util: 30.5, inq_last_6mths: 0, delinq_2yrs: 0, pub_rec: 0 },
  { credit_policy: 1, purpose: "home_improvement",    int_rate: 0.0900, installment: 215.00, log_annual_inc: 11.50, dti: 10.00, fico: 780, days_with_cr_line: 6500.00, revol_bal: 10000, revol_util: 18.0, inq_last_6mths: 0, delinq_2yrs: 0, pub_rec: 0 },
  { credit_policy: 1, purpose: "major_purchase",      int_rate: 0.0950, installment: 300.00, log_annual_inc: 11.20, dti: 12.50, fico: 760, days_with_cr_line: 5800.00, revol_bal: 8000,  revol_util: 22.0, inq_last_6mths: 1, delinq_2yrs: 0, pub_rec: 0 },
  { credit_policy: 1, purpose: "educational",         int_rate: 0.1050, installment: 180.50, log_annual_inc: 10.90, dti: 14.00, fico: 715, days_with_cr_line: 3650.00, revol_bal: 5000,  revol_util: 25.0, inq_last_6mths: 0, delinq_2yrs: 0, pub_rec: 0 },

  // Riesgo MEDIO (perfil intermedio)
  { credit_policy: 1, purpose: "debt_consolidation", int_rate: 0.1357, installment: 450.00, log_annual_inc: 10.80, dti: 28.50, fico: 680, days_with_cr_line: 3200.00, revol_bal: 22000, revol_util: 55.0, inq_last_6mths: 2, delinq_2yrs: 0, pub_rec: 0 },
  { credit_policy: 1, purpose: "small_business",      int_rate: 0.1500, installment: 520.00, log_annual_inc: 10.70, dti: 32.00, fico: 660, days_with_cr_line: 2900.00, revol_bal: 18000, revol_util: 62.0, inq_last_6mths: 3, delinq_2yrs: 1, pub_rec: 0 },
  { credit_policy: 1, purpose: "credit_card",         int_rate: 0.1299, installment: 380.00, log_annual_inc: 10.60, dti: 25.00, fico: 695, days_with_cr_line: 4100.00, revol_bal: 20000, revol_util: 48.0, inq_last_6mths: 2, delinq_2yrs: 0, pub_rec: 0 },
  { credit_policy: 0, purpose: "home_improvement",    int_rate: 0.1450, installment: 410.00, log_annual_inc: 10.90, dti: 30.00, fico: 670, days_with_cr_line: 3500.00, revol_bal: 25000, revol_util: 58.0, inq_last_6mths: 1, delinq_2yrs: 1, pub_rec: 0 },
  { credit_policy: 1, purpose: "major_purchase",      int_rate: 0.1380, installment: 295.00, log_annual_inc: 10.50, dti: 27.00, fico: 688, days_with_cr_line: 2800.00, revol_bal: 12000, revol_util: 44.0, inq_last_6mths: 2, delinq_2yrs: 0, pub_rec: 0 },

  // Riesgo ALTO (mal perfil)
  { credit_policy: 0, purpose: "debt_consolidation", int_rate: 0.1990, installment: 650.00, log_annual_inc: 10.20, dti: 45.00, fico: 590, days_with_cr_line: 1800.00, revol_bal: 35000, revol_util: 82.0, inq_last_6mths: 5, delinq_2yrs: 3, pub_rec: 1 },
  { credit_policy: 0, purpose: "small_business",      int_rate: 0.2100, installment: 720.00, log_annual_inc: 10.00, dti: 48.00, fico: 560, days_with_cr_line: 1500.00, revol_bal: 40000, revol_util: 90.0, inq_last_6mths: 6, delinq_2yrs: 4, pub_rec: 2 },
  { credit_policy: 0, purpose: "all_other",           int_rate: 0.2200, installment: 580.00, log_annual_inc: 10.10, dti: 50.00, fico: 545, days_with_cr_line: 1200.00, revol_bal: 32000, revol_util: 88.0, inq_last_6mths: 7, delinq_2yrs: 5, pub_rec: 1 },
  { credit_policy: 0, purpose: "credit_card",         int_rate: 0.1950, installment: 500.00, log_annual_inc: 10.30, dti: 43.00, fico: 610, days_with_cr_line: 2000.00, revol_bal: 28000, revol_util: 78.0, inq_last_6mths: 4, delinq_2yrs: 2, pub_rec: 1 },
  { credit_policy: 0, purpose: "debt_consolidation", int_rate: 0.2050, installment: 690.00, log_annual_inc: 9.90,  dti: 52.00, fico: 530, days_with_cr_line: 1100.00, revol_bal: 45000, revol_util: 95.0, inq_last_6mths: 8, delinq_2yrs: 6, pub_rec: 2 },
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
