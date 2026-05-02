from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import torch
from TTS.api import TTS
import os
import io

app = FastAPI()

# Allow the Next.js frontend to communicate with this Python backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize XTTS v2 Model on GPU (if available)
device = "cuda" if torch.cuda.is_available() else "cpu"
print(f"=====================================")
print(f"Loading XTTS Model on {device.upper()}...")
print(f"=====================================")

try:
    tts = TTS("tts_models/multilingual/multi-dataset/xtts_v2").to(device)
    print("Model successfully loaded to GPU!")
except Exception as e:
    print(f"Error loading model: {e}")

class TTSRequest(BaseModel):
    text: str
    language: str = "en"

@app.post("/tts")
async def generate_tts(req: TTSRequest):
    ref_audio = os.path.join(os.path.dirname(__file__), "..", "disha_reference.wav")
    
    if not os.path.exists(ref_audio):
        raise HTTPException(status_code=404, detail="Reference voice audio not found. Please place disha_reference.wav in the root directory.")

    try:
        # XTTS generates the audio and saves to a temporary file
        temp_file = "temp_output.wav"
        
        tts.tts_to_file(
            text=req.text, 
            speaker_wav=ref_audio, 
            language=req.language, 
            file_path=temp_file
        )
        
        # Read the file into memory and return it as an audio stream
        with open(temp_file, "rb") as f:
            audio_data = f.read()
            
        return StreamingResponse(io.BytesIO(audio_data), media_type="audio/wav")
        
    except Exception as e:
        print(f"TTS Generation Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
