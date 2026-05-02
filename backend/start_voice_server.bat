@echo off
echo ===================================================
echo Setting up Disha Voice AI Engine (RTX 4070 Edition)
echo ===================================================
echo.

if not exist venv (
    echo Creating Python Virtual Environment...
    python -m venv venv
)

echo Activating Virtual Environment...
call venv\Scripts\activate

echo.
echo Installing PyTorch with CUDA support (This may take 5-10 minutes if downloading for the first time)...
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

echo.
echo Installing XTTS v2 and FastAPI...
pip install TTS fastapi uvicorn pydantic

echo.
echo Starting Voice Server...
python main.py

pause
