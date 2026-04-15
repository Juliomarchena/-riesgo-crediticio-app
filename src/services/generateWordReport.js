import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  WidthType,
  ShadingType,
} from "docx";
import { saveAs } from "file-saver";

const purposeLabels = {
  debt_consolidation: "Consolidacion de Deuda",
  credit_card: "Tarjeta de Credito",
  home_improvement: "Mejora del Hogar",
  major_purchase: "Compra Mayor",
  small_business: "Pequeno Negocio",
  educational: "Educativo",
  all_other: "Otro",
};

function colorForRisk(nivel) {
  if (nivel === "Bajo") return "2D6A4F";
  if (nivel === "Medio") return "B5851B";
  return "922B21";
}

function makeRow(label, value, shaded = false) {
  const shade = shaded
    ? { type: ShadingType.CLEAR, fill: "F2F3F4" }
    : { type: ShadingType.CLEAR, fill: "FFFFFF" };

  return new TableRow({
    children: [
      new TableCell({
        width: { size: 45, type: WidthType.PERCENTAGE },
        shading: shade,
        children: [
          new Paragraph({
            children: [new TextRun({ text: label, bold: true, size: 20, font: "Calibri" })],
          }),
        ],
      }),
      new TableCell({
        width: { size: 55, type: WidthType.PERCENTAGE },
        shading: shade,
        children: [
          new Paragraph({
            children: [new TextRun({ text: String(value), size: 20, font: "Calibri" })],
          }),
        ],
      }),
    ],
  });
}

export async function generateWordReport(result, formData) {
  const fecha = new Date().toLocaleString("es-PE", {
    dateStyle: "long",
    timeStyle: "short",
  });

  const riskColor = colorForRisk(result.nivel_riesgo);
  const propósito = purposeLabels[result.datos_recibidos?.purpose] || result.datos_recibidos?.purpose || "";

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Titulo principal
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
            children: [
              new TextRun({
                text: "INFORME DE EVALUACION DE RIESGO CREDITICIO",
                bold: true,
                size: 36,
                font: "Calibri",
                color: "1A237E",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: "Sistema de Evaluacion Crediticia con Machine Learning",
                size: 22,
                font: "Calibri",
                color: "555555",
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: `Fecha de evaluacion: ${fecha}`,
                size: 20,
                font: "Calibri",
                color: "888888",
                italics: true,
              }),
            ],
          }),

          // Resultado principal
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: "1. RESULTADO DE LA EVALUACION",
                bold: true,
                size: 26,
                font: "Calibri",
                color: "1A237E",
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    columnSpan: 2,
                    shading: { type: ShadingType.CLEAR, fill: riskColor },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.CENTER,
                        children: [
                          new TextRun({
                            text: `NIVEL DE RIESGO: ${result.nivel_riesgo?.toUpperCase()}`,
                            bold: true,
                            size: 32,
                            color: "FFFFFF",
                            font: "Calibri",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              makeRow("Clasificacion", result.riesgo, false),
              makeRow("Probabilidad de Incumplimiento", result.probabilidad_riesgo != null ? `${Number(result.probabilidad_riesgo).toFixed(1)}%` : "-", true),
              makeRow("Probabilidad de Cumplimiento", result.probabilidad_no_riesgo != null ? `${Number(result.probabilidad_no_riesgo).toFixed(1)}%` : "-", false),
              makeRow("Confianza del Modelo", result.confianza || "-", true),
            ],
          }),

          new Paragraph({ spacing: { after: 200 } }),

          // Recomendacion
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: "2. RECOMENDACION",
                bold: true,
                size: 26,
                font: "Calibri",
                color: "1A237E",
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: result.recomendacion || "",
                size: 22,
                font: "Calibri",
              }),
            ],
          }),

          // Datos del cliente
          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 200 },
            children: [
              new TextRun({
                text: "3. DATOS DEL CLIENTE EVALUADOS",
                bold: true,
                size: 26,
                font: "Calibri",
                color: "1A237E",
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                tableHeader: true,
                children: [
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: "1A237E" },
                    children: [new Paragraph({ children: [new TextRun({ text: "Variable", bold: true, color: "FFFFFF", size: 22, font: "Calibri" })] })],
                  }),
                  new TableCell({
                    shading: { type: ShadingType.CLEAR, fill: "1A237E" },
                    children: [new Paragraph({ children: [new TextRun({ text: "Valor", bold: true, color: "FFFFFF", size: 22, font: "Calibri" })] })],
                  }),
                ],
              }),
              makeRow("Politica Crediticia", (formData?.credit_policy ?? result.datos_recibidos?.credit_policy) == 1 ? "Cumple Criterios" : "No Cumple", false),
              makeRow("Proposito del Prestamo", propósito, true),
              makeRow("Tasa de Interes Anual", result.datos_recibidos?.int_rate ? `${(result.datos_recibidos.int_rate * 100).toFixed(2)}%` : "-", false),
              makeRow("Cuota Mensual", formData?.installment ? `$${formData.installment}` : "-", true),
              makeRow("Log Ingreso Anual", formData?.log_annual_inc ?? "-", false),
              makeRow("Puntaje FICO", result.datos_recibidos?.fico ?? "-", true),
              makeRow("Ratio Deuda/Ingreso (DTI)", result.datos_recibidos?.dti ?? "-", false),
              makeRow("Dias con Linea de Credito", formData?.days_with_cr_line ?? "-", true),
              makeRow("Balance Revolving", formData?.revol_bal ? `$${formData.revol_bal}` : "-", false),
              makeRow("Utilizacion Revolving", formData?.revol_util != null ? `${formData.revol_util}%` : "-", true),
              makeRow("Consultas ultimos 6 meses", formData?.inq_last_6mths ?? "-", false),
              makeRow("Morosidades (2 anos)", formData?.delinq_2yrs ?? "-", true),
              makeRow("Registros Publicos Negativos", formData?.pub_rec ?? "-", false),
            ],
          }),

          new Paragraph({ spacing: { after: 400 } }),

          // Pie de pagina
          new Paragraph({
            alignment: AlignmentType.CENTER,
            borders: {
              top: { style: BorderStyle.SINGLE, size: 6, color: "CCCCCC" },
            },
            spacing: { before: 200 },
            children: [
              new TextRun({
                text: "Credit Risk AI | Sistema de Evaluacion Crediticia con Machine Learning | Desarrollado por Julio Marchena",
                size: 16,
                color: "999999",
                font: "Calibri",
              }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const timestamp = new Date().toISOString().slice(0, 10);
  saveAs(blob, `Informe_Riesgo_Crediticio_${timestamp}.docx`);
}
