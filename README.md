<<<<<<< HEAD
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

# Riesgo Crediticio - Repositorio combinado

Este repositorio contiene dos partes relacionadas:

- **API (Python / Flask):** endpoints y modelo para evaluar riesgo crediticio.
- **Cliente (React):** aplicación frontend creada con Create React App.

Revisa las carpetas y archivos en la raíz para ver qué parte usar.

## API (Python)

Si estás usando la API en Python:

1. Crea un entorno virtual:

```bash
python -m venv venv
```

2. Activa el entorno y instala dependencias:

```bash
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

3. Coloca `modelo_riesgo_crediticio.pkl` en la raíz y ejecuta:

```bash
python app.py
```

## Cliente (React)

Si estás usando la aplicación React, los comandos habituales son:

```bash
npm install
npm run build    # crea la carpeta build
npm start        # en desarrollo usa react-scripts
```

La aplicación React está lista para ser servida por un servidor estático (por ejemplo, Express) en producción.

---

Si prefieres mantener dos README separados, puedo extraer y crear `README_API.md` y `README_CLIENT.md`. Dime cómo prefieres organizarlo.
curl http://localhost:5000/
