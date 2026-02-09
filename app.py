from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)  # Permite que Power Apps llame a tu API

# Cargar variables de entorno
load_dotenv()
API_KEY = os.getenv('API_KEY', 'mi-clave-super-secreta-2026')

# Cargar el modelo al iniciar
try:
    with open('modelo_riesgo_crediticio.pkl', 'rb') as file:
        modelo = pickle.load(file)
    print("✅ Modelo cargado exitosamente")
except Exception as e:
    print(f"⚠️ Error al cargar modelo: {e}")
    modelo = None

def require_api_key(f):
    """Decorador para validar API Key"""
    from functools import wraps
    @wraps(f)
    def decorated_function(*args, **kwargs):
        api_key = request.headers.get('X-API-Key')
        if api_key != API_KEY:
            return jsonify({
                'error': 'API key inválida o faltante',
                'mensaje': 'Incluye el header X-API-Key con tu clave'
            }), 401
        return f(*args, **kwargs)
    return decorated_function

@app.route('/', methods=['GET'])
def home():
    """Endpoint principal - información de la API"""
    return jsonify({
        "mensaje": "🏦 API de Riesgo Crediticio - Activa",
        "version": "2.0",
        "autor": "Julius",
        "endpoints": {
            "/": "Información de la API",
            "/health": "Estado de salud del servicio",
            "/predict": "Realizar predicción (POST con datos del cliente)",
            "/test": "Obtener datos de ejemplo"
        },
        "nota": "Endpoint /predict requiere API Key en header X-API-Key"
    }), 200

@app.route('/health', methods=['GET'])
def health():
    """Health check para Railway"""
    modelo_cargado = modelo is not None
    return jsonify({
        'status': 'healthy' if modelo_cargado else 'unhealthy',
        'modelo_cargado': modelo_cargado,
        'caracteristicas_esperadas': 19 if modelo_cargado else None
    }), 200 if modelo_cargado else 503

def transformar_caracteristicas(datos):
    """
    Transforma los datos de entrada al formato que espera el modelo (19 características)
    """
    # Extraer valores base
    credit_policy = float(datos.get('credit_policy', 1))
    purpose = datos.get('purpose', 'debt_consolidation').lower()
    int_rate = float(datos.get('int_rate', 0))
    installment = float(datos.get('installment', 0))
    log_annual_inc = float(datos.get('log_annual_inc', 0))
    dti = float(datos.get('dti', 0))
    fico = float(datos.get('fico', 700))
    days_with_cr_line = float(datos.get('days_with_cr_line', 0))
    revol_bal = float(datos.get('revol_bal', 0))
    revol_util = float(datos.get('revol_util', 0))
    inq_last_6mths = int(datos.get('inq_last_6mths', 0))
    delinq_2yrs = int(datos.get('delinq_2yrs', 0))
    pub_rec = int(datos.get('pub_rec', 0))
    
    # Transformaciones especiales
    # Binning de inq_last_6mths (simplificado)
    inq_last_6mths_binned = 1 if inq_last_6mths > 0 else 0
    
    # Binning de delinq_2yrs
    delinq_2yrs_binned = 1 if delinq_2yrs > 0 else 0
    
    # Binning de pub_rec
    pub_rec_binned = 1 if pub_rec > 0 else 0
    
    # Log de revol_bal (evitar log(0))
    log_revol_bal = np.log1p(revol_bal)  # log1p(x) = log(1+x)
    
    # One-hot encoding de purpose
    purpose_map = {
        'credit_card': [1, 0, 0, 0, 0, 0],
        'debt_consolidation': [0, 1, 0, 0, 0, 0],
        'educational': [0, 0, 1, 0, 0, 0],
        'home_improvement': [0, 0, 0, 1, 0, 0],
        'major_purchase': [0, 0, 0, 0, 1, 0],
        'small_business': [0, 0, 0, 0, 0, 1],
        'all_other': [0, 0, 0, 0, 0, 0]  # Caso base
    }
    
    purpose_encoded = purpose_map.get(purpose, [0, 0, 0, 0, 0, 0])
    
    # Construir array de 19 características EN EL ORDEN CORRECTO
    caracteristicas = [
        credit_policy,           # 0: credit.policy
        0,                       # 1: purpose (no usado, solo las one-hot)
        int_rate,                # 2: int.rate
        installment,             # 3: installment
        log_annual_inc,          # 4: log.annual.inc
        dti,                     # 5: dti
        fico,                    # 6: fico
        days_with_cr_line,       # 7: days.with.cr.line
        revol_util,              # 8: revol.util
        inq_last_6mths_binned,   # 9: inq.last.6mths_binned
        delinq_2yrs_binned,      # 10: delinq.2yrs_binned
        pub_rec_binned,          # 11: pub.rec_binned
        log_revol_bal,           # 12: log_revol_bal
        purpose_encoded[0],      # 13: purpose_credit_card
        purpose_encoded[1],      # 14: purpose_debt_consolidation
        purpose_encoded[2],      # 15: purpose_educational
        purpose_encoded[3],      # 16: purpose_home_improvement
        purpose_encoded[4],      # 17: purpose_major_purchase
        purpose_encoded[5]       # 18: purpose_small_business
    ]
    
    return np.array(caracteristicas).reshape(1, -1)

