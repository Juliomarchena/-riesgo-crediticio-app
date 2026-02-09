# 🚀 Inicio Rápido - En 30 Minutos a Producción

Esta guía te llevará de cero a una API funcionando en Power Apps en 30 minutos.

---

## ⏱️ Timeline

- **Minutos 0-5**: Preparar modelo y repositorio
- **Minutos 5-10**: Subir a GitHub
- **Minutos 10-20**: Desplegar en Railway
- **Minutos 20-30**: Configurar Power Apps

---

## 📦 Paso 1: Preparar Modelo (5 minutos)

### Opción A: Tienes tu modelo
```bash
# Asegúrate de tener modelo_riesgo_crediticio.pkl en la carpeta
ls modelo_riesgo_crediticio.pkl
```

### Opción B: Crear modelo de ejemplo
```bash
python crear_modelo_ejemplo.py
```

---

## 🌐 Paso 2: Subir a GitHub (5 minutos)

```bash
# 1. Inicializar Git
git init

# 2. Agregar archivos
git add .

# 3. Commit
git commit -m "API Riesgo Crediticio v1.0"

# 4. Crear repo en GitHub (ir a github.com)
# Click en "New repository" → nombre: "api-riesgo-crediticio"

# 5. Conectar y subir (reemplaza TU_USUARIO)
git remote add origin https://github.com/TU_USUARIO/api-riesgo-crediticio.git
git branch -M main
git push -u origin main
```

---

## 🚂 Paso 3: Desplegar en Railway (10 minutos)

