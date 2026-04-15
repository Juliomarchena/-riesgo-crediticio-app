# Changelog — Riesgo Crediticio App

Historial de cambios del proyecto. Formato: `[versión] — fecha — descripción`.

---

## [1.3.0] — 2026-04-15 — Fix: corrección modelo ML y bugs de visualización

### Contexto
Al procesar el archivo `clientes_prueba.xlsx` con evaluación masiva, **todos los 15 clientes
aparecían con nivel "Bajo"** sin importar sus valores de FICO, tasa o DTI.
Se identificaron dos bugs independientes: uno en el backend (Python/Railway) y otro en el
frontend (React).

### Bugs corregidos

#### Bug 1 — Target leakage en `app.py` (backend crítico)
- **Archivo:** `c:/VS CODE Claude/app.py` — función `transformar_caracteristicas()`
- **Causa:** La posición 1 del vector de features tenía un `0` hardcodeado.
  Esa posición corresponde a `not_fully_paid`, que es la **variable objetivo** del dataset
  LendingClub. Al pasarle siempre `0` ("préstamo pagado"), el modelo interpretaba
  que todos los clientes eran buenos pagadores → predecía "Bajo" para todos.
- **Fix:** Se eliminó el `0` hardcodeado. El modelo ahora opera con 18 features reales
  (antes eran 19 con la variable leakeada).

```python
# ANTES (buggy)
caracteristicas = [
    credit_policy,
    0,            # ← not_fully_paid hardcodeado → TARGET LEAKAGE
    int_rate,
    ...           # 19 features
]

# DESPUÉS (correcto)
caracteristicas = [
    credit_policy,
    int_rate,
    ...           # 18 features reales
]
```

#### Bug 2 — Doble multiplicación de probabilidades en `BatchProcessor.jsx` (frontend)
- **Archivo:** `src/components/BatchProcessor.jsx` líneas 91–92
- **Causa:** La API devuelve `probabilidad_riesgo` ya en porcentaje (ej: `2.43` = 2.43%).
  El frontend multiplicaba por 100 de nuevo → mostraba `243%` en lugar de `2.43%`.
- **Fix:** Se eliminó el `* 100`.

```js
// ANTES (buggy)
_prob_incumplimiento: `${(res.probabilidad_riesgo * 100).toFixed(1)}%`  // → "243.0%"

// DESPUÉS (correcto)
_prob_incumplimiento: `${(res.probabilidad_riesgo).toFixed(1)}%`        // → "2.4%"
```

### Modelo reentrenado
- **Archivo:** `c:/VS CODE Claude/crear_modelo_ejemplo.py`
- Se actualizó el script de entrenamiento para generar un modelo con **18 features**
  (sin `not_fully_paid`) usando `GradientBoostingClassifier` con datos balanceados.
- Verificación de perfiles extremos tras el reentrenamiento:

| Perfil | FICO | Tasa | DTI | Prob. riesgo | Clasificación |
|--------|------|------|-----|--------------|---------------|
| Bajo   | 780  | 8%   | 12  | 0.0%         | Bajo ✓        |
| Medio  | 620  | 20%  | 38  | 100%         | Alto ✓        |
| Alto   | 310  | 65%  | 72  | 100%         | Alto ✓        |

### Archivos modificados
| Archivo | Tipo | Cambio |
|---------|------|--------|
| `c:/VS CODE Claude/app.py` | Backend | Eliminado `0` (target leakage), `n_features` → 18 |
| `c:/VS CODE Claude/crear_modelo_ejemplo.py` | Backend | Reescrito con 18 features, GBM, clases balanceadas |
| `c:/VS CODE Claude/modelo_riesgo_crediticio.pkl` | Backend | Regenerado — modelo sin leakage |
| `src/components/BatchProcessor.jsx` | Frontend | Corregida visualización de probabilidades |

---

## [1.2.0] — 2026-04-15 — Add: informe Word y evaluación masiva Excel

