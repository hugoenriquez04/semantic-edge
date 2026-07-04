from fastapi import FastAPI
from pydantic import BaseModel

# Inicializamos la aplicación FastAPI
app = FastAPI(
    title="SemanticEdge Gateway",
    description="Pasarela segura de validación cruzada y enriquecimiento técnico",
    version="1.0.0"
)

# Definimos la estructura de los datos que esperamos recibir del navegador
class AnalisisRequest(BaseModel):
    url: str
    text: str

@app.get("/")
async def inicio():
    """Ruta de control para verificar que el servidor está encendido."""
    return {"status": "online", "message": "SemanticEdge Gateway operando correctamente"}

@app.post("/verificar")
async def verificar_dominio(payload: AnalisisRequest):
    """Endpoint que recibirá las solicitudes del Nivel 2 (Extensión)."""
    print(f"📡 [FastAPI] Petición entrante para analizar la URL: {payload.url}")
    
    # Por ahora simulamos la respuesta del backend (Mock response)
    # En los siguientes pasos implementaremos la consulta real a VirusTotal y la caché
    return {
        "status": "success",
        "action": "ALLOW",  # Opciones futuras: ALLOW, WARN, BLOCK
        "verdict": "Dominio seguro (Simulación temporal)",
        "score": 0
    }