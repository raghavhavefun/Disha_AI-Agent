import modal
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
import io
import re

app = modal.App("disha-voice-cloner")

web_app = FastAPI()

web_app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pre-download the Kokoro model weights during image build
def download_kokoro_model():
    from kokoro import KPipeline
    print("Downloading Kokoro model for English (af_heart)...")
    KPipeline(lang_code="a")
    print("Downloading Kokoro model for Hindi (hf_alpha)...")
    KPipeline(lang_code="h")
    print("Kokoro models baked into image successfully!")

# Lightweight image — no GPU needed
image = (
    modal.Image.debian_slim(python_version="3.11")
    .apt_install("libsndfile1")
    .pip_install(
        "kokoro>=0.9",
        "soundfile",
        "fastapi",
        "pydantic",
        "numpy",
    )
    .run_function(download_kokoro_model)
)

# ---- Language Detection ----
# Only Devanagari script triggers Hindi voice. That's it.
# Gemini will reply in Devanagari when the user speaks Hindi/Hinglish,
# so the backend just needs to check for Devanagari characters.
DEVANAGARI_RE = re.compile(r"[\u0900-\u097F]")


def detect_language(text: str) -> str:
    """Returns 'hi' ONLY if the text contains Devanagari script. Otherwise 'en'."""
    if DEVANAGARI_RE.search(text):
        return "hi"
    return "en"


# ---- Kokoro Voice Model (runs on cheap CPU) ----
@app.cls(image=image, scaledown_window=300)
class VoiceModel:
    @modal.enter()
    def load_model(self):
        from kokoro import KPipeline

        print("Loading Kokoro pipelines...")
        self.en_pipeline = KPipeline(lang_code="a")  # American English
        self.hi_pipeline = KPipeline(lang_code="h")  # Hindi
        print("Kokoro ready! Voices: af_heart (EN), hf_alpha (HI)")

    @modal.method()
    def generate_audio(self, text: str) -> bytes:
        import soundfile as sf
        import numpy as np

        lang = detect_language(text)

        if lang == "hi":
            pipeline = self.hi_pipeline
            voice = "hf_alpha"
        else:
            pipeline = self.en_pipeline
            voice = "af_heart"

        # Generate all audio chunks and concatenate
        audio_chunks = []
        for _, _, audio in pipeline(text, voice=voice, speed=1.0):
            if audio is not None:
                audio_chunks.append(audio)

        if not audio_chunks:
            return b""

        full_audio = np.concatenate(audio_chunks)

        # Write to WAV in memory
        buffer = io.BytesIO()
        sf.write(buffer, full_audio, 24000, format="WAV")
        buffer.seek(0)
        return buffer.read()


# ---- Public API Endpoint ----
@web_app.post("/tts")
async def handle_tts(request: Request):
    data = await request.json()
    text = data.get("text", "Hello")

    model = VoiceModel()
    audio_bytes = model.generate_audio.remote(text)

    if not audio_bytes:
        return Response(content=b"", status_code=204)

    return Response(content=audio_bytes, media_type="audio/wav")


@app.function(image=image)
@modal.asgi_app()
def fastapi_app():
    return web_app
