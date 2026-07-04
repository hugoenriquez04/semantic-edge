from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="SemanticEdge Gateway", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🗄️ NUESTRA BASE DE DATOS DE PRUEBA (Simulada)
# Aquí registramos ejemplos de phishing y sitios seguros para testear
BASE_DE_DATOS_LOCAL = {
    "paypal-seguridad-alerta.com": {"action": "BLOCK", "verdict": "Phishing detectado...", "score": 85},
    "bing.com": {"action": "BLOCK", "verdict": "SITIO RESTRINGIDO POR POLÍTICA DE SEGURIDAD.", "score": 95}, # 👈 Añadimos este de prueba
    "wikipedia.org": {"action": "ALLOW", "verdict": "Sitio seguro verificado.", "score": 0},
}

class AnalisisRequest(BaseModel):
    url: str
    text: str

@app.post("/verificar")
async def verificar_dominio(payload: AnalisisRequest):
    print(f"📡 [FastAPI] Petición entrante para: {payload.url}")
    
    # Buscamos si alguna de nuestras palabras clave de la BD está en la URL del usuario
    for dominio_sospechoso, resultado in BASE_DE_DATOS_LOCAL.items():
        if dominio_sospechoso in payload.url.lower():
            print(f"🎯 ¡Coincidencia en BD local! Resultado: {resultado['action']}")
            return {
                "status": "success",
                "action": resultado["action"],
                "verdict": resultado["verdict"],
                "score": resultado["score"]
            }
            
    # Si no está en nuestra base de datos, por defecto la dejamos pasar (ALLOW)
    return {
        "status": "success",
        "action": "ALLOW",
        "verdict": "No encontrado en la lista negra local. Permitido temporalmente.",
        "score": 0
    }