# server/main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(
    title="SemanticEdge Enrichment Server",
    description="Nodo centralizado de enriquecimiento analítico para la Cátedra de Ciberseguridad"
)

class URLCheckRequest(BaseModel):
    url: str

@app.get("/")
def read_root():
    return {"status": "online", "component": "SemanticEdge Core Backend"}

@app.post("/api/v1/check-url")
async def check_url(payload: URLCheckRequest):
    """
    Endpoint perimetral. Recibe la URL del cliente, consulta la caché local
    y actúa como pasarela con la API de VirusTotal.
    """
    url_solicitada = payload.url
    
    # Simulación de respuesta analítica (Fase MVP)
    # Aquí se integrará la llamada asíncrona a VirusTotal en Julio/Agosto
    is_suspicious = any(keyword in url_solicitada.lower() for keyword in ["malware", "phishing", "fake"])
    
    return {
        "url": url_solicitada,
        "verdict": "MALICIOUS" if is_suspicious else "CLEAN",
        "provider": "VirusTotal Simulated Mock",
        "engine_score": {
            "malicious": 1 if is_suspicious else 0,
            "harmless": 90 if not is_suspicious else 10
        }
    }