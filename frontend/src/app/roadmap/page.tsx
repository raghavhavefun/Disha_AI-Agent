"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, CheckCircle2, Circle, ChevronDown, ChevronRight, Trophy, Newspaper, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Task {
  title: string;
  description: string;
  type: string;
  resourceUrl?: string;
  resourceName?: string;
  estimatedMinutes: number;
  completed?: boolean;
}

interface Day {
  dayNumber: number;
  tasks: Task[];
}

interface Week {
  weekNumber: number;
  theme: string;
  days: Day[];
}

interface Roadmap {
  weeks: Week[];
}

// Sample roadmap for fast forward
const SAMPLE_ROADMAP: Roadmap = {
  weeks: Array.from({ length: 8 }, (_, wi) => ({
    weekNumber: wi + 1,
    theme: ["Foundation", "Core Skills", "Deep Dive", "Building", "Projects", "Portfolio", "Interview Prep", "Launch"][wi],
    days: Array.from({ length: 7 }, (_, di) => ({
      dayNumber: wi * 7 + di + 1,
      tasks: [
        {
          title: `Day ${wi * 7 + di + 1} Task`,
          description: "Complete this learning task to build your skills.",
          type: ["video", "course", "project", "practice", "reading"][Math.floor(Math.random() * 5)],
          resourceUrl: "https://www.youtube.com/results?search_query=career+skills",
          resourceName: "Learning Resource",
          estimatedMinutes: 30 + Math.floor(Math.random() * 60),
          completed: false,
        },
      ],
    })),
  })),
};

