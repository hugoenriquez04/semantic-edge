// ==========================================================================
// 1. ESCUCHADOR DE MENSAJES (NIVEL 1 -> CAPTURA DEL DOM)
// ==========================================================================
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "ANALIZAR_TEXTO") {
        const url = message.url;
        const texto = message.text;
        const tabId = sender.tab.id;

        console.log(`🔍 [SemanticEdge] Evaluando contenido de: ${url}`);

        // Leer la política activa elegida por el usuario en el Popup
        chrome.storage.local.get(["perfilDefensivo"], (result) => {
            const perfilActivo = result.perfilDefensivo || "balanceado";
            console.log(`[Rigor Defensivo Activo]: Perfil ${perfilActivo.toUpperCase()}`);

            ejecutarPipelineSeguridad(url, texto)
                .then((veredicto) => {
                    actualizarBadge(tabId, veredicto);

                    // APLICAR LÓGICA DE AUDITORÍA SEGÚN EL PERFIL SELECCIONADO
                    if (veredicto === 'CRÍTICO') {
                        if (perfilActivo === 'alerta') {
                            // Modo Alerta: Notifica cambiando badge pero jamás bloquea la navegación
                            sendResponse({ action: "ALLOW_NAVIGATION" });
                        } else {
                            // Modos Balanceado y Restrictivo: Inyectan el muro protector
                            sendResponse({ action: "INJECT_BLOCK_SCREEN", reason: "Anomalía Semántica Detectada" });
                        }
                    } else {
                        // Si el veredicto local es seguro pero estamos en modo Restrictivo (Zero-Trust) 
                        // y detectamos una pantalla con formulario de login, bloqueamos preventivamente
                        if (perfilActivo === 'restrictivo' && (texto.toLowerCase().includes("iniciar sesión") || url.includes("login"))) {
                            sendResponse({ action: "INJECT_BLOCK_SCREEN", reason: "Bloqueo Proactivo Preventivo (Formulario de Login Detectado)" });
                        } else {
                            sendResponse({ action: "ALLOW_NAVIGATION" });
                        }
                    }
                })
                .catch((err) => {
                    console.error("Error en pipeline:", err);
                    sendResponse({ action: "ALLOW_NAVIGATION" });
                });
        });

        return true; // Mantiene el canal abierto para respuestas asíncronas
    }
});

// ==========================================================================
// 2. PIPELINE PRINCIPAL DE INFERENCIA (NIVEL 2 -> HEURÍSTICA + GEMINI NANO)
// ==========================================================================
async function ejecutarPipelineSeguridad(url, texto) {
    // A. Filtro de Paso 0 / Heurística rápida sobre texto y URL
    const disparadores = ['login', 'banco', 'paypal', 'secure', 'urgente', 'suspension', 'verifirma', 'test-phishing'];
    const contenidoMinuscula = (url + " " + texto).toLowerCase();
    
    if (disparadores.some(p => contenidoMinuscula.includes(p))) {
        console.log(`🚨 [Nivel 2 - Heurística] Patrón sospechoso crítico interceptado.`);
        // Si es sospechoso, consultamos al Nivel 3 (FastAPI) para enriquecimiento definitivo
        return await consultarBackendFastAPI(url);
    }

    // B. Inferencia Semántica con IA Local (Gemini Nano)
    let modeloIA = null;
    if (typeof ai !== 'undefined' && ai.languageModel) {
        modeloIA = ai.languageModel;
    } else if (typeof chrome !== 'undefined' && chrome.aiOriginTrial && chrome.aiOriginTrial.languageModel) {
        modeloIA = chrome.aiOriginTrial.languageModel;
    }

    if (modeloIA) {
        try {
            const capabilities = await modeloIA.capabilities();
            if (capabilities.available !== 'no') {
                console.log("🧠 [Nivel 2 - Edge AI] Procesando texto visible con Gemini Nano...");
                const session = await modeloIA.create({
                    systemPrompt: "Eres un analista de ciberseguridad corporativo. Analiza el texto de la página. Responde ESTRICTAMENTE 'CRITICO' si detectas fraude, robo de credenciales, urgencia artificial o phishing. Responde 'SEGURO' si es benigno."
                });
                const respuestaRaw = await session.prompt(`Contenido web a evaluar:\n${texto.substring(0, 1000)}`);
                session.destroy();
                
                if (respuestaRaw.trim().toUpperCase().includes('CRITICO')) {
                    console.log("⚠️ [Gemini Nano] Veredicto local: CRÍTICO.");
                    return 'CRÍTICO';
                }
            }
        } catch (e) {
            console.log("⚠️ Falló la ejecución en Gemini Nano. Degradando consulta.");
        }
    }

    return 'SEGURO';
}

// ==========================================================================
// 3. PASARELA EXTERNA ASÍNCRONA (NIVEL 3 -> FASTAPI GATEWAY)
// ==========================================================================
async function consultarBackendFastAPI(url) {
    try {
        console.log("🖥️ [Nivel 3] Solicitando enriquecimiento y comprobación de firmas en FastAPI...");
        const response = await fetch("http://127.0.0.1:8000/api/v1/check-url", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: url })
        });
        const data = await response.json();
        console.log(`[FastAPI Veredicto]: ${data.verdict}`);
        return data.verdict === "MALICIOUS" ? 'CRÍTICO' : 'SEGURO';
    } catch (err) {
        console.log("❌ Servidor FastAPI desconectado. Aplicando directiva de contingencia offline.");
        return 'CRÍTICO'; // Principio Fail-Safe ante riesgos heurísticos
    }
}

// ==========================================================================
// 4. COMPONENTE VISUAL DE NOTIFICACIÓN (BADGE CHROME)
// ==========================================================================
function actualizarBadge(tabId, riesgo) {
    if (riesgo === 'CRÍTICO') {
        chrome.action.setBadgeBackgroundColor({ color: '#FF0000', tabId: tabId });
        chrome.action.setBadgeText({ text: 'RISK', tabId: tabId });
    } else {
        chrome.action.setBadgeBackgroundColor({ color: '#1aa251', tabId: tabId });
        chrome.action.setBadgeText({ text: 'OK', tabId: tabId });
    }
}