@app.route('/predict', methods=['POST'])
@require_api_key
def predict():
    """
    Endpoint principal de predicción
    
    Campos requeridos:
    - credit_policy: 0 o 1
    - purpose: "debt_consolidation", "credit_card", "home_improvement", etc.
    - int_rate: Tasa de interés (0-1)
    - installment: Monto de cuota mensual
    - log_annual_inc: Log del ingreso anual
    - dti: Ratio deuda/ingreso
    - fico: Puntaje FICO (300-850)
    - days_with_cr_line: Días con línea de crédito
    - revol_bal: Balance revolving
    - revol_util: Utilización revolving (%)
    - inq_last_6mths: Consultas últimos 6 meses
    - delinq_2yrs: Morosidades últimos 2 años
    - pub_rec: Registros públicos negativos
    """
    try:
        # Validar que el modelo esté cargado
        if modelo is None:
            return jsonify({
                'error': 'Modelo no disponible',
                'mensaje': 'El modelo PKL no se pudo cargar'
            }), 503

        # Recibir datos del cliente
        datos = request.get_json()

        if not datos:
            return jsonify({
                'error': 'Datos faltantes',
                'mensaje': 'Envía un JSON con las características del cliente'
            }), 400

        # Validaciones básicas
        fico = float(datos.get('fico', 700))
        int_rate = float(datos.get('int_rate', 0))
        
        if not (300 <= fico <= 850):
            return jsonify({
                'error': 'Validación fallida',
                'mensaje': 'El puntaje FICO debe estar entre 300 y 850'
            }), 400

        if not (0 <= int_rate <= 1):
            return jsonify({
                'error': 'Validación fallida',
                'mensaje': 'La tasa de interés debe estar entre 0 y 1'
            }), 400

        # Transformar datos a las 19 características
        X = transformar_caracteristicas(datos)

        # Realizar predicción
        prediccion = modelo.predict(X)[0]
        probabilidad = modelo.predict_proba(X)[0]

        # Determinar nivel de riesgo
        prob_riesgo = float(probabilidad[1])
        if prob_riesgo < 0.3:
            nivel_riesgo = "Bajo"
            color = "green"
        elif prob_riesgo < 0.7:
            nivel_riesgo = "Medio"
            color = "yellow"
        else:
            nivel_riesgo = "Alto"
            color = "red"

        # Preparar respuesta detallada
        resultado = {
            'prediccion': int(prediccion),
            'riesgo': 'No Riesgoso' if prediccion == 0 else 'Riesgoso',
            'nivel_riesgo': nivel_riesgo,
            'color_recomendado': color,
            'probabilidad_no_riesgo': round(float(probabilidad[0]) * 100, 2),
            'probabilidad_riesgo': round(float(probabilidad[1]) * 100, 2),
            'confianza': f"{round(max(probabilidad) * 100, 2)}%",
            'recomendacion': generar_recomendacion(prediccion, prob_riesgo, fico, datos.get('dti', 0)),
            'datos_recibidos': {
                'fico': int(fico),
                'int_rate': round(int_rate, 4),
                'dti': round(float(datos.get('dti', 0)), 2),
                'purpose': datos.get('purpose', 'debt_consolidation')
            }
        }

        return jsonify(resultado), 200

    except Exception as e:
        return jsonify({
            'error': 'Error interno del servidor',
            'mensaje': str(e),
            'tipo': type(e).__name__
        }), 500

def generar_recomendacion(prediccion, prob_riesgo, fico, dti):
    """Genera recomendaciones basadas en la predicción"""
    if prediccion == 0:  # No riesgoso
        if prob_riesgo < 0.2:
            return "✅ Cliente excelente - Aprobar crédito con condiciones favorables"
        else:
            return "✅ Cliente aceptable - Aprobar con condiciones estándar"
    else:  # Riesgoso
        recomendaciones = ["⚠️ Cliente de alto riesgo."]

        if fico < 600:
            recomendaciones.append("Puntaje FICO bajo.")
        if dti > 30:
            recomendaciones.append("Ratio deuda/ingreso elevado.")

        recomendaciones.append("Considerar garantías adicionales o rechazar.")

        return " ".join(recomendaciones)

@app.route('/test', methods=['GET'])
def test_prediction():
    """
    Endpoint de prueba con datos de ejemplo
    """
    datos_prueba = {
        'credit_policy': 1,
        'purpose': 'debt_consolidation',
        'int_rate': 0.1357,
        'installment': 366.86,
        'log_annual_inc': 11.35,
        'dti': 19.48,
        'fico': 737,
        'days_with_cr_line': 5639.96,
        'revol_bal': 28854,
        'revol_util': 52.10,
        'inq_last_6mths': 1,
        'delinq_2yrs': 0,
        'pub_rec': 0
    }

    return jsonify({
        'mensaje': 'Datos de prueba',
        'nota': 'Usa estos datos en POST /predict para probar',
        'datos': datos_prueba,
        'opciones_purpose': [
            'debt_consolidation',
            'credit_card',
            'home_improvement',
            'major_purchase',
            'small_business',
            'educational',
            'all_other'
        ]
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('DEBUG', 'False') == 'True'
    
    print(f"🚀 Iniciando servidor en puerto {port}")
    print(f"🔐 API Key configurada: {'Sí' if API_KEY else 'No'}")
    print(f"🤖 Modelo cargado: {'Sí' if modelo else 'No'}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)
