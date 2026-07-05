console.log("🛡️ [SemanticEdge] Sensor perimetral inyectado y activo.");

function enviarTexto() {
    const textoPagina = document.body ? document.body.innerText : "";
    
    chrome.runtime.sendMessage({
        action: "ANALIZAR_TEXTO",
        url: window.location.href,
        text: textoPagina.substring(0, 2000)
    }, (response) => {
        // Escuchar orden de contención activa del backend de la extensión
        if (response && response.action === "INJECT_BLOCK_SCREEN") {
            inyectarMuroDefensivo(response.reason);
        }
    });
}

function inyectarMuroDefensivo(motivo) {
    if (document.getElementById("semantic-edge-fullscreen-block")) return;

    // Crear contenedor raíz aislado
    const muro = document.createElement("div");
    muro.id = "semantic-edge-fullscreen-block";
    
    // CSS Avanzado para máxima estética en fotos y grabaciones de video
    Object.assign(muro.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "#0b0c10",
        color: "#ffffff",
        zIndex: "2147483647", // Desplegar por encima de cualquier elemento web
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: "20px",
        boxSizing: "border-box"
    });

    muro.innerHTML = `
        <div style="background: rgba(230, 77, 73, 0.05); border: 1px solid #e64d49; padding: 40px; border-radius: 12px; max-width: 580px; text-align: center; box-shadow: 0 10px 40px rgba(230,77,73,0.15);">
            <div style="font-size: 56px; margin-bottom: 16px; color: #e64d49;">⚠️</div>
            <h1 style="font-size: 24px; font-weight: 700; margin: 0 0 12px 0; color: #e64d49; text-transform: uppercase; letter-spacing: 0.5px;">Acceso Denegado por SemanticEdge</h1>
            <p style="font-size: 14px; color: #8a90a0; line-height: 1.6; margin: 0 0 24px 0;">
                El agente inteligente perimetral ha interceptado la carga de esta página. El análisis contextual híbrido ha clasificado el contenido como un vector crítico de <strong>Ingeniería Social / Phishing de Día Cero</strong>.
            </p>
            
            <div style="background: #12131a; border-left: 4px solid #e64d49; padding: 14px; border-radius: 6px; text-align: left; margin-bottom: 28px;">
                <span style="font-size: 11px; font-weight: 700; color: #e64d49; display: block; text-transform: uppercase; margin-bottom: 4px;">Auditoría de Inferencia Local:</span>
                <code style="font-family: monospace; font-size: 13px; color: #d1d5db;">[BLOCK_DIRECTIVE] ${motivo} via Heuristic/VirusTotal Matrix.</code>
            </div>

            <button id="btn-back-safe" style="background-color: #e64d49; color: #ffffff; border: none; padding: 12px 28px; font-size: 14px; font-weight: 600; border-radius: 6px; cursor: pointer; transition: background 0.2s;">
                Regresar a zona segura
            </button>
        </div>
    `;

    document.documentElement.appendChild(muro);

    // Añadir interactividad real al botón del muro
    document.getElementById("btn-back-safe").addEventListener("click", () => {
        window.history.back();

        setTimeout(() => {
            window.location.href = "https://www.google.com";
        }, 250);
    });
}

// Ejecutar sonda analítica según el estado de carga
if (document.readyState === "complete" || document.readyState === "interactive") {
    enviarTexto();
} else {
    window.addEventListener("load", enviarTexto);
}