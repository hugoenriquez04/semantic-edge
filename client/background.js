console.log("🧠 [SemanticEdge] Service Worker inicializado y escuchando...");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "ANALIZAR_TEXTO") {
    // 1. Ahora imprimimos el texto completo que viene de la web sin cortarlo
    console.log(`🔍 URL analizada: ${request.url}`);
    console.log(`📄 Texto completo recibido de la web:`, request.text);

    // 2. Enviamos los datos reales a nuestro servidor FastAPI en el puerto 8000
    fetch("http://127.0.0.1:8000/verificar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        url: request.url,
        text: request.text
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log("📡 [Respuesta de FastAPI]:", data);
    })
    .catch(error => {
      console.error("❌ Error al conectar con FastAPI:", error);
    });
  }
  return true;
});