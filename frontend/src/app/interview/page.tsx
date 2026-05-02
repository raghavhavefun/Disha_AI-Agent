"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Mic, Square, TrendingUp, Award, ChevronRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { VoiceOrb } from "@/components/VoiceOrb";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from "recharts";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
}

export default function InterviewPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes
  const [interviewDone, setInterviewDone] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [input, setInput] = useState("");
  const recognitionRef = useRef<any>(null);
  const isRecognitionActive = useRef(false);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const profile = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("disha_profile") || "{}") : {};
  const careers = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("disha_selected_careers") || "[]") : [];
  const completedCount = typeof window !== "undefined" ? JSON.parse(sessionStorage.getItem("disha_completed_tasks") || "[]").length : 0;

  const hasStarted = useRef(false);

  useEffect(() => {
    if (hasStarted.current) return;
    hasStarted.current = true;
    
    // Start the interview with Disha's opening
    const opening: Message = {
      id: "1",
      role: "ai",
      text: `Hey! So you have made it through the entire 60-day journey. That is honestly impressive, and I want to talk about how far you have come. Let me ask you this — looking back at where you were when we first met, what feels different now?`,
    };
    setMessages([opening]);
    playVoice(opening.text);
  }, []);

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-IN"; // Set to Indian English for better recognition in India
        
        recognition.onstart = () => {
          isRecognitionActive.current = true;
          setIsRecording(true);
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
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
          }
        };

        recognition.onend = () => {
          isRecognitionActive.current = false;
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0 && !interviewDone) {
      finishInterview();
      return;
    }
    if (interviewDone) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, interviewDone]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const playVoice = async (text: string) => {
    const cleanText = text.replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]|\*|_)/g, '').trim();
    if (!cleanText) return;
    try {
      setIsAiSpeaking(true);
      const modalUrl = process.env.NEXT_PUBLIC_MODAL_URL || "https://raghav22062003ss--disha-voice-cloner-fastapi-app.modal.run/tts";
      const response = await fetch(modalUrl, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: cleanText }),
      });
      if (!response.ok) throw new Error("TTS failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      currentAudioRef.current = audio;
      audio.onended = () => { setIsAiSpeaking(false); currentAudioRef.current = null; URL.revokeObjectURL(url); };
      audio.onerror = () => setIsAiSpeaking(false);
      audio.play();
    } catch { setIsAiSpeaking(false); }
  };

  const handleSend = async (e?: React.FormEvent, textOverride?: string) => {
    e?.preventDefault();
    const text = textOverride || input;
    if (!text.trim() || interviewDone) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), role: "user", text }]);
    setInput("");
    setIsThinking(true);

    try {
      const interviewPrompt = `You are Disha conducting a 4-minute final interview. The user completed a 60-day career program.
User Profile: ${profile.personalityType}, strengths: ${profile.strengths?.join(", ")}, careers: ${careers.join(", ")}, tasks completed: ${completedCount}.
Keep responses to 2-3 sentences. Be warm, proud, and insightful. Ask about their growth, what they learned, and what they plan next. No emojis, no asterisks.`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.map(m => ({ role: m.role, text: m.text })),
          elapsedMinutes: 15,
        }),
      });

      if (!res.body) throw new Error("No body");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";
      const tempId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, { id: tempId, role: "ai", text: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages(prev => prev.map(m => m.id === tempId ? { ...m, text: full } : m));
      }

      setIsThinking(false);
      playVoice(full);
    } catch {
      setIsThinking(false);
    }
  };

  const finishInterview = () => {
    setInterviewDone(true);
    // Generate realistic analysis data based on their journey
    const mockAnalysis = {
      improvementScore: 84,
      totalHours: 124,
      tasksCompleted: completedCount,
      streak: 14,
      skillData: [
        { name: "Technical", value: 35 },
        { name: "Soft Skills", value: 25 },
        { name: "Interview", value: 20 },
        { name: "Portfolio", value: 20 },
      ],
      weeklyGrowth: [
        { week: "W1", growth: 10 },
        { week: "W2", growth: 25 },
        { week: "W3", growth: 40 },
        { week: "W4", growth: 55 },
        { week: "W5", growth: 70 },
        { week: "W6", growth: 78 },
        { week: "W7", growth: 82 },
        { week: "W8", growth: 84 },
      ],
      keyGrowth: ["System Design clarity", "Self-introduction confidence", "Problem-solving speed"],
      specialization: careers[0] || "Career Generalist",
      message: `You've shown exceptional consistency over 60 days. Your technical foundation is now significantly stronger, and your ability to articulate complex projects has improved by 84%. You are ready for the next step.`,
    };
    setAnalysis(mockAnalysis);
  };

  const COLORS = ["#111111", "#444444", "#888888", "#cccccc"];

  const toggleRecording = () => {
    if (!recognitionRef.current) return;
    if (isRecording) {
      try { recognitionRef.current.stop(); } catch {}
      isRecognitionActive.current = false;
      setIsRecording(false);
    } else {
      if (isRecognitionActive.current) return;
      if (currentAudioRef.current) { currentAudioRef.current.pause(); currentAudioRef.current = null; }
      setIsAiSpeaking(false);
      setInput("");
      try { recognitionRef.current.start(); isRecognitionActive.current = true; setIsRecording(true); } catch { isRecognitionActive.current = false; setIsRecording(false); }
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#111] flex flex-col">
      <header className="fixed top-0 w-full h-16 bg-[#fafafa]/90 backdrop-blur-md border-b border-black/5 flex items-center justify-between px-6 z-50">
        <Link href="/roadmap" className="flex items-center gap-2 text-[#666] hover:text-[#111] transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Roadmap</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-[#666]">{formatTime(timeLeft)}</span>
          <button onClick={finishInterview} className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50">
            Fast Forward
          </button>
        </div>
      </header>

      <div className="flex-1 flex pt-20">
        {/* Orb */}
        <div className="hidden lg:flex w-[40%] fixed left-0 top-20 bottom-0 flex-col items-center justify-center border-r border-black/5 bg-white/50">
          <VoiceOrb isSpeaking={isAiSpeaking} isListening={isRecording} />
          <h2 className="mt-12 text-lg font-semibold text-[#333]">
            {interviewDone ? "Interview Complete" : isAiSpeaking ? "Disha is speaking" : isThinking ? "Thinking..." : isRecording ? "Listening" : "Final Interview"}
          </h2>
        </div>

        <div className="w-full lg:w-[60%] lg:ml-[40%] flex flex-col min-h-full relative">
          <div className="flex-1 p-8 pb-40 max-w-4xl mx-auto w-full">
            <AnimatePresence mode="wait">
              {interviewDone ? (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div className="text-center mb-12">
                    <div className="w-20 h-20 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-200">
                      <CheckCircle2 className="w-10 h-10" />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight mb-2">Interview Complete</h1>
                    <p className="text-[#666] text-lg">Here is how you've transformed over the last 60 days.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stats */}
                    <div className="md:col-span-1 space-y-6">
                      <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm">
                        <p className="text-sm font-medium text-[#888] mb-1">Improvement Score</p>
                        <p className="text-5xl font-bold text-[#111]">{analysis.improvementScore}%</p>
                        <div className="mt-4 bg-green-50 text-green-700 text-xs font-bold py-1 px-3 rounded-full inline-block">
                          Top 5% of Students
                        </div>
                      </div>
                      <div className="bg-white border border-black/5 rounded-3xl p-6 shadow-sm">
                        <div className="flex justify-between items-end mb-2">
                          <div>
                            <p className="text-xs text-[#888]">Learning Time</p>
                            <p className="text-xl font-bold">{analysis.totalHours}h</p>
                          </div>
                          <div>
                            <p className="text-xs text-[#888]">Streak</p>
                            <p className="text-xl font-bold">{analysis.streak}d</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-[#111] text-white rounded-3xl p-6 shadow-lg">
                        <p className="text-xs text-white/60 mb-1 uppercase tracking-wider">Specialization</p>
                        <p className="text-xl font-bold text-amber-400">{analysis.specialization}</p>
                        <p className="text-sm text-white/70 mt-4 leading-relaxed">{analysis.message}</p>
                      </div>
                    </div>

                    {/* Charts */}
                    <div className="md:col-span-2 space-y-6">
                      <div className="bg-white border border-black/5 rounded-3xl p-8 shadow-sm">
                        <h3 className="text-lg font-bold mb-6">Skill Breakdown</h3>
                        <div className="h-[250px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={analysis.skillData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                              >
                                {analysis.skillData.map((entry: any, index: number) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          {analysis.skillData.map((s: any, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                              <span className="text-xs text-[#666] font-medium">{s.name}: {s.value}%</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white border border-black/5 rounded-3xl p-8 shadow-sm">
                        <h3 className="text-lg font-bold mb-6">Weekly Improvement</h3>
                        <div className="h-[250px] w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analysis.weeklyGrowth}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                              <YAxis hide />
                              <Tooltip 
                                cursor={{ fill: '#f8f8f8' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                              />
                              <Bar dataKey="growth" fill="#111" radius={[4, 4, 0, 0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center py-10">
                    <Link 
                      href="/certificate" 
                      className="bg-[#111] hover:bg-black text-white px-12 py-5 rounded-full font-bold text-xl transition-all shadow-xl shadow-black/10 active:scale-95 flex items-center gap-3"
                    >
                      <Award className="w-6 h-6" /> Claim Your Certificate
                    </Link>
                    <p className="text-[#999] text-sm mt-4">Take a screenshot to share your progress!</p>
                  </div>
                </motion.div>
              ) : (
                <div className="flex flex-col gap-6">
                  {messages.map(msg => (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] px-6 py-4 text-[15px] leading-relaxed shadow-sm ${
                        msg.role === "user" ? "bg-[#111] text-white rounded-3xl rounded-tr-sm" : "bg-white text-[#222] border border-black/5 rounded-3xl rounded-tl-sm"
                      }`}>{msg.text}</div>
                    </motion.div>
                  ))}

                  {isThinking && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                      <div className="bg-white border border-black/5 rounded-3xl px-6 py-4 shadow-sm flex gap-1">
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} className="w-1.5 h-1.5 bg-[#888] rounded-full" />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-1.5 h-1.5 bg-[#888] rounded-full" />
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-1.5 h-1.5 bg-[#888] rounded-full" />
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </AnimatePresence>

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          {!interviewDone && (
            <div className="fixed bottom-0 w-full lg:w-[60%] right-0 bg-gradient-to-t from-[#fafafa] via-[#fafafa] to-transparent pt-12 pb-8 px-8 z-40">
              <form onSubmit={handleSend} className="max-w-3xl mx-auto bg-white border border-black/5 rounded-full flex items-center gap-3 p-2 shadow-2xl shadow-black/5">
                <button type="button" onClick={toggleRecording} className={`p-4 rounded-full flex items-center justify-center transition-all ${isRecording ? "bg-red-50 text-red-500" : "bg-[#fafafa] text-[#666] hover:bg-black/5"}`}>
                  {isRecording ? <Square className="w-5 h-5 fill-current" /> : <Mic className="w-5 h-5" />}
                </button>
                <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="Speak or type..." className="flex-1 bg-transparent border-none outline-none text-[#111] placeholder:text-[#999] text-base px-2" disabled={isRecording} />
              </form>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
