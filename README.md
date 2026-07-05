# SemanticEdge 🛡️🧠

### Ciberdefensa Perimetral Inteligente contra Phishing Avanzado y Vectores Cognitivos mediante IA Local (Chrome Built-in AI) y Pasarela Asíncrona en FastAPI

SemanticEdge es un Producto Mínimo Viable (MVP) diseñado para la **Cátedra de Ciberseguridad de la Universidad de Málaga (UMA) & VirusTotal**. Rompe con el paradigma de la seguridad estática tradicional, trasladando la capacidad analítica directamente al *endpoint* mediante un modelo de *Edge Computing* distribuido de coste marginal cero.

---

## 📺 Demostración del Sistema (Vídeo MVP)

Para ver el ecosistema defendiendo el navegador en tiempo real frente a un vector de ingeniería social activa, reproduce el siguiente vídeo técnico:

![Demostración en Vivo](assets/demo/demo_semantic_edge.gif)
*(Vídeo completo disponible en la carpeta `assets/demo/mvp_walkthrough.mp4`)*

---

## 🏗️ Arquitectura de Ciberdefensa en Tres Niveles

El sistema procesa y neutraliza las amenazas en caliente estructurándose en un flujo secuencial asíncrono y desacoplado:

1. **Nivel 1 (Captura Sintáctica y Sanitización - Cliente):** Una extensión de Google Chrome bajo el estándar **Manifest V3** monitoriza las mutaciones dinámicas del DOM en tiempo real (*MutationObserver*) con soporte nativo para SPAs (como WhatsApp Web o Gmail). Sanitiza el texto eliminando scripts maliciosos (Anti-XSS) antes del análisis.
2. **Nivel 2 (Inferencia Semántica e IA Local - Service Worker):** El Service Worker de fondo intercepta el texto plano y ejecuta un pipeline condicional. Si pasa el Filtro 0 (heurística rápida), invoca de forma desconectada a la API nativa de Chrome (**Gemini Nano**) mediante *Few-Shot Learning con Demarcación Adaptativa* para identificar coacciones psicológicas y urgencias artificiales con coste cero y bajo el principio *Privacy by Design*.
3. **Nivel 3 (Pasarela de Enriquecimiento y Firmas - Servidor):** Ante incertidumbres lógicas, el agente interroga de forma asíncrona a un backend desarrollado en **FastAPI**. Este nodo valida el origen corporativo del agente (*Chrome Extension ID*), protege las cuotas analíticas mediante un middleware *Token Bucket* (*Rate Limiting*), gestiona una caché local (*SQLite/Redis* con TTL de 24h) y correlaciona el riesgo con la API global de **VirusTotal**.

---

## 📸 Capturas de Pantalla de la Interfaz

### Dashboard de Control Adaptativo (Popup UI)
La interfaz gráfica de la extensión implementa un diseño cibernético y reactivo, adaptándose de forma nativa al tema claro u oscuro (Light/Dark Mode) del sistema operativo. Muestra la telemetría operacional en vivo y permite alternar el rigor defensivo entre tres perfiles (*Alerta, Balanceado y Restrictivo*).

<p align="center">
  <img src="assets/images/popup_ui_dark.png" width="45%" alt="Popup UI Modo Oscuro">
  <img src="assets/images/popup_ui_light.png" width="45%" alt="Popup UI Modo Claro">
</p>

### Muro de Contención Activa (Pantalla de Bloqueo)
Cuando el pipeline de inferencia semántica confirma un riesgo crítico de fraude o phishing, inyecta dinámicamente una pantalla de bloqueo aislada a pantalla completa sobre el DOM de la pestaña, neutralizando el vector de ataque antes de que el usuario ceda credenciales corporativas.

![Muro de Contención](assets/images/muro_bloqueo.png)

---

## 🛠️ Guía de Instalación y Despliegue Local

### 1. Requisitos Previos
* Google Chrome (Versión estable con soporte para *Chrome Built-in AI*).
* Python 3.10 o superior.

### 2. Despliegue del Servidor (FastAPI Backend)
Navega a la carpeta del servidor, instala las dependencias y arranca el entorno de ejecución asíncrono:
```bash
cd server
pip install -r requirements.txt
uvicorn main:app --reload