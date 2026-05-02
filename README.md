# Disha: The Emotionally Intelligent AI Career Companion 🚀

![Disha Banner](https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200)

## 🌟 Introduction

**Disha** is not just another career counselor. She is a state-of-the-art, emotionally intelligent AI companion designed to solve the "Career Paralysis" that millions of students face today. In a world of generic advice and high-pressure expectations, Disha provides a **Zero Judgment Zone** where students can talk freely, explore their true interests, and receive a mathematically backed 60-day roadmap to their dream job.

Developed for the modern Indian student, Disha speaks like a friend, understands regional career nuances, and uses a combination of top-tier LLMs and Voice AI to provide an immersive, human-like experience.

---

## 🏗️ Core Architecture Overview

Disha operates on a distributed architecture to balance intelligence, speed, and high-fidelity voice.

### 1. The Reasoning Engine (Google Gemini)
The core "brain" of Disha is powered by **Gemini 1.5 Pro**. We use Gemini because of its massive context window and its ability to maintain a consistent "Senior Mentor" personality across multiple sessions. Gemini handles:
- Emotional analysis of user input.
- Generation of the personalized 60-day roadmap.
- Extracting career goals from natural conversation.

### 2. The Speed Layer (Groq + Llama 3)
For real-time chat interactions where latency is critical, Disha optionally uses **Groq** to deliver responses in milliseconds. This ensures the voice conversation feels fluid and natural, without the awkward "AI pauses."

### 3. The Voice Layer (Modal + Kokoro)
Hosted on **Modal**, our cloud voice engine uses the **Kokoro-82M** model. 
- **Why Modal?** It allows us to run heavy Python models on high-performance CPUs in the cloud with zero-server management.
- **Why Kokoro?** It is arguably the fastest high-quality TTS model available, capable of generating audio in less than 200ms.

### 4. The High-Fidelity Layer (Local XTTS v2)
For developers with local GPUs (like an RTX 4070), Disha includes a local FastAPI server running **XTTS v2**. This allows for **Zero-Shot Voice Cloning**, meaning Disha can sound exactly like a specific person using a single 10-second reference file (`disha_reference.wav`).

---

## 🔑 Detailed API Configuration Guide

To run Disha, you will need to gather several API keys. This project is built to be modular, so if one service is down, the others keep working.

### 1. Google Gemini API
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Create a new API Key.
3. **Usage**: This is used for the `/api/chat` and `/api/roadmap` routes.
4. **Rate Limits**: The free tier is generous (15 RPM), which is plenty for personal development.

