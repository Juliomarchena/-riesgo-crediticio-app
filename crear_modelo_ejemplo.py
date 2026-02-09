# -*- coding: utf-8 -*-
"""
Script para crear un modelo de ejemplo si no tienes modelo_riesgo_crediticio.pkl

Este script crea un modelo de prueba con datos sintéticos.
Úsalo SOLO si no tienes tu modelo real.

Ejecutar:
    python crear_modelo_ejemplo.py
"""

import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split

print("🚀 Creando modelo de ejemplo...")

# Generar datos sintéticos de ejemplo
np.random.seed(42)
n_samples = 1000

# Características:
# 0: credit_policy, 1: int_rate, 2: installment, 3: log_annual_inc
# 4: dti, 5: fico, 6: days_with_cr_line, 7: revol_bal
# 8: revol_util, 9: inq_last_6mths, 10: delinq_2yrs, 11: pub_rec

# Generar datos realistas
X = np.column_stack([
    np.random.choice([0, 1], n_samples, p=[0.2, 0.8]),  # credit_policy
    np.random.uniform(0.05, 0.30, n_samples),            # int_rate
    np.random.uniform(50, 1000, n_samples),              # installment
    np.random.uniform(9, 13, n_samples),                 # log_annual_inc
    np.random.uniform(0, 40, n_samples),                 # dti
    np.random.randint(300, 850, n_samples),              # fico
    np.random.uniform(0, 20000, n_samples),              # days_with_cr_line
    np.random.uniform(0, 100000, n_samples),             # revol_bal
    np.random.uniform(0, 100, n_samples),                # revol_util
    np.random.randint(0, 10, n_samples),                 # inq_last_6mths
    np.random.randint(0, 5, n_samples),                  # delinq_2yrs
    np.random.randint(0, 3, n_samples)                   # pub_rec
])

# Generar etiquetas basadas en reglas lógicas
# Riesgoso (1) si:
# - FICO < 600
# - int_rate > 0.20
# - dti > 35
# - delinq_2yrs > 1
y = np.zeros(n_samples)
for i in range(n_samples):
    risk_score = 0
    if X[i, 5] < 600:  # FICO bajo
        risk_score += 2
    if X[i, 1] > 0.20:  # Tasa alta
        risk_score += 1
    if X[i, 4] > 35:   # DTI alto
        risk_score += 1
    if X[i, 10] > 1:   # Morosidades
        risk_score += 2

    if risk_score >= 3:
        y[i] = 1  # Riesgoso

# Dividir datos
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Entrenar modelo
print("📊 Entrenando modelo Random Forest...")
modelo = RandomForestClassifier(
    n_estimators=100,
    max_depth=10,
    random_state=42
)
modelo.fit(X_train, y_train)

# Evaluar
accuracy = modelo.score(X_test, y_test)
print(f"✅ Accuracy en test: {accuracy:.2%}")

# Guardar modelo
with open('modelo_riesgo_crediticio.pkl', 'wb') as f:
    pickle.dump(modelo, f)

print("💾 Modelo guardado como: modelo_riesgo_crediticio.pkl")
print("\n🎉 ¡Listo! Ahora puedes ejecutar: python app.py")

# Probar con ejemplo del documento
print("\n🧪 Probando con datos del documento...")
datos_prueba = np.array([[
    1,        # credit_policy
    0.1357,   # int_rate
    366.86,   # installment
    11.35,    # log_annual_inc
    19.48,    # dti
    737,      # fico
    5639.96,  # days_with_cr_line
    28854,    # revol_bal
    52.10,    # revol_util
    1,        # inq_last_6mths
    0,        # delinq_2yrs
    0         # pub_rec
]])

prediccion = modelo.predict(datos_prueba)[0]
probabilidad = modelo.predict_proba(datos_prueba)[0]

print(f"Predicción: {'Riesgoso' if prediccion == 1 else 'No Riesgoso'}")
print(f"Probabilidad No Riesgo: {probabilidad[0]:.2%}")
print(f"Probabilidad Riesgo: {probabilidad[1]:.2%}")
