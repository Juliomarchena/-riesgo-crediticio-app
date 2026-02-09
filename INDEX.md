# 📑 Índice de Archivos del Proyecto

Bienvenido al proyecto **API de Riesgo Crediticio con Power Apps**. Este índice te guía sobre qué contiene cada archivo y en qué orden usarlos.

---

## 🎯 Por Dónde Empezar

### Si quieres implementar rápido (30 minutos):
👉 **[INICIO_RAPIDO.md](INICIO_RAPIDO.md)** - Pasos condensados

### Si quieres entender todo primero:
👉 **[README.md](README.md)** → **[DOCUMENTACION_COMPLETA.md](DOCUMENTACION_COMPLETA.md)**

### Si ya tienes la API lista y solo necesitas Power Apps:
👉 **[GUIA_POWER_APPS.md](GUIA_POWER_APPS.md)**

---

## 📁 Archivos del Proyecto

### 🔧 Archivos de Código (Necesarios para la API)

#### `app.py`
**Propósito**: Código principal de la API Flask

**Qué hace**:
- Define endpoints de la API (`/`, `/health`, `/predict`)
- Carga el modelo PKL
- Valida datos de entrada
- Retorna predicciones en formato JSON
- Implementa seguridad con API Key

**Cuándo modificar**:
- Agregar nuevos endpoints
- Cambiar lógica de validación
- Agregar características adicionales
- Personalizar respuestas

**No tocar si**: La API funciona correctamente y no necesitas cambios

---

#### `requirements.txt`
**Propósito**: Lista de dependencias Python necesarias

**Contenido**:
```
Flask==3.0.0
flask-cors==4.0.0
numpy==1.24.3
pandas==2.0.3
scikit-learn==1.3.0
gunicorn==21.2.0
Werkzeug==3.0.1
```

**Cuándo modificar**:
- Agregar nuevas librerías
- Actualizar versiones (con cuidado)
- Resolver conflictos de dependencias

**Comando para usar**:
```bash
pip install -r requirements.txt
```

---

#### `Procfile`
**Propósito**: Le dice a Railway cómo ejecutar la aplicación

**Contenido**:
```
web: gunicorn app:app
```

**No modificar** a menos que cambies el servidor web o nombre del archivo principal

---

#### `runtime.txt`
**Propósito**: Especifica la versión de Python para Railway

**Contenido**:
```
python-3.11.0
```

**Modificar solo si**: Necesitas otra versión de Python (ej: 3.12)

---

#### `.gitignore`
**Propósito**: Archivos que Git debe ignorar (no subir a GitHub)

**Incluye**:
- `__pycache__/` - Archivos compilados Python
- `venv/` - Entorno virtual
- `.env` - Variables de entorno locales
- `*.log` - Archivos de log

**Cuándo modificar**: Para agregar más archivos a ignorar

---

### 🤖 Archivos de Machine Learning

#### `modelo_riesgo_crediticio.pkl`
**Propósito**: Tu modelo de ML entrenado (archivo binario)

**Importante**:
- ⚠️ **Este archivo NO está incluido** - debes agregarlo
- Debe ser un modelo scikit-learn compatible
- Debe esperar 12 características en el orden correcto

**Cómo agregarlo**:
1. Copia tu modelo entrenado aquí
2. Renómbralo a `modelo_riesgo_crediticio.pkl`
3. Verifica que carga con: `python app.py`

**Si no tienes uno**: Usa `crear_modelo_ejemplo.py` (ver abajo)

---

#### `crear_modelo_ejemplo.py`
**Propósito**: Script para crear un modelo de prueba

**Cuándo usar**:
- No tienes un modelo entrenado
- Quieres probar el sistema rápidamente
- Necesitas un placeholder temporal

**Cómo usar**:
```bash
python crear_modelo_ejemplo.py
```

**Genera**: `modelo_riesgo_crediticio.pkl` con datos sintéticos

**⚠️ Nota**: Este modelo es solo para pruebas. Reemplazar con tu modelo real en producción.

---

#### `datos_prueba.json`
**Propósito**: Casos de prueba con datos de ejemplo

