# 🏦 API de Riesgo Crediticio - Power Apps Integration

API REST construida con Flask para evaluar el riesgo crediticio de clientes usando Machine Learning. Diseñada para integrarse con Power Apps mediante Custom Connector.

## 📋 Características

- ✅ Predicción de riesgo crediticio con modelo ML
- ✅ API REST con Flask y autenticación por API Key
- ✅ Endpoints documentados y validaciones incorporadas
- ✅ Listo para desplegar en Railway
- ✅ Compatible con Power Apps Custom Connector
- ✅ Health checks y logging

## 🛠️ Requisitos

- Python 3.11+
- Archivo `modelo_riesgo_crediticio.pkl` (tu modelo entrenado)
- Git para version control

## 🚀 Instalación Local

### 1. Clonar o descargar el proyecto

```bash
cd "c:\VS CODE Claude"
```

### 2. Crear entorno virtual

```bash
python -m venv venv
```

### 3. Activar entorno virtual

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 4. Instalar dependencias

```bash
pip install -r requirements.txt
```

### 5. Colocar tu modelo PKL

Asegúrate de que el archivo `modelo_riesgo_crediticio.pkl` esté en la raíz del proyecto.

### 6. Ejecutar la API

```bash
python app.py
```

La API estará disponible en: `http://localhost:5000`

## 🧪 Probar la API Localmente

### 1. Verificar que está activa

```bash
curl http://localhost:5000/
```

**Respuesta esperada:**
```json
{
  "mensaje": "🏦 API de Riesgo Crediticio - Activa",
  "version": "1.0",
  "endpoints": {...}
}
```

### 2. Health Check

```bash
curl http://localhost:5000/health
```

### 3. Obtener datos de prueba

```bash
curl http://localhost:5000/test
```

### 4. Realizar predicción (con API Key)

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -H "X-API-Key: tu-clave-secreta-cambiar-en-railway" \
  -d '{
    "credit_policy": 1,
    "int_rate": 0.1357,
    "installment": 366.86,
    "log_annual_inc": 11.35,
    "dti": 19.48,
    "fico": 737,
    "days_with_cr_line": 5639.96,
    "revol_bal": 28854,
    "revol_util": 52.10,
    "inq_last_6mths": 1,
    "delinq_2yrs": 0,
    "pub_rec": 0
  }'
```

**Respuesta esperada:**
```json
{
  "prediccion": 0,
  "riesgo": "No Riesgoso",
  "nivel_riesgo": "Bajo",
  "probabilidad_riesgo": 2.34,
  "confianza": "97.66%",
  "recomendacion": "✅ Cliente excelente - Aprobar crédito..."
}
```

## 📊 Estructura del Proyecto

```
.
├── app.py                          # API Flask principal
├── requirements.txt                # Dependencias Python
├── Procfile                        # Configuración Railway
├── runtime.txt                     # Versión de Python
├── .gitignore                      # Archivos a ignorar
├── modelo_riesgo_crediticio.pkl   # Tu modelo ML (añadir)
└── README.md                       # Esta documentación
```

## 🔐 Seguridad

La API usa autenticación por API Key:
- Header requerido: `X-API-Key`
- Por defecto: `tu-clave-secreta-cambiar-en-railway`
- **IMPORTANTE**: Cambiar en Railway con variable de entorno `API_KEY`

## 📥 Parámetros de Entrada (POST /predict)

| Campo | Tipo | Descripción | Rango |
|-------|------|-------------|-------|
| `credit_policy` | int | Política de crédito (0 o 1) | 0-1 |
| `int_rate` | float | Tasa de interés | 0-1 |
| `installment` | float | Cuota mensual | > 0 |
| `log_annual_inc` | float | Log del ingreso anual | > 0 |
| `dti` | float | Ratio deuda/ingreso | > 0 |
| `fico` | int | Puntaje FICO | 300-850 |
| `days_with_cr_line` | float | Días con línea de crédito | > 0 |
| `revol_bal` | float | Balance revolving | > 0 |
| `revol_util` | float | Utilización revolving (%) | 0-100 |
| `inq_last_6mths` | int | Consultas últimos 6 meses | ≥ 0 |
| `delinq_2yrs` | int | Morosidades últimos 2 años | ≥ 0 |
| `pub_rec` | int | Registros públicos negativos | ≥ 0 |

## 📤 Respuesta de la API

```json
{
  "prediccion": 0,
  "riesgo": "No Riesgoso",
  "nivel_riesgo": "Bajo",
  "color_recomendado": "green",
  "probabilidad_no_riesgo": 97.66,
  "probabilidad_riesgo": 2.34,
  "confianza": "97.66%",
  "recomendacion": "✅ Cliente excelente - Aprobar crédito...",
  "datos_recibidos": {
    "fico": 737,
    "int_rate": 0.1357,
    "dti": 19.48
  }
}
```

## 🚂 Próximos Pasos

1. ✅ **Deployment en Railway** - Ver `GUIA_RAILWAY.md`
2. ✅ **Configurar Custom Connector** - Ver `GUIA_POWER_APPS.md`
3. ✅ **Crear Power App** - Interfaz de usuario
4. ✅ **Agregar Copilot Studio** - Chatbot opcional

## 📚 Documentación Completa

- `GUIA_RAILWAY.md` - Guía paso a paso para desplegar en Railway
- `GUIA_POWER_APPS.md` - Configuración de Custom Connector y Power Apps
- `DOCUMENTACION_COMPLETA.docx` - Documento Word profesional con todo

## 🐛 Troubleshooting

### Error: "Modelo no disponible"
- Verifica que `modelo_riesgo_crediticio.pkl` esté en la raíz
- Revisa los logs: `railway logs` (en Railway)

### Error: "API key inválida"
- Asegúrate de incluir el header `X-API-Key`
- Verifica que coincida con la variable de entorno

### Error al instalar dependencias
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

## 👨‍💻 Autor

**Julius** - Proyecto de integración ML con Power Platform

## 📝 Licencia

Proyecto educativo - Uso libre