### 3.1 Crear proyecto (3 min)
1. Ir a [railway.app](https://railway.app)
2. Login con GitHub
3. **New Project** → **Deploy from GitHub repo**
4. Seleccionar `api-riesgo-crediticio`
5. Esperar build (2-3 minutos)

### 3.2 Configurar (2 min)
1. Click en tu servicio
2. **Variables** tab
3. **+ New Variable**:
   ```
   API_KEY = MiClaveSecreta123_CambiarEnProduccion
   ```
4. **Add**

### 3.3 Generar dominio (1 min)
1. **Settings** tab
2. **Networking** section
3. **Generate Domain**
4. **Copiar URL**: `https://api-riesgo-crediticio-production-abc123.up.railway.app`

### 3.4 Verificar (1 min)
```bash
curl https://TU-URL.railway.app/health
```

Respuesta esperada:
```json
{"status": "healthy", "modelo_cargado": true}
```

---

## 🎨 Paso 4: Configurar Power Apps (10 minutos)

### 4.1 Custom Connector (5 min)

1. Ir a [make.powerapps.com](https://make.powerapps.com)
2. **More** → **Custom Connectors** → **+ New**
3. **Create from blank**

**General**:
- Name: `RiesgoCrediticioAPI`
- Host: `api-riesgo-crediticio-production-abc123.up.railway.app` (sin https://)

**Security**:
- Auth type: **API Key**
- Parameter label: `API Key`
- Parameter name: `X-API-Key`
- Parameter location: **Header**

**Definition**:
- **+ New action**
- Summary: `Predecir Riesgo Crediticio`
- Operation ID: `PredecirRiesgo`
- **+ Import from sample**:
  - Verb: POST
  - URL: `https://TU-URL.railway.app/predict`
  - Body:
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
  - Click **Import**

**Test**:
- **+ New connection**
- API Key: `MiClaveSecreta123_CambiarEnProduccion`
- **Test operation** con datos de ejemplo
- Si funciona → **Create connector**

### 4.2 Power App Básica (5 min)

1. **Create** → **Canvas app from blank**
2. Name: `Evaluador Riesgo Crediticio`, Format: **Tablet**

**Agregar datos**:
- **Data** → **+ Add data** → Buscar `RiesgoCrediticioAPI`

**Interfaz mínima**:

1. **Label título**:
   - Text: `"Evaluador de Riesgo Crediticio"`

2. **12 Text inputs** con valores default:
   - `txtFICO`: "737"
   - `txtIntRate`: "0.1357"
   - `txtDTI`: "19.48"
   - (etc... usar valores de ejemplo)

3. **Botón Evaluar**:
   - Text: `"Evaluar"`
   - OnSelect:
   ```javascript
   Set(varResultado,
       RiesgoCrediticioAPI.PredecirRiesgo({
           credit_policy: Value(txtCreditPolicy.Text),
           int_rate: Value(txtIntRate.Text),
           installment: Value(txtInstallment.Text),
           log_annual_inc: Value(txtLogAnnualInc.Text),
           dti: Value(txtDTI.Text),
           fico: Value(txtFICO.Text),
           days_with_cr_line: Value(txtDaysWithCrLine.Text),
           revol_bal: Value(txtRevolBal.Text),
           revol_util: Value(txtRevolUtil.Text),
           inq_last_6mths: Value(txtInqLast6Mths.Text),
           delinq_2yrs: Value(txtDelinq2Yrs.Text),
           pub_rec: Value(txtPubRec.Text)
       })
   )
   ```

4. **Label resultado**:
   - Text: `varResultado.riesgo`
   - Color:
   ```javascript
   If(varResultado.prediccion = 0, Color.Green, Color.Red)
   ```

5. **Label confianza**:
   - Text: `"Confianza: " & varResultado.confianza`

**Probar**:
- Click en botón Evaluar
- Debería mostrar "No Riesgoso" en verde

**Publicar**:
- **File** → **Save** → **Publish**

---

## ✅ Verificación Final (2 minutos)

### Checklist:
- [ ] API en Railway responde `/health`
- [ ] Custom Connector creado y testeado
- [ ] Power App muestra resultados
- [ ] Colores cambian según riesgo

### Probar casos:

**Cliente Bueno** (debería ser verde):
```
FICO: 780, int_rate: 0.08, dti: 12.5
```

**Cliente Malo** (debería ser rojo):
```
FICO: 520, int_rate: 0.28, dti: 45.0
```

---

## 🎉 ¡Listo!

Tu sistema está funcionando. Ahora puedes:

1. **Compartir**: File → Share → Agregar usuarios
2. **Mejorar diseño**: Agregar más pantallas, gráficos, etc.
3. **Integrar**: Conectar con SharePoint, Teams, etc.

---

## 📚 Próximos Pasos

Para ir más allá:

1. **Mejorar UI**: Ver [GUIA_POWER_APPS.md](GUIA_POWER_APPS.md) sección de diseño avanzado
2. **Agregar historial**: Guardar consultas en SharePoint
3. **Notificaciones**: Power Automate para alertas
4. **Dashboard**: Power BI para analytics
5. **Chatbot**: Copilot Studio para conversacional

---

## ⚠️ Notas Importantes

- **Costo**: Railway $5-10/mes después del trial
- **Seguridad**: Cambiar API Key antes de producción
- **Modelo**: Este usa modelo de ejemplo, reemplazar con tu modelo real
- **Licencias**: Power Apps requiere licencia M365 o Per App

---

## 🆘 Si algo falla

### Railway no despliega
```bash
# Ver logs
railway logs

# Causas comunes:
# - Falta modelo PKL
# - Error en requirements.txt
# - Python version incompatible
```

### Power Apps no conecta
- Verificar URL de Railway correcta
- Verificar API Key match
- Probar endpoint en Postman primero

### Predicciones raras
- Verificar orden de features en app.py
- Verificar que modelo PKL sea el correcto
- Revisar validaciones de entrada

---

## 📞 Ayuda

Ver documentación completa en:
- [README.md](README.md) - Overview del proyecto
- [GUIA_RAILWAY.md](GUIA_RAILWAY.md) - Railway detallado
- [GUIA_POWER_APPS.md](GUIA_POWER_APPS.md) - Power Apps detallado
- [DOCUMENTACION_COMPLETA.md](DOCUMENTACION_COMPLETA.md) - Todo

---

**Tiempo total**: ~30 minutos
**Dificultad**: Intermedia
**Resultado**: API ML en producción + Power App funcional

¡Éxito! 🚀
