@echo off
title Orquestador SemanticEdge MVP
cls
echo ====================================================
echo   🚀 INICIANDO ECOSISTEMA SEMANTICEDGE
echo ====================================================
echo.

:: ====================================================
:: 1. DETECTAR EL MOTOR COMPILADO O RASTREAR PYTHON
:: ====================================================
set PYTHON_CMD=none

if exist main.exe (
    echo [OK] Se detecto el servidor compilado main.exe.
    start "Servidor FastAPI" main.exe
    goto launch_chrome
)

echo [!] No se encuentra main.exe. Buscando interprete de Python...
python --version >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON_CMD=python
    goto run_python
)

:: Rastrear rutas de instalacion tipicas de Windows por defecto
if exist "%USERPROFILE%\AppData\Local\Programs\Python\Python313\python.exe" (
    set PYTHON_CMD="%USERPROFILE%\AppData\Local\Programs\Python\Python313\python.exe"
    goto run_python
)
if exist "%USERPROFILE%\AppData\Local\Programs\Python\Python312\python.exe" (
    set PYTHON_CMD="%USERPROFILE%\AppData\Local\Programs\Python\Python312\python.exe"
    goto run_python
)
if exist "%USERPROFILE%\AppData\Local\Programs\Python\Python311\python.exe" (
    set PYTHON_CMD="%USERPROFILE%\AppData\Local\Programs\Python\Python311\python.exe"
    goto run_python
)
if exist "%USERPROFILE%\AppData\Local\Programs\Python\Python310\python.exe" (
    set PYTHON_CMD="%USERPROFILE%\AppData\Local\Programs\Python\Python310\python.exe"
    goto run_python
)

echo ❌ ERROR: No se ha encontrado ninguna instalacion de Python en el equipo
echo ni existe un archivo main.exe compilado en la raiz.
echo Por favor, instala Python marcando la casilla "Add to PATH" para continuar.
echo.
pause
exit

:: ====================================================
:: 2. ARRANCAR EL SERVIDOR VIA PYTHON DETECTADO
:: ====================================================
:run_python
echo [OK] Python localizado en el sistema.
echo [🖥️] Configurando entorno y arrancando backend...
cd server
if not exist venv (
    echo [📦] Creando entorno virtual venv por primera vez...
    %PYTHON_CMD% -m venv venv >nul 2>&1
)
call venv\Scripts\activate
echo [🔌] Instalando dependencias (requirements.txt)...
pip install -r requirements.txt >nul 2>&1
start "Servidor FastAPI" cmd /k "title Servidor FastAPI SemanticEdge && call venv\Scripts\activate && uvicorn main:app --reload"
cd ..

:: ====================================================
:: 3. ABRIR CHROME DE FORMA SEGURA
:: ====================================================
:launch_chrome
echo.
echo [🌐] Desplegando entorno en tu Google Chrome...
timeout /t 2 >nul

:: Abrimos una URL normal para evitar el bloqueo de seguridad de Chrome
start chrome "https://google.com"

echo.
echo ====================================================
echo  🎉 ¡SERVIDOR INICIADO! (Sigue estos dos pasos)
echo ====================================================
echo  Como Chrome bloquea los enlaces directos por seguridad,
echo  sigue estos dos pasos rápidos en el navegador:
echo.
echo  1. Abre una pestaña nueva y escribe: chrome://extensions/
echo.
echo  2. Activa el "Modo de desarrollador" (arriba a la derecha),
echo     pulsa "Cargar descomprimida" (arriba a la izquierda)
echo     y selecciona la carpeta 'client' de este proyecto.
echo ====================================================
echo.
pause