### 2. Groq API
1. Sign up at [Groq Console](https://console.groq.com/).
2. Generate an API key.
3. **Usage**: Used for ultra-fast chat responses during the interview and main chat.

### 3. Modal Account (Cloud Voice)
1. Sign up at [Modal.com](https://modal.com/).
2. Install the Modal CLI: `pip install modal`.
3. Run `modal setup` to link your local machine.
4. **Usage**: Hosts the `modal_voice.py` script which provides the TTS endpoint.

### 4. Firebase Configuration
Disha uses Firebase for:
- **Authentication**: Managing user accounts.
- **Firestore**: Storing student profiles and roadmap progress.
- **Storage**: Saving generated certificates and profile pictures.

**Setup Steps**:
1. Create a project at [Firebase Console](https://console.firebase.google.com/).
2. Enable Email/Password Auth.
3. Create a Firestore Database in Test Mode.
4. Go to Project Settings > General > Your Apps > Web App.
5. Copy the `firebaseConfig` object and paste the values into your `.env.local`.

---

## 🚀 Installation & Local Setup

Follow these precise steps to get the environment running.

### Part 1: Repository Initialization
```bash
# Clone the repository
git clone https://github.com/your-username/disha-ai.git
cd disha-ai

# Create a root .env file (for backend)
# Create a frontend/.env.local file (for frontend)
```

### Part 2: Frontend (Next.js)
The frontend is the command center of Disha.
```bash
cd frontend
npm install

# Setup Environment Variables
# Copy the following into frontend/.env.local:
NEXT_PUBLIC_FIREBASE_API_KEY=xxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxx
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=xxx

GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
NEXT_PUBLIC_MODAL_URL=https://your-modal-app.modal.run/tts

# Start the dev server
npm run dev
```

### Part 3: Cloud Voice Backend (Modal)
This is mandatory for the voice features to work in the browser.
```bash
# From the root directory
cd backend
pip install modal
modal setup
modal deploy modal_voice.py
```
After deployment, Modal will give you a URL like `https://raghav22062003ss--disha-voice-cloner-fastapi-app.modal.run`. Paste this into your `NEXT_PUBLIC_MODAL_URL`.

### Part 4: Local Voice Backend (XTTS - Optional)
If you have a CUDA-enabled GPU and want high-fidelity voice cloning:
1. Ensure you have Python 3.10 installed.
2. Run the provided batch file:
   ```bash
   cd backend
   .\start_voice_server.bat
   ```
3. This script will automatically:
   - Create a virtual environment.
   - Install PyTorch with CUDA 12.1.
   - Install Coqui TTS and XTTS v2.
   - Start a FastAPI server on port 8000.

---

## 🎨 Feature Deep Dive

### 1. The 60-Day Roadmap
Disha doesn't just give you a list of links. She builds a structured 8-week journey:
- **Weeks 1-2**: Foundation & Mindset.
- **Weeks 3-4**: Technical Core & Skill Acquisition.
- **Weeks 5-6**: Project Building & Real-world Application.
- **Weeks 7-8**: Portfolio, Branding & Interview Preparation.

### 2. Fast Forward & Final Interview
Testing a 60-day roadmap in 5 minutes is possible with our **Fast Forward** mode.
- **The Interview**: A 5-minute timed conversation where Disha evaluates your growth.
- **The Evaluation**: Disha analyzes your sentence structure, confidence, and technical clarity to provide an **Improvement Score**.

### 3. Analytics Dashboard
Built with **Recharts**, the dashboard provides a premium data visualization experience:
- **Skill Distribution**: A Pie chart showing your balance between Technical, Soft, and Interview skills.
- **Growth Velocity**: A Bar chart tracking your readiness percentage week-by-week.
- **Readiness Score**: A top-level metric (e.g., 84%) that predicts your hiring probability.

### 4. Certification System
The certificate is generated dynamically using SVG and React. It includes:
- Your name and specialization.
- The issued date.
- Your unique improvement metrics.
- A premium watermark and digital seal for LinkedIn sharing.

---

## 📂 Project Structure

```text
Disha/
├── frontend/                # Next.js Application
│   ├── src/
│   │   ├── app/             # App Router (Pages)
│   │   │   ├── chat/        # Main Chat UI
│   │   │   ├── roadmap/     # 60-Day Tracker
│   │   │   ├── interview/   # Analytics & Interview
│   │   │   └── certificate/ # Cert Generation
│   │   ├── components/      # UI Components (VoiceOrb, etc.)
│   │   └── lib/             # API Utils & Helpers
│   ├── public/              # Static Assets
│   └── package.json         # Node Dependencies
├── backend/                 # Python Voice Engines
│   ├── modal_voice.py       # Cloud TTS (Modal/Kokoro)
│   ├── main.py              # Local TTS (FastAPI/XTTS)
│   └── start_voice_server.bat # Local Setup Script
├── README.md                # This massive guide
└── disha_reference.wav      # Voice Reference for Cloning
```

---

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| **Mic not working** | Ensure you are on HTTPS (or localhost). Check browser permissions. The console will log specific errors like `not-allowed` or `no-speech`. |
| **Voice is silent** | Verify that your `NEXT_PUBLIC_MODAL_URL` is correct and the Modal app is deployed. Check the Modal dashboard for logs. |
| **Roadmap generation fails** | Check your `GEMINI_API_KEY`. The model might be overloaded, or your profile data might be incomplete. |
| **Local XTTS is slow** | Local XTTS requires a GPU. If running on CPU, expect 10-20 seconds of latency. Use Modal for production-like speed. |

---

## 📜 License & Acknowledgments

- **License**: MIT License.
- **Special Thanks**: 
  - The **Kokoro** team for the incredible TTS model.
  - **Google DeepMind** for the Gemini API.
  - **Lucide** for the beautiful iconography.

Developed by a community of AI enthusiasts who believe career guidance should be accessible, friendly, and data-driven.

---

### 🛡️ Safety & Ethics
Disha is programmed to be a supportive mentor. She will not give financial advice, legal advice, or engage in harmful content. All data is stored securely in your private Firebase instance.

---

*This project was created as a demonstration of the power of Agentic AI and Emotionally Intelligent Design. If you found it useful, please consider giving it a ⭐ on GitHub!*
