console.log("🛡️ [SemanticEdge] Sensor activo en esta página web.");

// Función para extraer el texto limpio de la página
function extraerTextoDeLaPagina() {
  // Nos quedamos solo con el texto visible dentro del body, ignorando scripts y estilos
  return document.body.innerText || "";
}

// Ejecutamos la extracción cuando la página esté lista
window.addEventListener("load", () => {
  const textoPagina = extraerTextoDeLaPagina();
  
  // Enviamos el texto al background.js de forma segura
  chrome.runtime.sendMessage({
    action: "ANALIZAR_TEXTO",
    url: window.location.href,
    text: textoPagina.substring(0, 2000) // Enviamos solo los primeros 2000 caracteres para no saturar
  });
});