export default function RoadmapPage() {
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedWeek, setExpandedWeek] = useState<number>(1);
  const [dailyFact, setDailyFact] = useState<string | null>(null);
  const [factLoading, setFactLoading] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("disha_roadmap");
    if (stored) {
      setRoadmap(JSON.parse(stored));
      setLoading(false);
    } else {
      generateRoadmap();
    }

    // Load completed tasks
    const savedCompleted = sessionStorage.getItem("disha_completed_tasks");
    if (savedCompleted) {
      setCompletedTasks(new Set(JSON.parse(savedCompleted)));
    }
  }, []);

  const generateRoadmap = async () => {
    setLoading(true);
    try {
      const profile = JSON.parse(sessionStorage.getItem("disha_profile") || "{}");
      const careers = JSON.parse(sessionStorage.getItem("disha_selected_careers") || "[]");

      if (!profile.personalityType || careers.length === 0) {
        handleFastForward();
        return;
      }

      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, selectedCareers: careers }),
      });

      const data = await res.json();
      setRoadmap(data);
      sessionStorage.setItem("disha_roadmap", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to generate roadmap:", error);
      handleFastForward();
    }
    setLoading(false);
  };

  const handleFastForward = () => {
    // Fill roadmap with sample data so other pages don't break
    setRoadmap(SAMPLE_ROADMAP);
    sessionStorage.setItem("disha_roadmap", JSON.stringify(SAMPLE_ROADMAP));
    // Set tasks as nearly complete to trigger "Final Interview" readiness
    setCompletedTasks(new Set(Array.from({ length: 56 }, (_, i) => `w${Math.floor(i / 7) + 1}-d${(i % 7) + 1}-t0`)));
    sessionStorage.setItem("disha_completed_tasks", JSON.stringify(Array.from({ length: 56 }, (_, i) => `w${Math.floor(i / 7) + 1}-d${(i % 7) + 1}-t0`)));
    
    // Navigate to interview
    router.push("/interview");
  };

  const toggleTask = async (weekNum: number, dayNum: number, taskIdx: number) => {
    if (!roadmap) return;

    const taskKey = `w${weekNum}-d${dayNum}-t${taskIdx}`;
    const newCompleted = new Set(completedTasks);
    const wasCompleted = newCompleted.has(taskKey);

    if (wasCompleted) {
      newCompleted.delete(taskKey);
    } else {
      newCompleted.add(taskKey);
      // Fetch a daily fact when completing a task
      fetchDailyFact();
    }

    setCompletedTasks(newCompleted);
    sessionStorage.setItem("disha_completed_tasks", JSON.stringify([...newCompleted]));
  };

  const fetchDailyFact = async () => {
    setFactLoading(true);
    try {
      const careers = JSON.parse(sessionStorage.getItem("disha_selected_careers") || "[]");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Give me one interesting and useful industry fact, news, or tip related to these career fields: ${careers.join(", ")}. Keep it to 1-2 sentences. Be specific and current. No emojis.`,
          history: [],
          elapsedMinutes: 15,
        }),
      });

      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullText = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
        }
        setDailyFact(fullText);
        setTimeout(() => setDailyFact(null), 12000);
      }
    } catch {
      setDailyFact(null);
    }
    setFactLoading(false);
  };

  const totalTasks = roadmap?.weeks.reduce((sum, w) => sum + w.days.reduce((s, d) => s + d.tasks.length, 0), 0) || 0;
  const completedCount = completedTasks.size;
  const progressPercent = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const currentDay = completedCount + 1;

  // Check for certificate milestones
  const getCertificateMilestone = () => {
    const completedDays = completedCount;
    if (completedDays >= 56) return { week: 8, label: "Final Certificate" };
    if (completedDays >= 42) return { week: 6, label: "Week 6 Certificate" };
    if (completedDays >= 28) return { week: 4, label: "Week 4 Certificate" };
    if (completedDays >= 14) return { week: 2, label: "Week 2 Certificate" };
    return null;
  };

  const milestone = getCertificateMilestone();

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }} className="w-12 h-12 border-2 border-[#111] border-t-transparent rounded-full mx-auto mb-6" />
          <p className="text-[#666] text-lg">Building your 60-day roadmap...</p>
          <p className="text-[#999] text-sm mt-2">AI is personalizing tasks for your career goals</p>
        </div>
      </main>
    );
  }

  if (!roadmap) return null;

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#111]">
      <header className="fixed top-0 w-full h-16 bg-[#fafafa]/90 backdrop-blur-md border-b border-black/5 flex items-center justify-between px-6 z-50">
        <Link href="/careers" className="flex items-center gap-2 text-[#666] hover:text-[#111] transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Careers</span>
        </Link>
        <div className="flex items-center gap-3">
          {milestone && (
            <button onClick={() => router.push("/certificate")} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full flex items-center gap-1">
              <Trophy className="w-3 h-3" /> {milestone.label}
            </button>
          )}
          <button onClick={handleFastForward} className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50">
            Fast Forward
          </button>
        </div>
      </header>

      <div className="pt-24 pb-16 px-6 max-w-3xl mx-auto">
        {/* Progress Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Your 60-Day Roadmap</h1>
          <p className="text-[#666] mb-4">Day {Math.min(currentDay, 60)} of 60</p>

          {/* Progress Bar */}
          <div className="bg-black/5 rounded-full h-3 overflow-hidden mb-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#111] to-[#444] rounded-full"
            />
          </div>
          <div className="flex justify-between text-xs text-[#999]">
            <span>{completedCount} tasks done</span>
            <span>{progressPercent}% complete</span>
          </div>
        </motion.div>

        {/* Daily Fact Toast */}
        <AnimatePresence>
          {(dailyFact || factLoading) && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl p-4 mb-6"
            >
              <div className="flex items-start gap-3">
                {factLoading ? (
                  <Loader2 className="w-5 h-5 text-blue-500 animate-spin mt-0.5" />
                ) : (
                  <Newspaper className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="text-xs font-medium text-blue-700 mb-1">Industry Insight</p>
                  <p className="text-sm text-[#444]">{factLoading ? "Finding something interesting for you..." : dailyFact}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Weeks */}
        <div className="space-y-4">
          {roadmap.weeks.map(week => {
            const isExpanded = expandedWeek === week.weekNumber;
            const weekTasks = week.days.reduce((sum, d) => sum + d.tasks.length, 0);
            const weekCompleted = week.days.reduce((sum, d) => {
              return sum + d.tasks.filter((_, ti) => completedTasks.has(`w${week.weekNumber}-d${d.dayNumber}-t${ti}`)).length;
            }, 0);
            const weekDone = weekCompleted === weekTasks && weekTasks > 0;

            return (
              <motion.div key={week.weekNumber} layout className="bg-white rounded-2xl border border-black/5 overflow-hidden shadow-sm">
                <button
                  onClick={() => setExpandedWeek(isExpanded ? 0 : week.weekNumber)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    {weekDone ? (
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-black/5 rounded-full flex items-center justify-center text-sm font-bold text-[#666]">
                        {week.weekNumber}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">Week {week.weekNumber}: {week.theme}</p>
                      <p className="text-xs text-[#999]">{weekCompleted}/{weekTasks} tasks completed</p>
                    </div>
                  </div>
                  {isExpanded ? <ChevronDown className="w-5 h-5 text-[#999]" /> : <ChevronRight className="w-5 h-5 text-[#999]" />}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 space-y-3">
                        {week.days.map(day => (
                          <div key={day.dayNumber} className="border-l-2 border-black/5 pl-4">
                            <p className="text-xs font-medium text-[#888] mb-2">Day {day.dayNumber}</p>
                            {day.tasks.map((task, ti) => {
                              const taskKey = `w${week.weekNumber}-d${day.dayNumber}-t${ti}`;
                              const isDone = completedTasks.has(taskKey);

                              return (
                                <div key={ti} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${isDone ? "bg-green-50" : "hover:bg-black/[0.02]"}`}>
                                  <button onClick={() => toggleTask(week.weekNumber, day.dayNumber, ti)} className="mt-0.5 flex-shrink-0">
                                    {isDone ? (
                                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    ) : (
                                      <Circle className="w-5 h-5 text-[#ccc] hover:text-[#888] transition-colors" />
                                    )}
                                  </button>
                                  <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium ${isDone ? "line-through text-[#999]" : "text-[#222]"}`}>{task.title}</p>
                                    <p className="text-xs text-[#888] mt-0.5">{task.description}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                      <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-black/5 text-[#888]">{task.type}</span>
                                      <span className="text-[10px] text-[#aaa]">{task.estimatedMinutes} min</span>
                                      {task.resourceUrl && (
                                        <a href={task.resourceUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-500 hover:text-blue-700 flex items-center gap-0.5">
                                          {task.resourceName || "Resource"} <ExternalLink className="w-2.5 h-2.5" />
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Final Interview Button — shows after completing enough tasks */}
        {progressPercent >= 80 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-10 text-center">
            <button onClick={() => router.push("/interview")} className="bg-[#111] text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-black transition-all active:scale-95 inline-flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" /> Start Final Interview with Disha
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}