**Contiene**:
- Cliente excelente (bajo riesgo)
- Cliente del documento original
- Cliente riesgoso (alto riesgo)
- Cliente medio (riesgo moderado)
- Cliente joven (sin historial)

**Cómo usar**:
- Con Postman: Importar y probar
- Con cURL: `curl ... -d @datos_prueba.json`
- Con Power Apps: Usar como valores default

---

### 📚 Archivos de Documentación

#### `README.md`
**Propósito**: Documentación principal del proyecto

**Contenido**:
- Overview del proyecto
- Instalación local
- Estructura de archivos
- Cómo probar la API
- Parámetros de entrada/salida

**Para quién**: Desarrolladores que usan el proyecto

**Leer**: ⭐⭐⭐⭐⭐ (Esencial)

---

#### `INICIO_RAPIDO.md`
**Propósito**: Guía ultra-condensada para implementar en 30 minutos

**Contenido**:
- Timeline paso a paso
- Solo comandos esenciales
- Sin explicaciones profundas
- Verificación rápida

**Para quién**: Quien tiene prisa o ya tiene experiencia

**Leer**: ⭐⭐⭐⭐⭐ (Si tienes poco tiempo)

---

#### `GUIA_RAILWAY.md`
**Propósito**: Guía detallada para desplegar en Railway

**Contenido**:
- Crear cuenta Railway
- Conectar con GitHub
- Configurar variables de entorno
- Generar dominio
- Probar deployment
- Troubleshooting Railway

**Para quién**: Primera vez desplegando en Railway

**Leer**: ⭐⭐⭐⭐⭐ (Esencial para Paso 2)

**Tiempo**: 15-20 minutos de lectura + implementación

---

#### `GUIA_POWER_APPS.md`
**Propósito**: Guía detallada para configurar Power Apps

**Contenido**:
- Crear Custom Connector paso a paso
- Configurar autenticación
- Diseñar Canvas App
- Agregar validaciones
- Casos de prueba
- Troubleshooting Power Apps

**Para quién**: Primera vez con Custom Connectors

**Leer**: ⭐⭐⭐⭐⭐ (Esencial para Paso 3)

**Tiempo**: 20-30 minutos de lectura + implementación

---

#### `DOCUMENTACION_COMPLETA.md`
**Propósito**: Documento profesional exhaustivo con TODO

**Contenido**:
1. Resumen ejecutivo
2. Arquitectura del sistema
3. Componentes técnicos detallados
4. Guía de implementación completa
5. Manual de usuario
6. Casos de uso empresariales
7. Mantenimiento y soporte
8. Anexos (comandos, glosario, checklist)

**Para quién**:
- Presentaciones profesionales
- Documentación de proyecto completo
- Reference guide
- Auditorías

**Leer**: ⭐⭐⭐⭐ (Opcional pero muy útil)

**Tiempo**: 45-60 minutos de lectura completa

---

#### `INDEX.md` (Este archivo)
**Propósito**: Guía de navegación de todos los archivos

**Para quién**: Tú, ahora mismo 😊

---

## 🗺️ Rutas de Aprendizaje

### Ruta 1: "Necesito esto YA" (30 min)
1. `INICIO_RAPIDO.md` (leer 5 min)
2. Ejecutar comandos
3. Listo

### Ruta 2: "Quiero entender qué estoy haciendo" (2 horas)
1. `README.md` (10 min)
2. `GUIA_RAILWAY.md` (20 min)
3. Implementar Railway (20 min)
4. `GUIA_POWER_APPS.md` (30 min)
5. Implementar Power Apps (30 min)
6. Probar (10 min)

### Ruta 3: "Necesito presentar esto profesionalmente" (3 horas)
1. `README.md` (10 min)
2. `DOCUMENTACION_COMPLETA.md` (60 min)
3. Implementar todo (90 min)
4. Preparar demo (20 min)

### Ruta 4: "Quiero modificar y personalizar" (4+ horas)
1. Leer todo
2. Entender `app.py` a fondo
3. Modificar según necesidades
4. Re-desplegar
5. Actualizar documentación

---

## 📊 Matriz de Archivos

