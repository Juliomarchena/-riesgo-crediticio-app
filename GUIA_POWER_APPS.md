# 🎨 Guía Completa: Power Apps Custom Connector

Esta guía te llevará paso a paso para conectar tu API de Railway con Power Apps mediante un Custom Connector.

## 📋 Requisitos Previos

- ✅ API desplegada en Railway (completar `GUIA_RAILWAY.md` primero)
- ✅ URL de tu API (ej: `https://api-riesgo-crediticio-production.up.railway.app`)
- ✅ API Key configurada
- ✅ Cuenta en [Power Apps](https://make.powerapps.com) (licencia Microsoft 365 o trial)

---

## 🔌 PARTE 1: Crear Custom Connector

### PASO 1.1: Acceder a Custom Connectors

1. Ve a [make.powerapps.com](https://make.powerapps.com)
2. En el menú izquierdo:
   - Click en **"More"** (Más) o **"Dataverse"**
   - Selecciona **"Custom Connectors"** (Conectores personalizados)
3. Click en **"+ New custom connector"** (Nuevo conector personalizado)
4. Selecciona **"Create from blank"** (Crear desde cero)

### PASO 1.2: Configurar General Tab

**Connector name (Nombre del conector)**:
```
RiesgoCrediticioAPI
```

**Description (Descripción)**:
```
Conector para evaluar riesgo crediticio usando Machine Learning. Integra modelo PKL vía Railway con Power Apps.
```

**Scheme (Esquema)**:
- Seleccionar: **HTTPS** (default)

**Host**:
```
api-riesgo-crediticio-production-abc123.up.railway.app
```
⚠️ **IMPORTANTE**: Reemplaza con tu dominio de Railway **sin** el `https://`

**Base URL**:
```
/
```

**Icon** (opcional):
- Puedes subir un ícono personalizado (banco, dinero, etc.)

Click **"Security"** (Seguridad) para continuar →

---

### PASO 1.3: Configurar Security Tab

**Authentication type**:
- Selecciona: **API Key**

**Parameter label**:
```
API Key
```

**Parameter name**:
```
X-API-Key
```

**Parameter location**:
- Selecciona: **Header**

Click **"Definition"** para continuar →

---

### PASO 1.4: Configurar Definition Tab

Aquí crearemos la acción que llamará a `/predict`

#### Crear nueva acción:

1. Click en **"+ New action"**
2. **General**:

| Campo | Valor |
|-------|-------|
| **Summary** | Predecir Riesgo Crediticio |
| **Description** | Evalúa el riesgo crediticio de un cliente basado en 12 características financieras |
| **Operation ID** | PredecirRiesgo |
| **Visibility** | important |

#### Request (Solicitud):

3. Click en **"+ Import from sample"**
4. Configurar:

**Verb**: `POST`

**URL**:
```
https://TU-DOMINIO.railway.app/predict
```

**Headers**:
```
Content-Type: application/json
```

**Body** (copiar exactamente):
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

5. Click **"Import"**

#### Mejorar parámetros del Request:

Power Apps habrá creado automáticamente los parámetros del body. Vamos a mejorar sus descripciones:

6. Click en **"Body"** para expandir
7. Edita cada parámetro:

| Parámetro | Description | Required | Type |
|-----------|-------------|----------|------|
| `credit_policy` | Política de crédito (0 o 1) | Yes | integer |
| `int_rate` | Tasa de interés (0-1) | Yes | number |
| `installment` | Cuota mensual en dólares | Yes | number |
| `log_annual_inc` | Logaritmo del ingreso anual | Yes | number |
| `dti` | Ratio deuda/ingreso (%) | Yes | number |
| `fico` | Puntaje FICO (300-850) | Yes | integer |
| `days_with_cr_line` | Días con línea de crédito | Yes | number |
| `revol_bal` | Balance revolving | Yes | number |
| `revol_util` | Utilización revolving (%) | Yes | number |
| `inq_last_6mths` | Consultas últimos 6 meses | Yes | integer |
| `delinq_2yrs` | Morosidades últimos 2 años | Yes | integer |
| `pub_rec` | Registros públicos negativos | Yes | integer |

#### Response (Respuesta):

8. Scroll down a **"Response"**
9. Click **"+ Add default response"**
10. Click en **"+ Import from sample"**
11. **Body** (copiar):

```json
{
  "prediccion": 0,
  "riesgo": "No Riesgoso",
  "nivel_riesgo": "Bajo",
  "color_recomendado": "green",
  "probabilidad_no_riesgo": 97.66,
  "probabilidad_riesgo": 2.34,
  "confianza": "97.66%",
  "recomendacion": "Cliente excelente - Aprobar crédito con condiciones favorables",
  "datos_recibidos": {
    "fico": 737,
    "int_rate": 0.1357,
    "dti": 19.48
  }
}
```

12. Click **"Import"**

Click **"Test"** (Probar) para continuar →

---

### PASO 1.5: Test Tab (Probar)

#### Crear conexión:

1. Click **"+ New connection"**
2. En el popup:
   - **API Key**: Ingresa tu API Key de Railway
   - Ejemplo: `RiesgoCrediticio2024_SecureKey_987`
3. Click **"Create connection"**

#### Probar la acción:

4. Refresca la página si no aparece la conexión
5. Selecciona la conexión creada
6. En **"PredecirRiesgo"**, ingresa valores de prueba:

```
credit_policy: 1
int_rate: 0.1357
installment: 366.86
log_annual_inc: 11.35
dti: 19.48
fico: 737
days_with_cr_line: 5639.96
revol_bal: 28854
revol_util: 52.10
inq_last_6mths: 1
delinq_2yrs: 0
pub_rec: 0
```

7. Click **"Test operation"**

**✅ Respuesta exitosa (Status 200)**:
```json
{
  "prediccion": 0,
  "riesgo": "No Riesgoso",
  "nivel_riesgo": "Bajo",
  ...
}
```

8. Si el test es exitoso, click en **"Create connector"** (arriba a la derecha)

---

## 🎨 PARTE 2: Crear la Power App

### PASO 2.1: Crear nueva Canvas App

1. Ve a [make.powerapps.com](https://make.powerapps.com)
2. Click en **"Create"** (Crear) en el menú izquierdo
3. Selecciona **"Canvas app from blank"** (Aplicación de lienzo en blanco)
4. Configurar:
   - **App name**: `Evaluador Riesgo Crediticio`
   - **Format**: Tablet (o Phone si prefieres)
5. Click **"Create"**

### PASO 2.2: Agregar el Custom Connector

1. En Power Apps Studio, click en el ícono de **"Data"** (base de datos) en el panel izquierdo
2. Click **"+ Add data"**
3. Busca: `RiesgoCrediticioAPI`
4. Selecciónalo y se agregará tu conexión existente

### PASO 2.3: Diseñar la Interfaz - Screen1 (Formulario)

#### Agregar título:

1. **Insert** → **Label**
2. Propiedades:
   - **Text**: `"🏦 Evaluador de Riesgo Crediticio"`
   - **Font size**: 24
   - **Font weight**: Bold
   - **Align**: Center
   - **Position**: Top center

#### Agregar inputs numéricos:

Para cada campo, agrega un **Text input**:

**Insert** → **Input** → **Text input** (12 veces)

Renombra y configura cada uno:

| Control Name | Label (agregar) | Default | Format |
|--------------|-----------------|---------|--------|
| `txtCreditPolicy` | "Política de Crédito (0 o 1)" | "1" | Number |
| `txtIntRate` | "Tasa de Interés (0-1)" | "0.1357" | Number |
| `txtInstallment` | "Cuota Mensual ($)" | "366.86" | Number |
| `txtLogAnnualInc` | "Log Ingreso Anual" | "11.35" | Number |
| `txtDTI` | "Ratio Deuda/Ingreso (%)" | "19.48" | Number |
| `txtFICO` | "Puntaje FICO (300-850)" | "737" | Number |
| `txtDaysWithCrLine` | "Días con Línea de Crédito" | "5639.96" | Number |
| `txtRevolBal` | "Balance Revolving ($)" | "28854" | Number |
| `txtRevolUtil` | "Utilización Revolving (%)" | "52.10" | Number |
| `txtInqLast6Mths` | "Consultas Últimos 6 Meses" | "1" | Number |
| `txtDelinq2Yrs` | "Morosidades Últimos 2 Años" | "0" | Number |
| `txtPubRec` | "Registros Públicos Negativos" | "0" | Number |

**💡 TIP**: Usa **"Insert"** → **Container** → **Vertical gallery** para organizar mejor

#### Agregar botón de evaluación:

1. **Insert** → **Button**
2. Propiedades:
   - **Text**: `"🔍 Evaluar Riesgo"`
   - **OnSelect** (copiar este código):

```javascript
ClearCollect(
    colResultado,
    RiesgoCrediticioAPI.PredecirRiesgo(
        {
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
        }
    )
);
Navigate(ScreenResultado, ScreenTransition.Cover)
```

### PASO 2.4: Diseñar Screen2 (Resultados)

1. **Insert** → **New screen** → **Blank**
2. Renombrar a `ScreenResultado`

#### Agregar elementos visuales:

**1. Título del resultado**:
- **Insert** → **Label**
- **Text**: `First(colResultado).riesgo`
- **Font size**: 36
- **Font weight**: Bold
- **Color**:
```javascript
If(
    First(colResultado).prediccion = 0,
    Color.Green,
    Color.Red
)
```

**2. Nivel de riesgo**:
- **Insert** → **Label**
- **Text**: `"Nivel: " & First(colResultado).nivel_riesgo`
- **Font size**: 24

**3. Confianza**:
- **Insert** → **Label**
- **Text**: `"Confianza: " & First(colResultado).confianza`
- **Font size**: 20

**4. Probabilidad de riesgo**:
- **Insert** → **Label**
- **Text**:
```javascript
"Probabilidad de Riesgo: " & Text(First(colResultado).probabilidad_riesgo, "##.##") & "%"
```

**5. Recomendación**:
- **Insert** → **Label**
- **Text**: `First(colResultado).recomendacion`
- **Font size**: 16
- **Word wrap**: On
- **Width**: Screen.Width - 40

**6. Gráfico circular (opcional)**:
- **Insert** → **Charts** → **Pie chart**
- **Items**:
```javascript
Table(
    {Label: "Sin Riesgo", Value: First(colResultado).probabilidad_no_riesgo},
    {Label: "Riesgo", Value: First(colResultado).probabilidad_riesgo}
)
```

**7. Botón de regreso**:
- **Insert** → **Button**
- **Text**: `"← Nueva Evaluación"`
- **OnSelect**: `Navigate(Screen1, ScreenTransition.UnCover)`

### PASO 2.5: Agregar Validaciones

En Screen1, antes del botón, agrega validación:

**Label de error**:
- **Text**:
```javascript
If(
    Value(txtFICO.Text) < 300 || Value(txtFICO.Text) > 850,
    "⚠️ FICO debe estar entre 300 y 850",
    If(
        Value(txtIntRate.Text) < 0 || Value(txtIntRate.Text) > 1,
        "⚠️ Tasa de interés debe estar entre 0 y 1",
        ""
    )
)
```
- **Color**: Red
- **Visible**: `Self.Text <> ""`

**Deshabilitar botón si hay errores**:
- Botón **DisplayMode**:
```javascript
If(
    Value(txtFICO.Text) >= 300 && Value(txtFICO.Text) <= 850 &&
    Value(txtIntRate.Text) >= 0 && Value(txtIntRate.Text) <= 1,
    DisplayMode.Edit,
    DisplayMode.Disabled
)
```

---

## 🎨 PARTE 3: Mejoras Opcionales

### Opción 1: Agregar Dropdowns

Para `credit_policy`:
```javascript
Dropdown con Items = ["0 - No cumple", "1 - Cumple"]
```

### Opción 2: Sliders para FICO

```javascript
Insert → Slider
Min: 300
Max: 850
Default: 700
lblFICOValue.Text: Slider1.Value
```

### Opción 3: Historial de Consultas

En Screen2, agregar:
```javascript
// Guardar en colección de historial
Collect(
    colHistorial,
    {
        Fecha: Now(),
        FICO: Value(txtFICO.Text),
        Resultado: First(colResultado).riesgo,
        Confianza: First(colResultado).confianza
    }
)
```

Mostrar tabla de historial:
- **Insert** → **Data table**
- **Items**: `colHistorial`

---

## 📱 PARTE 4: Publicar y Compartir

### PASO 4.1: Guardar y Publicar

1. Click en **File** (Archivo) → **Save**
2. Click en **Publish** (Publicar)
3. Click **Publish this version**

### PASO 4.2: Compartir la App

1. Click en **Share** (Compartir)
2. Ingresa emails de los usuarios
3. Selecciona permisos:
   - **Can use**: Usuario final
   - **Can edit**: Co-desarrollador
4. Click **Share**

### PASO 4.3: Probar en el Teléfono

1. Descarga **Power Apps** desde:
   - [App Store (iOS)](https://apps.apple.com/app/powerapps/id1047318566)
   - [Google Play (Android)](https://play.google.com/store/apps/details?id=com.microsoft.msapps)
2. Inicia sesión con tu cuenta
3. Verás tu app `Evaluador Riesgo Crediticio`
4. Ábrela y prueba

---

## 🧪 PARTE 5: Casos de Prueba

### Caso 1: Cliente Excelente ✅
```
FICO: 780
Int Rate: 0.08
DTI: 12.5
→ Resultado esperado: "No Riesgoso" (>95% confianza)
```

### Caso 2: Cliente Riesgoso ❌
```
FICO: 520
Int Rate: 0.28
DTI: 48.0
→ Resultado esperado: "Riesgoso" (>80% confianza)
```

### Caso 3: Cliente Frontera ⚠️
```
FICO: 650
Int Rate: 0.18
DTI: 32.0
→ Resultado esperado: Variable (revisar nivel de riesgo)
```

---

## 🐛 Troubleshooting

### ❌ Error: "The connector operation failed"

**Causa**: API Key incorrecta o API caída

**Solución**:
1. Verifica API Key en la conexión
2. Prueba la API directamente en Postman
3. Revisa logs de Railway

### ❌ Error: "Request timeout"

**Causa**: La API está "dormida" (Railway sleep mode)

**Solución**:
- Espera ~10 segundos y reintenta
- Desactiva "Sleep when idle" en Railway Settings

### ❌ Los valores no se envían correctamente

**Causa**: Formato de datos incorrecto

**Solución**:
- Usa `Value()` para convertir texto a número
- Ejemplo: `Value(txtFICO.Text)` en lugar de `txtFICO.Text`

---

## 📊 PARTE 6: (Opcional) Integrar con Power Automate

### Crear Flow para notificaciones:

1. **Power Automate** → **Create** → **Automated flow**
2. **Trigger**: PowerApps V2
3. **Condition**:
   - Si `prediccion = 1` (Riesgoso)
4. **Action**:
   - Enviar email a gerente de crédito
   - Crear registro en Excel/SharePoint
   - Notificación Teams

---

## ✅ Checklist Final

Antes de presentar, verifica:

- ✅ Custom Connector creado y probado
- ✅ Power App con todas las pantallas
- ✅ Validaciones funcionando
- ✅ Resultados se muestran correctamente
- ✅ Colores dinámicos (verde/rojo) funcionan
- ✅ App publicada y compartida
- ✅ Casos de prueba validados

---

## 🎓 Para la Presentación

### Demostración sugerida:

1. **Introducción** (1 min):
   - "Voy a mostrar cómo evaluar riesgo crediticio con IA"

2. **Caso de éxito** (2 min):
   - Ingresar datos de cliente excelente
   - Mostrar resultado "No Riesgoso" con alta confianza

3. **Caso de riesgo** (2 min):
   - Ingresar datos de cliente problemático
   - Mostrar resultado "Riesgoso" con recomendación

4. **Arquitectura** (1 min):
   - Mostrar flujo: Power Apps → Railway → Modelo ML

---

## 📚 Próximo Paso (Opcional)

Si quieres agregar Copilot Studio:

👉 **Ver documento**: "Solución Completa Modelo PKL a Po.txt" (sección de Copilot Studio)

---

## 🎉 ¡Felicitaciones!

Has creado una aplicación empresarial completa que integra:
- ✅ Machine Learning (modelo PKL)
- ✅ Backend cloud (Railway)
- ✅ Frontend low-code (Power Apps)
- ✅ API REST (Flask)
- ✅ Autenticación (API Key)

¡Tu proyecto está listo para presentar! 🚀