### Nuevas funcionalidades

#### Informe Word por cliente
- **Archivo:** `src/services/generateWordReport.js`
- Genera un informe `.docx` profesional con el resultado completo de la evaluación:
  nivel de riesgo, probabilidades, recomendación y datos procesados.
- Accesible desde el botón "Descargar Informe Word" en el panel de resultados.

#### Evaluación masiva desde Excel
- **Archivo:** `src/components/BatchProcessor.jsx`
- Permite subir un archivo `.xlsx` con múltiples clientes y evaluarlos en lote.
- Procesa cada fila llamando al endpoint `/predict` de la API.
- Descarga un Excel con los resultados (`Nivel Riesgo`, `Prob. Incumplimiento`,
  `Prob. Cumplimiento`, `Confianza`, `Recomendación`) para todos los clientes.
- Columnas requeridas en el Excel de entrada: `credit_policy`, `purpose`, `int_rate`,
  `installment`, `log_annual_inc`, `dti`, `fico`, `days_with_cr_line`, `revol_bal`,
  `revol_util`, `inq_last_6mths`, `delinq_2yrs`, `pub_rec`.

#### Archivo de prueba
- **Archivo:** `clientes_prueba.xlsx` + `generar_excel_prueba.mjs`
- 15 clientes de prueba distribuidos: 5 riesgo bajo, 5 riesgo medio, 5 riesgo alto.

### Archivos añadidos / modificados
| Archivo | Cambio |
|---------|--------|
| `src/components/BatchProcessor.jsx` | Nuevo componente |
| `src/services/generateWordReport.js` | Nuevo servicio |
| `src/components/ResultPanel.jsx` | Añadido botón "Descargar Informe Word" |
| `src/App.jsx` | Integrado `BatchProcessor` en la vista principal |
| `clientes_prueba.xlsx` | Nuevo archivo de datos de prueba |
| `generar_excel_prueba.mjs` | Script generador del Excel de prueba |
| `package.json` | Añadidas dependencias `docx`, `file-saver`, `xlsx` |

---

## [1.1.0] — 2026-02-21 — Fix: migración a Vite y despliegue en Railway

### Cambios
- Migración de Create React App → **Vite** para build más rápido.
- Añadido `nixpacks.toml` para correcto despliegue en Railway.
- Actualizado `server.js` para servir el build estático de Vite (`/build`).
- Corrección de secuencias Unicode escapadas en títulos de componentes.
- Separación de componentes: `InputField`, `PurposeSelector`, `GaugeChart`, `ResultPanel`.
- Separación de servicios: `api.js` (llamadas al backend), `theme.js` (estilos).

### Archivos añadidos
`nixpacks.toml`, `vite.config.js`, `src/components/`, `src/services/`, `src/styles/`

---

## [1.0.0] — 2026-02-11 — App React inicial

### Descripción
Primera versión de la interfaz React para el sistema de evaluación de riesgo crediticio.

### Funcionalidades
- Formulario de evaluación individual con 13 campos financieros.
- Llamada al API REST (`/predict`) desplegado en Railway.
- Visualización del resultado con gauge chart, nivel de riesgo y recomendación.
- Autenticación con `X-API-Key` en header.

---

## [0.1.0] — 2026-02-09 — API Python inicial (XGBoost)

### Descripción
Primer despliegue del backend Flask en Railway con modelo XGBoost para
predicción de riesgo crediticio basado en el dataset LendingClub.

### Componentes
- `app.py`: API Flask con endpoints `/predict`, `/health`, `/test`, `/docs` (Swagger).
- `modelo_riesgo_crediticio.pkl`: Modelo serializado.
- `requirements.txt`: Dependencias Python.
- Documentación completa: `DOCUMENTACION_COMPLETA.md`, `GUIA_RAILWAY.md`, `GUIA_POWER_APPS.md`.

---

*Generado el 2026-04-15. Proyecto: API Riesgo Crediticio + React Frontend.*
