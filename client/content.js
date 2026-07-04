console.log("🛡️ [SemanticEdge] Sensor activo.");

function enviarTexto() {
  const textoPagina = document.body ? document.body.innerText : "";
  
  chrome.runtime.sendMessage({
    action: "ANALIZAR_TEXTO",
    url: window.location.href,
    text: textoPagina.substring(0, 2000)
  });
}

// Si la página ya ha cargado, enviamos el texto ya. Si no, esperamos a que cargue.
if (document.readyState === "complete" || document.readyState === "interactive") {
  enviarTexto();
} else {
  window.addEventListener("load", enviarTexto);
}