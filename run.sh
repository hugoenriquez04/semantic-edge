#!/bin/bash
clear
echo "===================================================="
echo "  🚀 INICIANDO ECOSISTEMA SEMANTICEDGE"
echo "===================================================="
echo ""

# ====================================================
# 1. DETECTAR EL MOTOR COMPILADO O RASTREAR PYTHON
# ====================================================
PYTHON_CMD="none"

if [ -f "./main" ]; then
    echo "[OK] Se detectó el servidor compilado 'main'."
    chmod +x ./main
    ./main &
    SERVER_PID=$!
else
    echo "[!] No se encuentra el binario 'main'. Buscando intérprete de Python..."
    
    if command -v python3 &> /dev/null; then
        PYTHON_CMD="python3"
    elif command -v python &> /dev/null; then
        PYTHON_CMD="python"
    else
        # Rastrear rutas de instalación comunes en Unix por si acaso
        if [ -x "/usr/bin/python3" ]; then
            PYTHON_CMD="/usr/bin/python3"
        elif [ -x "/usr/local/bin/python3" ]; then
            PYTHON_CMD="/usr/local/bin/python3"
        else
            echo "❌ ERROR: No se ha encontrado ninguna instalación de Python en el equipo"
            echo "ni existe un archivo 'main' compilado en la raíz."
            echo "Por favor, instala Python 3 para continuar."
            echo ""
            exit 1
        fi
    fi

    # ====================================================
    # 2. ARRANCAR EL SERVIDOR VIA PYTHON DETECTADO
    # ====================================================
    echo "[OK] Python localizado en el sistema: ($PYTHON_CMD)"
    echo "[🖥️] Configurando entorno y arrancando backend..."
    cd server
    if [ ! -d "venv" ]; then
        echo "[📦] Creando entorno virtual venv por primera vez..."
        $PYTHON_CMD -m venv venv >/dev/null 2>&1
    fi
    source venv/bin/activate
    echo "[🔌] Instalando dependencias (requirements.txt)..."
    pip install -r requirements.txt >/dev/null 2>&1
    
    # Arrancar uvicorn en segundo plano y capturar su PID
    uvicorn main:app --reload &
    SERVER_PID=$!
    cd ..
fi

# ====================================================
# 3. ABRIR EL NAVEGADOR DE FORMA SEGURA
# ====================================================
echo ""
echo "[🌐] Desplegando entorno en tu Google Chrome..."
sleep 2

# Detectar el sistema operativo para lanzar el comando correcto de Chrome
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open -a "Google Chrome" "https://google.com"
else
    # Linux (Ubuntu, Debian, Fedora...)
    if command -v google-chrome &> /dev/null; then
        google-chrome "https://google.com" &
    elif command -v chromium-browser &> /dev/null; then
        chromium-browser "https://google.com" &
    else
        echo "[!] No se pudo abrir Chrome automáticamente. Por favor, ábrelo de forma manual."
    fi
fi

echo ""
echo "===================================================="
echo "  🎉 ¡SERVIDOR INICIADO! (Sigue estos dos pasos)"
echo "===================================================="
echo "  Como el navegador bloquea los enlaces internos por seguridad,"
echo "  sigue estos dos pasos rápidos en tu Chrome habitual:"
echo ""
echo "  1. Abre una pestaña nueva y escribe: chrome://extensions/"
echo ""
echo "  2. Activa el 'Modo de desarrollador' (arriba a la derecha),"
echo "     pulsa 'Cargar descomprimida' (arriba a la izquierda)"
echo "     y selecciona la carpeta 'client' de este proyecto."
echo "===================================================="
echo ""
echo "Presiona Ctrl+C en esta terminal para apagar el servidor al terminar."

# Asegurar el apagado limpio del servidor si el usuario cancela con Ctrl+C
trap "kill $SERVER_PID; exit" INT TERM
wait $SERVER_PID