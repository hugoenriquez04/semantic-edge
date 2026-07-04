console.log("🧠 [SemanticEdge] Service Worker inicializado y escuchando...");

// Escuchamos los mensajes que envían los sensores desde las pestañas
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ANALIZAR_TEXTO") {
    console.log(`🔍 Recibido texto para analizar de la URL: ${request.url}`);
    console.log(`📄 Fragmento del contenido: "${request.text.substring(0, 100)}..."`);
    
    // TODO: Aquí implementaremos el Protocolo de Inferencia con Gemini Nano
    // y el desempate con FastAPI si entra en la zona de duda.
  }
  return true;
});