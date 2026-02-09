# 🚂 Guía Completa: Deployment en Railway

Esta guía te llevará paso a paso desde cero hasta tener tu API funcionando en Railway.

## 📋 Requisitos Previos

- ✅ Cuenta en [GitHub](https://github.com) (gratuita)
- ✅ Cuenta en [Railway.app](https://railway.app) (gratuita - $5 de crédito inicial)
- ✅ Git instalado en tu computadora
- ✅ Tu modelo `modelo_riesgo_crediticio.pkl` listo

---

## 🎯 PASO 1: Preparar el Repositorio en GitHub

### 1.1 Crear repositorio en GitHub

1. Ve a [github.com](https://github.com)
2. Click en el botón **"+"** arriba a la derecha
3. Selecciona **"New repository"**
4. Configuración:
   - **Repository name**: `api-riesgo-crediticio`
   - **Description**: "API Flask para evaluar riesgo crediticio - Power Apps Integration"
   - **Public** o **Private** (tu elección)
   - ❌ NO marques "Add a README file" (ya tenemos uno)
   - ❌ NO agregues .gitignore (ya tenemos uno)
5. Click **"Create repository"**

### 1.2 Inicializar Git en tu proyecto local

Abre la terminal en VS Code (Ctrl + `) y ejecuta:

```bash
# Navegar al directorio del proyecto
cd "c:\VS CODE Claude"

# Inicializar repositorio Git
git init

# Agregar todos los archivos
git add .

# Hacer el primer commit
git commit -m "Initial commit: API de Riesgo Crediticio"

# Conectar con GitHub (reemplaza TU_USUARIO con tu usuario de GitHub)
git remote add origin https://github.com/TU_USUARIO/api-riesgo-crediticio.git

# Subir a GitHub
git branch -M main
git push -u origin main
```

**⚠️ IMPORTANTE**: Asegúrate de incluir tu archivo `modelo_riesgo_crediticio.pkl` en el commit. Este archivo es esencial.

### 1.3 Verificar en GitHub

1. Refresca la página de tu repositorio en GitHub
2. Deberías ver todos los archivos:
   - ✅ app.py
   - ✅ requirements.txt
   - ✅ Procfile
   - ✅ runtime.txt
   - ✅ modelo_riesgo_crediticio.pkl
   - ✅ README.md

---

## 🚀 PASO 2: Desplegar en Railway

### 2.1 Crear cuenta en Railway

1. Ve a [railway.app](https://railway.app)
2. Click en **"Login"** o **"Start a New Project"**
3. Autentícate con tu cuenta de **GitHub**
4. Autoriza Railway a acceder a tus repositorios

### 2.2 Crear nuevo proyecto

1. En el dashboard de Railway, click **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Si es la primera vez, Railway te pedirá acceso:
   - Click **"Configure GitHub App"**
   - Selecciona **"All repositories"** o solo `api-riesgo-crediticio`
   - Click **"Install & Authorize"**

### 2.3 Seleccionar tu repositorio

1. Busca y selecciona `api-riesgo-crediticio`
2. Railway comenzará el deployment automáticamente
3. Verás los logs en tiempo real:

```
⏳ Building...
📦 Installing dependencies from requirements.txt
✅ Build successful
🚀 Deploying...
```

### 2.4 Configurar Variables de Entorno

**🔐 CRÍTICO**: Cambiar la API Key por defecto

1. En tu proyecto de Railway, click en el servicio (tu API)
2. Ve a la pestaña **"Variables"**
3. Click **"+ New Variable"**
4. Agrega las siguientes variables:

| Variable | Valor | Descripción |
|----------|-------|-------------|
| `API_KEY` | `RiesgoCrediticio2024_SecureKey_987` | Tu clave secreta (cámbiala) |
| `DEBUG` | `False` | Modo de depuración (dejar False en producción) |

5. Click **"Add"** para cada variable

**💡 TIP**: Genera una API Key segura en [randomkeygen.com](https://randomkeygen.com/)

### 2.5 Generar Dominio Público

1. En la pestaña **"Settings"** de tu servicio
2. Sección **"Networking"**
3. Click **"Generate Domain"**
4. Railway te asignará un dominio como:
   ```
   https://api-riesgo-crediticio-production-abc123.up.railway.app
   ```
5. **📝 GUARDA ESTE URL** - lo necesitarás para Power Apps

### 2.6 Verificar Deployment

#### Verificación 1: Logs
```
Click en "Deployments" → Ver el último deployment → Check logs
Deberías ver:
✅ Build successful
✅ Starting server...
🚀 Iniciando servidor en puerto 8080
🤖 Modelo cargado: Sí
```

#### Verificación 2: Health Check

Abre tu navegador y ve a:
```
https://TU-DOMINIO.railway.app/health
```

Deberías ver:
```json
{
  "status": "healthy",
  "modelo_cargado": true
}
```

#### Verificación 3: Endpoint Principal

```
https://TU-DOMINIO.railway.app/
```

Respuesta esperada:
```json
{
  "mensaje": "🏦 API de Riesgo Crediticio - Activa",
  "version": "1.0",
  "autor": "Julius",
  "endpoints": {...}
}
```

---

## 🧪 PASO 3: Probar la API en Railway

### 3.1 Usando Postman (Recomendado)

1. Descarga [Postman](https://www.postman.com/downloads/)
2. Crea una nueva request:
   - **Method**: POST
   - **URL**: `https://TU-DOMINIO.railway.app/predict`
   - **Headers**:
     ```
     Content-Type: application/json
     X-API-Key: RiesgoCrediticio2024_SecureKey_987
     ```
   - **Body** (raw, JSON):
     ```json
     {
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
     }
     ```
3. Click **"Send"**

**✅ Respuesta exitosa:**
```json
{
  "prediccion": 0,
  "riesgo": "No Riesgoso",
  "nivel_riesgo": "Bajo",
  "probabilidad_riesgo": 2.34,
  "confianza": "97.66%",
  "recomendacion": "✅ Cliente excelente - Aprobar crédito con condiciones favorables"
}
```

### 3.2 Usando cURL (Terminal)

```bash
curl -X POST https://TU-DOMINIO.railway.app/predict \
  -H "Content-Type: application/json" \
  -H "X-API-Key: RiesgoCrediticio2024_SecureKey_987" \
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

### 3.3 Casos de Prueba

#### ✅ Cliente de Bajo Riesgo
```json
{
  "fico": 750,
  "int_rate": 0.10,
  "dti": 15.0,
  // ... resto de campos
}
```
**Resultado esperado**: "No Riesgoso" con alta confianza

#### ⚠️ Cliente de Alto Riesgo
```json
{
  "fico": 550,
  "int_rate": 0.25,
  "dti": 45.0,
  // ... resto de campos
}
```
**Resultado esperado**: "Riesgoso" con recomendación de rechazo

---

## 🔄 PASO 4: Actualizar la API

Cuando hagas cambios en tu código:

```bash
# Hacer cambios en app.py u otros archivos

# Guardar y hacer commit
git add .
git commit -m "Descripción de los cambios"

# Subir a GitHub
git push origin main
```

**🎉 Railway desplegará automáticamente** los cambios en ~1-2 minutos.

---

## 📊 PASO 5: Monitoreo y Mantenimiento

### 5.1 Ver Logs en Tiempo Real

1. En Railway, click en tu servicio
2. Pestaña **"Deployments"**
3. Click en el deployment activo
4. Los logs se actualizan en tiempo real

### 5.2 Métricas de Uso

1. Pestaña **"Metrics"**
2. Verás:
   - **CPU Usage**: Uso de procesador
   - **Memory Usage**: Uso de RAM
   - **Network**: Tráfico de red
   - **Request Count**: Número de requests

### 5.3 Costos

- **Plan Free Trial**: $5 de crédito inicial
- **Consumo típico**: ~$5-10/mes para uso moderado
- **Plan Hobby**: $5/mes con $5 de crédito incluido

### 5.4 Optimización

Si necesitas reducir costos:
1. Railway → Settings → Sleep When Idle
2. La API "dormirá" después de 30 min sin requests
3. Se "despierta" automáticamente en el primer request (tarda ~10 seg)

---

## 🐛 Troubleshooting

### ❌ Error: "Build failed"

**Causa**: Falta algún archivo o error en requirements.txt

**Solución**:
1. Verifica que `requirements.txt` esté correcto
2. Revisa los logs de build en Railway
3. Asegúrate de que todos los archivos estén en GitHub

### ❌ Error: "Modelo no cargado"

**Causa**: El archivo PKL no está en el repositorio

**Solución**:
```bash
# Verificar que el PKL esté en Git
git add modelo_riesgo_crediticio.pkl
git commit -m "Add modelo PKL"
git push origin main
```

### ❌ Error: "API Key inválida"

**Causa**: No configuraste la variable de entorno o el header es incorrecto

**Solución**:
1. Railway → Variables → Agregar `API_KEY`
2. En tus requests, incluir header: `X-API-Key: TU_CLAVE`

### ❌ Error: "App crashed"

**Causa**: Error en el código Python

**Solución**:
1. Ver logs en Railway para identificar el error
2. Probar localmente primero con `python app.py`
3. Hacer fix y `git push`

---

## ✅ Checklist Final

Antes de pasar a Power Apps, verifica:

- ✅ Repositorio en GitHub con todos los archivos
- ✅ Deployment exitoso en Railway
- ✅ Health check responde correctamente
- ✅ Variable `API_KEY` configurada
- ✅ Dominio público generado y guardado
- ✅ Predicciones funcionan correctamente en Postman
- ✅ Logs muestran "Modelo cargado: Sí"

---

## 📚 Próximo Paso

Una vez que tu API esté funcionando en Railway:

👉 **Continúa con**: `GUIA_POWER_APPS.md`

Ahí configuraremos el Custom Connector para conectar Power Apps con tu API.

---

## 📞 Soporte

**Railway Docs**: https://docs.railway.app
**Railway Community**: https://discord.gg/railway

---

## 🎓 Notas para la Clase

Este deployment es:
- ✅ **Permanente**: La URL no cambia
- ✅ **Escalable**: Railway maneja el tráfico automáticamente
- ✅ **Profesional**: Listo para demos y producción
- ✅ **Económico**: ~$5-10/mes para uso normal

¡Tu API ya está lista para integrarse con Power Apps! 🚀
