"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Mic, Square, ArrowLeft, Clock, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VoiceOrb } from "@/components/VoiceOrb";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      text: "Hey! I'm Disha — think of me as that one senior who actually has time for you and zero judgment. Before we get into career stuff, I just want to know — how are you actually doing right now? Like genuinely.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [voiceMode, setVoiceMode] = useState(true); // Voice ON by default
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [sessionEnded, setSessionEnded] = useState(false);
  const messagesRef = useRef<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);
  
  const recognitionRef = useRef<any>(null);
  const isRecognitionActive = useRef(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize Speech Recognition (once)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-IN"; // Set to Indian English for better recognition in India
        
        recognition.onstart = () => {
          console.log("Speech recognition started");
          isRecognitionActive.current = true;
          setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          console.log("Transcription result:", transcript);
          isRecognitionActive.current = false;
          setIsRecording(false);
          setInput(transcript);
          setTimeout(() => handleSend(undefined, transcript), 150);
        };

        recognition.onerror = (event: any) => {
          console.error("Speech error:", event.error);
          isRecognitionActive.current = false;
          setIsRecording(false);
          
          if (event.error === 'no-speech') {
            alert("I didn't hear anything. Could you try speaking again?");
          } else if (event.error === 'not-allowed') {
            alert("Microphone permission was denied. Please check your browser settings.");
          } else if (event.error === 'network') {
            alert("Network error occurred during transcription.");
          }
        };
        
        recognition.onend = () => {
          console.log("Speech recognition ended");
          isRecognitionActive.current = false;
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const router = useRouter();

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setSessionEnded(true);
      stopAudio(); // Stop any playing voice
      // Save conversation for profile analysis
      sessionStorage.setItem("disha_conversation", JSON.stringify(messagesRef.current));
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setIsAiSpeaking(false);
  };

  const playVoice = async (text: string) => {
    // Strip emojis, asterisks, and markdown before sending to TTS
    const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]|\*|_)/g, '').trim();
    if (!cleanText) {
      setIsGeneratingVoice(false);
      setIsAiSpeaking(false);
      return;
    }

    try {
      setIsGeneratingVoice(true);
      setIsAiSpeaking(false);
      
      const modalUrl = process.env.NEXT_PUBLIC_MODAL_URL || "https://raghav22062003ss--disha-voice-cloner-fastapi-app.modal.run/tts";
      
      const response = await fetch(modalUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanText })
      });

      if (!response.ok) {
        throw new Error("Backend TTS generation failed.");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      
      setIsGeneratingVoice(false);
      setIsAiSpeaking(true);
      
      audio.onended = () => {
        setIsAiSpeaking(false);
        currentAudioRef.current = null;
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsAiSpeaking(false);
        setIsGeneratingVoice(false);
        currentAudioRef.current = null;
      };
      audio.play();

    } catch (error) {
      console.error("Voice playback error:", error);
      setIsAiSpeaking(false);
      setIsGeneratingVoice(false);
    }
  };

  const handleSend = async (e?: React.FormEvent, textOverride?: string) => {
    e?.preventDefault();
    const textToSend = textOverride || input;
    if (!textToSend.trim() || sessionEnded) return;

    const newMessage: Message = { id: Date.now().toString(), role: "user", text: textToSend };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setIsThinking(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend, history: messages, elapsedMinutes: Math.floor((30 * 60 - timeLeft) / 60) }),
      });
      
      if (!res.body) throw new Error("No response body");
      
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullAiResponse = "";
      
      const tempId = (Date.now() + 1).toString();
      
      setMessages((prev) => [...prev, { id: tempId, role: "ai", text: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        fullAiResponse += chunk;
        
        setMessages((prev) => 
          prev.map(msg => msg.id === tempId ? { ...msg, text: fullAiResponse } : msg)
        );
      }
      
      // If it looks like JSON error, extract the message
      if (fullAiResponse.startsWith("{")) {
        try {
          const parsed = JSON.parse(fullAiResponse);
          fullAiResponse = parsed.text || fullAiResponse;
          setMessages((prev) =>
            prev.map(msg => msg.id === tempId ? { ...msg, text: fullAiResponse } : msg)
          );
        } catch { /* not JSON, normal text */ }
      }

      setIsThinking(false);

      // Only generate voice if voice mode is ON
      if (voiceMode) {
        playVoice(fullAiResponse);
      }
      
    } catch (error) {
      console.error(error);
      setIsThinking(false);
      setIsAiSpeaking(false);
      setIsGeneratingVoice(false);
    }
  };

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      alert("Voice recognition is not supported in this browser. Try Chrome.");
      return;
    }
    
    if (isRecording) {
      try { recognitionRef.current.stop(); } catch {}
      isRecognitionActive.current = false;
      setIsRecording(false);
    } else {
      if (isRecognitionActive.current) return;
      
      // Stop any currently playing audio
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      setIsAiSpeaking(false);
      setIsGeneratingVoice(false);
      setInput("");
      try {
        recognitionRef.current.start();
        isRecognitionActive.current = true;
        setIsRecording(true);
      } catch (e) {
        console.warn("Recognition start failed:", e);
        isRecognitionActive.current = false;
        setIsRecording(false);
      }
    }
  };

  const toggleVoiceMode = () => {
    // If turning voice off, stop any playing audio
    if (voiceMode) {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current = null;
      }
      setIsAiSpeaking(false);
      setIsGeneratingVoice(false);
      // Stop recording if active
      if (isRecording && recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch {}
        isRecognitionActive.current = false;
        setIsRecording(false);
      }
    }
    setVoiceMode(!voiceMode);
  };

  const getOrbStatus = () => {
    if (!voiceMode) return "Text mode";
    if (isAiSpeaking) return "Disha is speaking";
    if (isGeneratingVoice) return "Generating voice...";
    if (isThinking) return "Disha is thinking...";
    if (isRecording) return "Listening to you";
    return "Disha is ready";
  };

  return (
    <main className="min-h-screen bg-[#fafafa] flex flex-col text-[#111111]">
      <header className="fixed top-0 w-full h-20 bg-[#fafafa]/90 backdrop-blur-md border-b border-black/5 flex items-center justify-between px-8 z-50">
        <Link href="/" className="flex items-center gap-2 text-[#666] hover:text-[#111] transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </Link>
        <div className="flex items-center gap-4">
          {/* Voice Mode Toggle */}
          <button
            onClick={toggleVoiceMode}
            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full border transition-all duration-300 ${
              voiceMode
                ? "bg-[#111] text-white border-[#111] shadow-md"
                : "bg-white text-[#666] border-black/10 hover:border-black/20"
            }`}
          >
            {voiceMode ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            {voiceMode ? "Voice ON" : "Voice OFF"}
          </button>

          <div className="text-sm font-medium px-4 py-2 rounded-full bg-white border border-black/5 shadow-sm flex items-center gap-2 text-[#444]">
            <Clock className="w-4 h-4 text-[#888]" />
            {formatTime(timeLeft)}
          </div>
          <button 
            onClick={() => setTimeLeft(5)} 
            className="text-xs font-semibold text-red-500 border border-red-500/20 px-3 py-1.5 rounded-full hover:bg-red-50 transition-colors"
          >
            Fast Forward
          </button>
        </div>
      </header>

      <div className="flex-1 flex pt-20 h-[100vh]">
        {/* Only show orb panel when voice mode is ON */}
        {voiceMode && (
          <div className="hidden lg:flex w-[40%] fixed left-0 top-20 bottom-0 flex-col items-center justify-center border-r border-black/5 bg-white/50">
            <VoiceOrb isSpeaking={isAiSpeaking} isListening={isRecording} />
            <h2 className="mt-12 text-lg font-semibold tracking-wide text-[#333]">
              {getOrbStatus()}
            </h2>
          </div>
        )}

        <div className={`flex flex-col min-h-full relative ${voiceMode ? "w-full lg:w-[60%] lg:ml-[40%]" : "w-full"}`}>
          <div className={`flex-1 p-8 pb-40 mx-auto w-full flex flex-col gap-8 ${voiceMode ? "max-w-3xl" : "max-w-4xl"}`}>
            <AnimatePresence>
              {sessionEnded ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="bg-white border border-black/5 p-10 rounded-[2rem] mt-10 text-center shadow-2xl shadow-black/5"
                >
                  <div className="w-20 h-20 bg-[#111] rounded-full mx-auto mb-8 flex items-center justify-center text-white text-3xl shadow-lg shadow-black/20">✨</div>
                  <h2 className="text-3xl font-bold mb-4 text-[#111] tracking-tight">Your Profile is Ready</h2>
                  <p className="text-[#555] text-lg mb-10 leading-relaxed max-w-md mx-auto">
                    Disha has finished analyzing your goals and personality. Let us show you what she found.
                  </p>
                  <button 
                    onClick={() => {
                      sessionStorage.setItem("disha_conversation", JSON.stringify(messages));
                      router.push("/profile");
                    }}
                    className="bg-[#111] hover:bg-black text-white px-10 py-4 rounded-full font-semibold text-lg transition-all w-full shadow-lg shadow-black/10 active:scale-95"
                  >
                    View My Personality Profile
                  </button>
                </motion.div>
              ) : (
                messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] px-6 py-4 text-[15px] leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "bg-[#111111] text-white rounded-3xl rounded-tr-sm shadow-black/10"
                          : "bg-white text-[#222] border border-black/5 rounded-3xl rounded-tl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
            
            {/* Loading Indicator */}
            {isThinking && messages[messages.length - 1]?.role === "user" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white text-[#888] border border-black/5 rounded-3xl px-6 py-4 text-[15px] shadow-sm flex items-center gap-1">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-[#888] rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#888] rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#888] rounded-full" />
                </div>
              </motion.div>
            )}

            {/* Voice Generating Indicator */}
            {isGeneratingVoice && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="bg-white text-[#888] border border-black/5 rounded-3xl px-6 py-4 text-[13px] shadow-sm italic">
                  Preparing voice...
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {!sessionEnded && (
            <div className={`fixed bottom-0 right-0 bg-gradient-to-t from-[#fafafa] via-[#fafafa] to-transparent pt-12 pb-8 px-8 z-40 ${voiceMode ? "w-full lg:w-[60%]" : "w-full"}`}>
              <form
                onSubmit={(e) => handleSend(e)}
                className={`mx-auto bg-white border border-black/5 rounded-full flex items-center gap-3 p-2 shadow-2xl shadow-black/5 ${voiceMode ? "max-w-3xl" : "max-w-4xl"}`}
              >
                {/* Mic button — only visible in voice mode */}
                {voiceMode && (
                  <button
                    type="button"
                    onClick={toggleRecording}
                    className={`p-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isRecording 
                        ? "bg-red-50 text-red-500 shadow-inner" 
                        : "bg-[#fafafa] text-[#666] hover:bg-black/5"
                    }`}
                  >
                    {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
                  </button>
                )}
                
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isRecording ? "Listening... (Speak now)" : "Message Disha..."}
                  className="flex-1 bg-transparent border-none outline-none text-[#111111] placeholder:text-[#999] text-base px-2"
                  disabled={isRecording}
                />
                
                <button
                  type="submit"
                  disabled={!input.trim() || isRecording}
                  className={`p-4 rounded-full flex items-center justify-center transition-all duration-300 ${
                    input.trim() && !isRecording
                      ? "bg-[#111111] text-white hover:bg-black shadow-md"
                      : "bg-[#fafafa] text-[#ccc]"
                  }`}
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
