import pickle
import numpy as np

# Cargar el modelo
with open('modelo_riesgo_crediticio.pkl', 'rb') as file:
    modelo = pickle.load(file)

print("=" * 60)
print("INFORMACIÓN DEL MODELO")
print("=" * 60)

# Tipo de modelo
print(f"\nTipo de modelo: {type(modelo).__name__}")

# Intentar obtener información sobre las características
try:
    if hasattr(modelo, 'n_features_in_'):
        print(f"Número de características esperadas: {modelo.n_features_in_}")
    
    if hasattr(modelo, 'feature_names_in_'):
        print(f"\nNombres de características:")
        for i, name in enumerate(modelo.feature_names_in_):
            print(f"  {i}: {name}")
    else:
        print(f"\nNúmero de características: {modelo.n_features_in_}")
        print("El modelo no tiene nombres de características guardados")
        
except Exception as e:
    print(f"Error al obtener información: {e}")

# Probar con datos de ejemplo
print("\n" + "=" * 60)
print("PROBANDO PREDICCIÓN")
print("=" * 60)

# Crear array de ejemplo con 19 características (todas en 0)
X_test = np.zeros((1, 19))
print(f"\nProbando con {X_test.shape[1]} características...")

try:
    prediction = modelo.predict(X_test)
    print(f"✅ Predicción exitosa: {prediction[0]}")
    
    proba = modelo.predict_proba(X_test)
    print(f"✅ Probabilidades: {proba[0]}")
    
except Exception as e:
    print(f"❌ Error: {e}")

print("\n" + "=" * 60)