| Archivo | Tipo | Necesario | Modificable | Para Quién |
|---------|------|-----------|-------------|------------|
| `app.py` | Código | ✅ Sí | ⚠️ Con cuidado | Developers |
| `requirements.txt` | Config | ✅ Sí | ⚠️ Con cuidado | DevOps |
| `Procfile` | Config | ✅ Sí | ❌ No | Railway |
| `runtime.txt` | Config | ✅ Sí | ⚠️ Versión Python | Railway |
| `.gitignore` | Config | ✅ Sí | ✅ Sí | Git |
| `modelo_riesgo_crediticio.pkl` | ML | ✅ **Tú lo creas** | ✅ Tu modelo | Data Scientists |
| `crear_modelo_ejemplo.py` | Utility | 📦 Opcional | ✅ Sí | Testing |
| `datos_prueba.json` | Data | 📦 Opcional | ✅ Sí | Testing |
| `README.md` | Docs | 📖 Leer | ✅ Personalizar | Todos |
| `INICIO_RAPIDO.md` | Docs | 📖 Leer | ❌ No | Prisa |
| `GUIA_RAILWAY.md` | Docs | 📖 Leer | ❌ No | DevOps |
| `GUIA_POWER_APPS.md` | Docs | 📖 Leer | ❌ No | Power Platform |
| `DOCUMENTACION_COMPLETA.md` | Docs | 📖 Leer | ✅ Personalizar | Presentaciones |
| `INDEX.md` | Docs | 📖 Leer | ❌ No | Navegación |

---

## 🎯 Checklist de Implementación

### Antes de empezar:
- [ ] Leí `README.md`
- [ ] Tengo Python 3.11+ instalado
- [ ] Tengo Git instalado
- [ ] Tengo cuenta GitHub
- [ ] Tengo cuenta Railway (o voy a crear)
- [ ] Tengo cuenta Power Apps (M365)

### Archivos necesarios:
- [ ] `app.py` ✅ (ya está)
- [ ] `requirements.txt` ✅ (ya está)
- [ ] `Procfile` ✅ (ya está)
- [ ] `runtime.txt` ✅ (ya está)
- [ ] `modelo_riesgo_crediticio.pkl` ⚠️ (necesito crear/copiar)

### Implementación:
- [ ] Modelo PKL en la carpeta
- [ ] Probé localmente (`python app.py`)
- [ ] Subí a GitHub
- [ ] Desplegué en Railway
- [ ] Configuré variables de entorno
- [ ] Probé endpoint `/health`
- [ ] Probé endpoint `/predict`
- [ ] Creé Custom Connector
- [ ] Creé Power App
- [ ] Probé end-to-end

---

## 🆘 Si te pierdes...

1. **Problema técnico**: Revisar `GUIA_RAILWAY.md` o `GUIA_POWER_APPS.md` sección Troubleshooting
2. **No entiendo concepto**: Leer `DOCUMENTACION_COMPLETA.md` sección correspondiente
3. **Necesito referencia rápida**: Ver `README.md`
4. **Quiero empezar de nuevo**: Seguir `INICIO_RAPIDO.md` desde el inicio

---

## 📞 Siguiente Paso

**Ahora mismo, deberías**:

1. Si tienes tu modelo:
   ```bash
   # Copiar tu modelo aquí
   cp /ruta/a/tu/modelo.pkl modelo_riesgo_crediticio.pkl
   ```

2. Si NO tienes modelo:
   ```bash
   python crear_modelo_ejemplo.py
   ```

3. Probar localmente:
   ```bash
   python app.py
   # En otra terminal:
   curl http://localhost:5000/health
   ```

4. Si funciona, seguir con:
   - **Opción A**: `INICIO_RAPIDO.md` (rápido)
   - **Opción B**: `GUIA_RAILWAY.md` (detallado)

---

## 🎉 ¡Éxito!

Cuando completes todo, tendrás:
- ✅ API de ML en la nube
- ✅ Power App funcional
- ✅ Documentación profesional
- ✅ Sistema listo para demo/producción

**Tiempo total estimado**: 1-3 horas dependiendo de experiencia

---

**Última actualización**: Febrero 2026
**Archivos totales**: 14
**Líneas de código**: ~500
**Líneas de documentación**: ~3000
