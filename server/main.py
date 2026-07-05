from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(
    title="SemanticEdge Enrichment Server",
    description="Nodo centralizado de enriquecimiento analítico para la Cátedra de Ciberseguridad"
)

# Habilitar CORS para evitar bloqueos del navegador durante las llamadas del agente
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class URLCheckRequest(BaseModel):
    url: str

@app.get("/")
def read_root():
    return {"status": "online", "component": "SemanticEdge Core Backend"}

@app.post("/api/v1/check-url")
async def check_url(payload: URLCheckRequest):
    url_solicitada = payload.url
    
    # Detonadores de prueba del MVP para forzar veredicto "MALICIOUS" en tu video/fotos
    palabras_criticas = ["malware", "phishing", "fake", "suspension", "secure-login", "verifirma"]
    is_suspicious = any(keyword in url_solicitada.lower() for keyword in palabras_criticas)
    
    return {
        "url": url_solicitada,
        "verdict": "MALICIOUS" if is_suspicious else "CLEAN",
        "provider": "VirusTotal Core Gateway (Simulated MVP)",
        "engine_score": {
            "malicious": 1 if is_suspicious else 0,
            "harmless": 90 if not is_suspicious else 10
        }
    }

if __name__ == "__main__":
    import uvicorn
    # Pasamos el objeto app directamente para evitar fallos de rutas en el ejecutable
    uvicorn.run(app, host="127.0.0.1", port=8000)