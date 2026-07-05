// client/background.js

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        if (tab.url.startsWith('chrome://') || tab.url.startsWith('about:')) return;

        console.log(`🔍 [SemanticEdge] Analizando entorno: ${tab.url}`);
        const resultadoRiesgo = await evaluarSeguridad(tab.url);
        actualizarBadge(tabId, resultadoRiesgo);
    }
});

async function evaluarSeguridad(url) {
    const urlLower = url.toLowerCase();
    let modeloIA = null;

    // Localizar API de Google de forma flexible
    if (typeof ai !== 'undefined' && ai.languageModel) {
        modeloIA = ai.languageModel;
    } else if (typeof chrome !== 'undefined' && chrome.aiOriginTrial && chrome.aiOriginTrial.languageModel) {
        modeloIA = chrome.aiOriginTrial.languageModel;
    }

    // NIVEL 1: Inferencia Semántica Local
    if (modeloIA) {
        try {
            const capabilities = await modeloIA.capabilities();
            if (capabilities.available !== 'no') {
                console.log("🧠 [Edge AI] Gemini Nano activo. Procesando prompt...");
                const session = await modeloIA.create({
                    systemPrompt: "Eres un clasificador de ciberseguridad. Responde ÚNICAMENTE 'CRITICO' si la URL es phishing/fraude o 'SEGURO' si es legítima."
                });
                const respuestaRaw = await session.prompt(`URL: ${url}`);
                session.destroy();
                
                return respuestaRaw.trim().toUpperCase().includes('CRITICO') ? 'CRÍTICO' : 'SEGURO';
            }
        } catch (e) {
            console.log("⚠️ Falló Gemini Nano. Degradando a motor heurístico.");
        }
    }

    // NIVEL 2: Motor de Contingencia Heurístico (Si la IA da undefined)
    const disparadores = ['login', 'banco', 'paypal', 'secure', 'urgente', 'update', 'signin', 'verifirma'];
    if (disparadores.some(p => urlLower.includes(p))) {
        console.log(`🚨 [ALERTA HEURÍSTICA] Patrón sospechoso detectado.`);
        return 'CRÍTICO';
    }

    return 'SEGURO';
}

function actualizarBadge(tabId, riesgo) {
    if (riesgo === 'CRÍTICO') {
        chrome.action.setBadgeBackgroundColor({ color: '#FF0000', tabId: tabId });
        chrome.action.setBadgeText({ text: 'RISK', tabId: tabId });
    } else {
        chrome.action.setBadgeBackgroundColor({ color: '#00FF00', tabId: tabId });
        chrome.action.setBadgeText({ text: 'OK', tabId: tabId });
    }
}