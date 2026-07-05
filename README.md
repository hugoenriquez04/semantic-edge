# SemanticEdge 🛡️🤖
### Módulo Perimetral Híbrido de Inferencia Semántica contra Phishing Avanzado e Ingeniería Social

**Proyecto Desarrollado para:** Premios a la Innovación en Ciberseguridad e Inteligencia Artificial (2026)  
**Convocado por:** Cátedra de Ciberseguridad de la Universidad de Málaga & VirusTotal  
**Autor:** Hugo Enríquez Jiménez  
**Titulación:** Doble Grado en Ingeniería Informática y Matemáticas (UMA)

---

## ❓ ¿Qué es SemanticEdge?

**SemanticEdge** es un ecosistema de seguridad perimetral de Día Cero diseñado bajo una arquitectura híbrida de tres niveles de triaje. Su objetivo es interceptar vectores de ataque basados en ingeniería social y phishing semántico en tiempo real, antes de que el usuario comprometa sus credenciales.

A diferencia de las soluciones convencionales que dependen de listas negras de URLs estáticas (fáciles de evadir por los atacantes), SemanticEdge audita dinámicamente el contenido del Árbol de Objetos del Documento (DOM). Para ello, combina **heurística rápida en el cliente**, el procesamiento de lenguaje natural de la **IA local (Edge AI)** de Google Chrome y el respaldo asíncrono de un **servidor de firmas centralizado**.

---

## 🛠️ Desglose de Bloques Operacionales y Componentes Críticos

El núcleo de la solución se segmenta en los siguientes subsistemas funcionales:

### 1. `client/background.js` (Orquestador del Pipeline de Inferencia Local)
Este Service Worker actúa como el núcleo lógico del agente perimetral en segundo plano:
* Monitoriza de forma asíncrona los eventos analíticos emitidos desde las pestañas web activas.
* Conmutación dinámica entre políticas de mitigación bajo demanda del usuario (*Alerta, Balanceado y Restrictivo Zero-Trust*).
* **Inferencia Semántica:** Orquesta la sesión nativa con el LLM local **Gemini Nano** integrado en el navegador, inyectando un *system prompt* especializado en auditoría forense para contextualizar heurísticamente el flujo de texto plano del DOM de forma 100% privada.

### 2. `client/content.js` (Sensor Perimetral del DOM e Inyector de Contención)
Constituye la sonda táctica desplegada directamente en el contexto de ejecución de las páginas web:
* Extrae el contenido textual estructurado del DOM de manera reactiva al inicializarse la carga de la página.
* Actúa como actuador de contención inmediata: si el orquestador determina un veredicto malicioso, detiene en seco el hilo de ejecución visual mediante `window.stop()` e inyecta un **Muro de Aislamiento Crítico a pantalla completa**, neutralizando la interacción del usuario con la amenaza.

### 3. `server/main.py` (API Gateway Centralizado y Pasarela Fail-Safe)
Es el nodo del backend desarrollado sobre una arquitectura síncrona/asíncrona de alto rendimiento con FastAPI:
* Proporciona resiliencia al agente cliente actuando como pasarela de contingencia offline o enriquecimiento de firmas cruzadas si la IA del perímetro experimenta degradación.
* Procesa payloads mediante un endpoint POST (`/api/v1/check-url`), evaluando la URL contra una matriz lógica de firmas maliciosas simuladas para simular el ecosistema transaccional de VirusTotal.

### 4. `client/popup.js` & `popup.html` (Módulo de Telemetría e IA Explicable - XAI)
Representa la capa de abstracción y analítica visual expuesta al usuario:
* Renderiza métricas operacionales críticas en tiempo real (volumen de DOMs auditados, contadores de mitigación activa y latencia de inferencia local en milisegundos).
* Dispone de un disparador de auditoría forense bajo demanda que interactúa con la extensión y devuelve un formato analítico estructurado bajo un **JSON Schema estricto**, visibilizando los factores de riesgo de IA de cara a la auditabilidad del sistema.

---

## 🚀 Guía de Despliegue Operativo

### Paso 1: Inicializar el Backend Analítico
En la raíz del repositorio se integra el script de automatización **`run.bat`**. Simplemente ejecútalo con doble clic:
* El script automatiza el despliegue del entorno virtual (`venv`), realiza el aprovisionamiento de paquetes a través de `requirements.txt` e inicia el servidor Uvicorn apuntando a la aplicación FastAPI en `http://127.0.0.1:8000`.

### Paso 2: Integrar el Agente en Google Chrome
1. Accede a la sección de extensiones del navegador mediante la URL `chrome://extensions/`.
2. Activa el flag de **"Modo de desarrollador"** (ubicado en el margen superior derecho).
3. Selecciona la opción **"Cargar descomprimida"** (margen superior izquierdo).
4. Apunta el directorio directamente a la carpeta **`client`** de este repositorio.

### Paso 3: Validación del Laboratorio de Pruebas
1. Navega en un entorno limpio de producción (ej. `google.com`), inicializa el panel de SemanticEdge y corrobora el estado **OK (Verde)** de monitorización pasiva.
2. Simula un vector de ataque importando el entorno de pruebas local incorporado en `test/banco-fake.html` dentro de una pestaña del navegador.
3. El sensor interceptará el evento de carga, cruzará los datos con la API Gateway y disparará de forma instantánea el **Muro de Aislamiento**.
4. Despliega el panel de control sobre la pantalla bloqueada y pulsa **"Forzar Análisis Forense"** para evaluar cómo la consola XAI analiza semánticamente el DOM devolviendo una validación crítica con `risk_level: 94`.