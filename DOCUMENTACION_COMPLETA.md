# 📘 Documentación Completa: Sistema de Evaluación de Riesgo Crediticio

**Proyecto**: API de Machine Learning integrada con Power Apps
**Autor**: Julius
**Fecha**: Febrero 2026
**Tecnologías**: Python, Flask, scikit-learn, Railway, Power Apps, Custom Connectors

---

## 📋 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Componentes Técnicos](#componentes-técnicos)
4. [Guía de Implementación](#guía-de-implementación)
5. [Manual de Usuario](#manual-de-usuario)
6. [Casos de Uso](#casos-de-uso)
7. [Mantenimiento y Soporte](#mantenimiento-y-soporte)
8. [Anexos](#anexos)

---

## 1. Resumen Ejecutivo

### 1.1 Descripción del Proyecto

Este proyecto implementa un sistema completo de evaluación de riesgo crediticio que integra:
- **Machine Learning**: Modelo predictivo entrenado (archivo PKL)
- **Backend Cloud**: API REST desplegada en Railway
- **Frontend Low-Code**: Aplicación Power Apps para usuarios finales
- **Seguridad**: Autenticación mediante API Key

### 1.2 Objetivos

- ✅ Automatizar la evaluación de riesgo crediticio
- ✅ Proporcionar predicciones en tiempo real
- ✅ Interfaz intuitiva para usuarios no técnicos
- ✅ Arquitectura escalable y mantenible
- ✅ Integración con Microsoft Power Platform

### 1.3 Beneficios

| Beneficio | Descripción |
|-----------|-------------|
| **Velocidad** | Evaluación instantánea vs. horas/días manual |
| **Consistencia** | Criterios objetivos y estandarizados |
| **Escalabilidad** | Miles de evaluaciones simultáneas |
| **Trazabilidad** | Registro completo de decisiones |
| **Integración** | Compatible con sistemas Microsoft 365 |

### 1.4 Métricas del Proyecto

- **Tiempo de respuesta API**: < 1 segundo
- **Disponibilidad**: 99.9% (Railway SLA)
- **Precisión del modelo**: Variable según entrenamiento
- **Costo operacional**: ~$5-10 USD/mes

---

## 2. Arquitectura del Sistema

### 2.1 Diagrama de Arquitectura

```
┌─────────────────┐
│   Power Apps    │ ← Usuario final
│   (Frontend)    │
└────────┬────────┘
         │ HTTPS
         │ Custom Connector
         ▼
┌─────────────────┐
│   API Gateway   │
│   (Railway)     │ ← API Key Authentication
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Flask API     │ ← app.py
│   (Backend)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Modelo ML      │ ← modelo_riesgo_crediticio.pkl
│  (Predicción)   │
└─────────────────┘
```

### 2.2 Flujo de Datos

1. **Entrada**: Usuario ingresa 12 características del cliente en Power Apps
2. **Validación**: Power Apps valida rangos y formatos
3. **Transmisión**: Datos enviados vía HTTPS con API Key
4. **Procesamiento**: Flask recibe, valida y prepara datos
5. **Predicción**: Modelo ML procesa y genera resultado
6. **Respuesta**: API retorna predicción, probabilidades y recomendaciones
7. **Visualización**: Power Apps muestra resultado con formato dinámico

### 2.3 Componentes del Sistema

#### Frontend
- **Tecnología**: Power Apps (Canvas App)
- **Funciones**:
  - Captura de datos del cliente
  - Validaciones en tiempo real
  - Visualización de resultados
  - Historial de consultas

#### Backend
- **Tecnología**: Python 3.11, Flask 3.0
- **Funciones**:
  - Servicio de API REST
  - Autenticación y autorización
  - Validación de datos
  - Logging y monitoreo

#### Machine Learning
- **Framework**: scikit-learn
- **Tipo**: Clasificador binario
- **Input**: 12 características numéricas
- **Output**: Predicción + probabilidades

#### Infraestructura
- **Hosting**: Railway.app
- **Base de datos**: No requerida (modelo estático)
- **CDN**: Railway CDN incluido
- **Monitoring**: Railway Metrics + logs

---

## 3. Componentes Técnicos

### 3.1 Modelo de Machine Learning

#### Características de Entrada (12 variables)

| # | Variable | Tipo | Rango | Descripción |
|---|----------|------|-------|-------------|
| 1 | `credit_policy` | int | 0-1 | ¿Cumple política de crédito? |
| 2 | `int_rate` | float | 0-1 | Tasa de interés del préstamo |
| 3 | `installment` | float | >0 | Cuota mensual en USD |
| 4 | `log_annual_inc` | float | >0 | Logaritmo del ingreso anual |
| 5 | `dti` | float | >0 | Ratio deuda/ingreso (%) |
| 6 | `fico` | int | 300-850 | Puntaje FICO del cliente |
| 7 | `days_with_cr_line` | float | >0 | Días con línea de crédito |
| 8 | `revol_bal` | float | ≥0 | Balance revolving en USD |
| 9 | `revol_util` | float | 0-100 | % de utilización revolving |
| 10 | `inq_last_6mths` | int | ≥0 | Consultas últimos 6 meses |
| 11 | `delinq_2yrs` | int | ≥0 | Morosidades últimos 2 años |
| 12 | `pub_rec` | int | ≥0 | Registros públicos negativos |

#### Características de Salida

```json
{
  "prediccion": 0,                    // 0 = No Riesgoso, 1 = Riesgoso
  "riesgo": "No Riesgoso",           // Texto legible
  "nivel_riesgo": "Bajo",            // Bajo/Medio/Alto
  "color_recomendado": "green",      // green/yellow/red
  "probabilidad_no_riesgo": 97.66,   // % de confianza
  "probabilidad_riesgo": 2.34,
  "confianza": "97.66%",
  "recomendacion": "...",            // Texto de recomendación
  "datos_recibidos": {...}           // Echo de datos clave
}
```

### 3.2 API REST Endpoints

#### GET `/`
**Descripción**: Información general de la API

**Request**: Ninguno

**Response**:
```json
{
  "mensaje": "🏦 API de Riesgo Crediticio - Activa",
  "version": "1.0",
  "endpoints": {...}
}
```

#### GET `/health`
**Descripción**: Health check para monitoreo

**Request**: Ninguno

**Response**:
```json
{
  "status": "healthy",
  "modelo_cargado": true
}
```

#### POST `/predict`
**Descripción**: Realizar predicción de riesgo

**Headers**:
```
Content-Type: application/json
X-API-Key: {tu_api_key}
```

**Request Body**:
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

**Response** (ver sección 3.1 - Características de Salida)

**Códigos de Estado**:
- `200`: Predicción exitosa
- `400`: Datos inválidos
- `401`: API Key inválida
- `500`: Error del servidor
- `503`: Modelo no disponible

#### GET `/test`
**Descripción**: Obtener datos de ejemplo para pruebas

**Request**: Ninguno

**Response**: JSON con datos de prueba

### 3.3 Seguridad

#### Autenticación
- **Método**: API Key en header
- **Header**: `X-API-Key`
- **Almacenamiento**: Variable de entorno en Railway
- **Rotación**: Manual (recomendado cada 90 días)

#### Validaciones
1. **Input Validation**:
   - FICO: 300-850
   - int_rate: 0-1
   - Todos los campos numéricos
2. **Type Checking**: Conversión automática con error handling
3. **Error Messages**: Mensajes descriptivos sin exponer internals

#### CORS
- **Habilitado**: Para permitir llamadas desde Power Apps
- **Origins**: `*` (en producción, restringir a dominios específicos)

#### HTTPS
- **Requerido**: Railway proporciona certificado SSL automático
- **TLS**: 1.2+ soportado

---

## 4. Guía de Implementación

### 4.1 Prerequisitos

#### Software Necesario
- Python 3.11+
- Git
- Editor de código (VS Code recomendado)
- Postman (opcional, para pruebas)

#### Cuentas Necesarias
- GitHub (gratuita)
- Railway.app (plan free trial - $5 crédito)
- Microsoft Power Apps (licencia M365 o trial)

### 4.2 Instalación Local

#### Paso 1: Preparar el entorno

```bash
# Clonar o navegar al directorio
cd "c:\VS CODE Claude"

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual (Windows)
venv\Scripts\activate

# Activar entorno virtual (Linux/Mac)
source venv/bin/activate
```

#### Paso 2: Instalar dependencias

```bash
pip install -r requirements.txt
```

#### Paso 3: Preparar el modelo

Opción A: Si tienes tu modelo entrenado
```bash
# Copiar modelo_riesgo_crediticio.pkl al directorio raíz
```

Opción B: Crear modelo de ejemplo
```bash
python crear_modelo_ejemplo.py
```

#### Paso 4: Ejecutar localmente

```bash
python app.py
```

Deberías ver:
```
🚀 Iniciando servidor en puerto 5000
🔐 API Key configurada: Sí
🤖 Modelo cargado: Sí
 * Running on http://0.0.0.0:5000
```

#### Paso 5: Probar localmente

```bash
# En otra terminal
curl http://localhost:5000/health
```

### 4.3 Deployment en Railway

**Ver guía detallada**: `GUIA_RAILWAY.md`

**Pasos resumidos**:
1. Crear repositorio en GitHub
2. Subir código con `git push`
3. Crear proyecto en Railway
4. Conectar con GitHub
5. Configurar variables de entorno
6. Generar dominio público
7. Verificar deployment

### 4.4 Configuración Power Apps

**Ver guía detallada**: `GUIA_POWER_APPS.md`

**Pasos resumidos**:
1. Crear Custom Connector
2. Configurar autenticación (API Key)
3. Definir operación `/predict`
4. Probar conexión
5. Crear Canvas App
6. Diseñar interfaz
7. Conectar con Custom Connector
8. Publicar app

---

## 5. Manual de Usuario

### 5.1 Acceso a la Aplicación

#### Desktop
1. Navegar a [make.powerapps.com](https://make.powerapps.com)
2. Click en "Apps" en el menú izquierdo
3. Buscar "Evaluador Riesgo Crediticio"
4. Click para abrir

#### Móvil
1. Descargar app "Power Apps" desde:
   - iOS: App Store
   - Android: Google Play
2. Iniciar sesión con cuenta corporativa
3. Seleccionar "Evaluador Riesgo Crediticio"

### 5.2 Realizar una Evaluación

#### Paso 1: Ingresar datos del cliente

En la pantalla principal, completar todos los campos:

**Información de Política**:
- Política de Crédito: 0 (No cumple) o 1 (Cumple)

**Información Financiera**:
- Tasa de Interés: Entre 0 y 1 (ej: 0.15 = 15%)
- Cuota Mensual: Monto en dólares
- Log Ingreso Anual: Logaritmo del ingreso (ej: 11.35)
- Ratio Deuda/Ingreso: Porcentaje (ej: 19.48)

**Información Crediticia**:
- Puntaje FICO: Entre 300 y 850
- Días con Línea de Crédito: Número de días

**Información de Deuda**:
- Balance Revolving: Monto en dólares
- Utilización Revolving: Porcentaje (0-100)

**Historial**:
- Consultas Últimos 6 Meses: Número entero
- Morosidades Últimos 2 Años: Número entero
- Registros Públicos Negativos: Número entero

#### Paso 2: Evaluar

1. Verificar que no haya mensajes de error
2. Click en botón "🔍 Evaluar Riesgo"
3. Esperar procesamiento (1-2 segundos)

#### Paso 3: Interpretar resultados

La pantalla de resultados mostrará:

**Resultado Principal** (en color):
- Verde: "No Riesgoso"
- Rojo: "Riesgoso"

**Nivel de Riesgo**:
- Bajo: < 30% probabilidad
- Medio: 30-70% probabilidad
- Alto: > 70% probabilidad

**Confianza**:
- Porcentaje de certeza del modelo

**Recomendación**:
- Texto con acción sugerida

#### Paso 4: Nueva evaluación

Click en "← Nueva Evaluación" para regresar

### 5.3 Casos de Ejemplo

#### Ejemplo 1: Cliente de Bajo Riesgo

**Entrada**:
```
Política de Crédito: 1
Tasa de Interés: 0.08
Cuota Mensual: 300.50
Log Ingreso Anual: 11.80
DTI: 12.5
FICO: 780
Días con CR Line: 6500.0
Balance Revolving: 15000
Utilización Revolving: 30.0
Consultas 6 Meses: 0
Morosidades 2 Años: 0
Registros Públicos: 0
```

**Resultado esperado**:
- Riesgo: No Riesgoso ✅ (verde)
- Nivel: Bajo
- Confianza: >95%
- Recomendación: "Cliente excelente - Aprobar crédito con condiciones favorables"

#### Ejemplo 2: Cliente de Alto Riesgo

**Entrada**:
```
Política de Crédito: 0
Tasa de Interés: 0.28
Cuota Mensual: 850.00
Log Ingreso Anual: 10.20
DTI: 45.0
FICO: 520
Días con CR Line: 1200.0
Balance Revolving: 45000
Utilización Revolving: 95.0
Consultas 6 Meses: 8
Morosidades 2 Años: 3
Registros Públicos: 2
```

**Resultado esperado**:
- Riesgo: Riesgoso ❌ (rojo)
- Nivel: Alto
- Confianza: >80%
- Recomendación: "Cliente de alto riesgo. Puntaje FICO bajo. Ratio deuda/ingreso elevado. Considerar garantías adicionales o rechazar."

---

## 6. Casos de Uso

### 6.1 Caso de Uso: Análisis Pre-Aprobación

**Actor**: Oficial de crédito
**Objetivo**: Evaluar rápidamente solicitudes de crédito
**Precondición**: Tener datos básicos del cliente

**Flujo**:
1. Cliente llena solicitud online
2. Datos se sincronizan con Power Apps
3. Oficial abre app de evaluación
4. Datos pre-populados automáticamente
5. Click en "Evaluar"
6. Resultado inmediato guía decisión

**Resultado**: Decisión en <1 minuto vs. 24-48 horas manual

### 6.2 Caso de Uso: Auditoría de Cartera

**Actor**: Analista de riesgo
**Objetivo**: Re-evaluar clientes existentes
**Precondición**: Conexión con sistema de datos

**Flujo**:
1. Power Automate extrae datos de clientes activos
2. Loop automático evalúa cada cliente
3. Resultados se guardan en SharePoint
4. Dashboard muestra distribución de riesgo
5. Alertas para clientes que aumentaron riesgo

**Resultado**: Monitoreo proactivo de cartera

### 6.3 Caso de Uso: Simulador de Escenarios

**Actor**: Gerente de ventas
**Objetivo**: Mostrar impacto de mejorar puntaje

**Flujo**:
1. Evaluar cliente con datos actuales
2. Guardar resultado
3. Modificar FICO hipotéticamente (+50 puntos)
4. Re-evaluar
5. Comparar resultados
6. Mostrar a cliente beneficios de mejorar crédito

**Resultado**: Herramienta de coaching financiero

---

## 7. Mantenimiento y Soporte

### 7.1 Monitoreo

#### Railway Dashboard
- **URL**: https://railway.app/project/[tu-proyecto]
- **Métricas disponibles**:
  - CPU Usage
  - Memory Usage
  - Network Traffic
  - Request Count
  - Error Rate

#### Logs
```bash
# Ver logs en tiempo real (Railway CLI)
railway logs

# Últimas 100 líneas
railway logs --tail 100
```

#### Alertas Recomendadas
1. **Disponibilidad < 99%**: Revisar logs
2. **Tiempo respuesta > 5 seg**: Optimizar modelo o escalar
3. **Error rate > 5%**: Investigar causas
4. **Memory > 80%**: Considerar upgrade de plan

### 7.2 Mantenimiento Preventivo

#### Mensual
- [ ] Revisar logs de errores
- [ ] Verificar uso de créditos Railway
- [ ] Probar endpoints principales
- [ ] Revisar métricas de uso

#### Trimestral
- [ ] Actualizar dependencias (`pip list --outdated`)
- [ ] Rotar API Key
- [ ] Revisar y actualizar documentación
- [ ] Evaluar necesidad de re-entrenar modelo

#### Anual
- [ ] Auditoría completa de seguridad
- [ ] Evaluar cambio de infraestructura
- [ ] Re-entrenamiento del modelo ML
- [ ] Optimización de performance

### 7.3 Troubleshooting

#### Problema: API no responde

**Síntomas**: Power Apps muestra error de timeout

**Diagnóstico**:
1. Verificar status en Railway Dashboard
2. Revisar logs: `railway logs --tail 50`
3. Probar endpoint directamente: `curl https://tu-url.railway.app/health`

**Soluciones**:
- Si está "dormida": Esperar 10 seg, reintentar
- Si hay error: Revisar logs y corregir código
- Si está caída: Restart desde Railway Dashboard

#### Problema: Predicciones incorrectas

**Síntomas**: Resultados no tienen sentido

**Diagnóstico**:
1. Verificar que modelo PKL sea el correcto
2. Revisar orden de características en `app.py`
3. Validar que datos de entrada estén en rangos correctos

**Soluciones**:
- Re-subir modelo correcto
- Verificar que feature order coincida con entrenamiento
- Agregar más validaciones en API

#### Problema: API Key inválida

**Síntomas**: Error 401 en Power Apps

**Diagnóstico**:
1. Verificar variable de entorno en Railway
2. Verificar API Key en conexión de Power Apps

**Soluciones**:
- Railway: Settings → Variables → Verificar `API_KEY`
- Power Apps: Data → Connections → Edit → Actualizar Key

### 7.4 Escalamiento

#### Señales de que necesitas escalar:
- Tiempo de respuesta > 3 segundos
- CPU usage promedio > 70%
- Memory usage promedio > 80%
- > 1000 requests/hora

#### Opciones:

**Opción 1: Upgrade Railway Plan**
- Starter Plan: $5/mes + uso
- Pro Plan: Custom pricing
- Más CPU, RAM, mejor SLA

**Opción 2: Optimización**
- Implementar caching con Redis
- Optimizar modelo (quantization, pruning)
- Usar modelo más ligero (si aplica)

**Opción 3: Migrar a Azure**
- Azure Functions
- Azure Container Instances
- Azure ML Endpoints
- Mejor integración con Power Platform

---

## 8. Anexos

### 8.1 Estructura de Archivos

```
proyecto/
│
├── app.py                          # API Flask principal
├── requirements.txt                # Dependencias Python
├── Procfile                        # Configuración Railway
├── runtime.txt                     # Versión Python
├── .gitignore                      # Archivos a ignorar en Git
│
├── modelo_riesgo_crediticio.pkl   # Modelo ML (no en repo público)
├── crear_modelo_ejemplo.py        # Script para crear modelo de prueba
├── datos_prueba.json              # Casos de prueba
│
├── README.md                       # Documentación rápida
├── GUIA_RAILWAY.md                # Guía detallada Railway
├── GUIA_POWER_APPS.md             # Guía detallada Power Apps
└── DOCUMENTACION_COMPLETA.md      # Este documento
```

### 8.2 Comandos Útiles

#### Git
```bash
# Inicializar repo
git init
git add .
git commit -m "Initial commit"

# Conectar con GitHub
git remote add origin https://github.com/usuario/repo.git
git push -u origin main

# Actualizar después de cambios
git add .
git commit -m "Descripción del cambio"
git push
```

#### Python
```bash
# Crear entorno virtual
python -m venv venv

# Activar (Windows)
venv\Scripts\activate

# Activar (Linux/Mac)
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Actualizar dependencias
pip list --outdated
pip install --upgrade nombre_paquete

# Generar requirements.txt
pip freeze > requirements.txt

# Ejecutar app
python app.py
```

#### Railway
```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Link proyecto
railway link

# Ver logs
railway logs

# Variables de entorno
railway variables

# Abrir en browser
railway open
```

#### Pruebas con cURL
```bash
# Health check
curl https://tu-url.railway.app/health

# Predicción
curl -X POST https://tu-url.railway.app/predict \
  -H "Content-Type: application/json" \
  -H "X-API-Key: TU_API_KEY" \
  -d @datos_prueba.json
```

### 8.3 Enlaces de Referencia

#### Documentación Oficial
- [Flask](https://flask.palletsprojects.com/)
- [scikit-learn](https://scikit-learn.org/)
- [Railway](https://docs.railway.app/)
- [Power Apps](https://learn.microsoft.com/power-apps/)
- [Custom Connectors](https://learn.microsoft.com/connectors/custom-connectors/)

#### Recursos de Aprendizaje
- [Python Flask Tutorial](https://flask.palletsprojects.com/tutorial/)
- [Machine Learning con scikit-learn](https://scikit-learn.org/stable/tutorial/)
- [Power Apps Learning Path](https://learn.microsoft.com/training/powerplatform/power-apps)

#### Comunidades
- [Railway Discord](https://discord.gg/railway)
- [Power Apps Community](https://powerusers.microsoft.com/t5/Power-Apps-Community/ct-p/PowerApps1)
- [Stack Overflow - Flask](https://stackoverflow.com/questions/tagged/flask)

### 8.4 Glosario

| Término | Definición |
|---------|------------|
| **API** | Application Programming Interface - Interfaz para comunicación entre sistemas |
| **Canvas App** | Tipo de Power App de diseño libre |
| **Custom Connector** | Conector personalizado en Power Platform |
| **DTI** | Debt-to-Income ratio - Ratio deuda/ingreso |
| **Endpoint** | URL específica de una API para operación específica |
| **FICO** | Fair Isaac Corporation - Puntaje de crédito estándar (300-850) |
| **Flask** | Framework web ligero de Python |
| **ML** | Machine Learning - Aprendizaje automático |
| **PKL** | Pickle - Formato de serialización de Python |
| **Railway** | Plataforma de deployment cloud |
| **REST** | Representational State Transfer - Arquitectura de APIs |
| **Riesgo Crediticio** | Probabilidad de que un cliente no pague un préstamo |
| **SLA** | Service Level Agreement - Acuerdo de nivel de servicio |

### 8.5 Checklist de Producción

Antes de usar en producción, verificar:

#### Seguridad
- [ ] API Key robusta (min 32 caracteres)
- [ ] API Key en variable de entorno (no en código)
- [ ] HTTPS habilitado
- [ ] CORS configurado correctamente
- [ ] Validaciones de input completas
- [ ] Error messages no exponen información sensible
- [ ] Logs no incluyen datos personales

#### Performance
- [ ] Tiempo de respuesta < 2 segundos
- [ ] Modelo carga correctamente al inicio
- [ ] Sin memory leaks
- [ ] Endpoints responden bajo carga

#### Funcionalidad
- [ ] Todos los endpoints funcionan
- [ ] Validaciones activas
- [ ] Resultados son consistentes
- [ ] Power Apps conecta correctamente
- [ ] Custom Connector autenticado

#### Operaciones
- [ ] Monitoreo configurado
- [ ] Alertas configuradas
- [ ] Documentación actualizada
- [ ] Proceso de rollback definido
- [ ] Contactos de soporte identificados

#### Compliance
- [ ] Cumple regulaciones aplicables
- [ ] Política de privacidad definida
- [ ] Términos de uso establecidos
- [ ] Auditoría de modelo realizada
- [ ] Bias assessment completado (si aplica)

---

## 📞 Soporte

Para asistencia con este proyecto:

- **Documentación**: Revisar README.md y guías específicas
- **Issues técnicos**: Revisar sección Troubleshooting
- **Railway**: https://railway.app/help
- **Power Apps**: Soporte Microsoft 365

---

## 📄 Licencia

Este proyecto es para uso educativo y demostración.

---

## 🎓 Conclusión

Has completado la implementación de un sistema end-to-end que integra:
- ✅ Machine Learning
- ✅ API REST Cloud
- ✅ Low-Code Frontend
- ✅ Seguridad empresarial

Este proyecto demuestra competencias en:
- Python/Flask development
- ML deployment
- Cloud infrastructure
- Power Platform
- API design
- DevOps básico

**¡Felicitaciones! 🎉**

---

**Última actualización**: Febrero 2026
**Versión**: 1.0
**Autor**: Julius
