"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Sparkles, ChevronRight, Zap, Target, Heart, Brain, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Profile {
  name: string;
  age: string;
  institution: string;
  organization: string;
  passion: string;
  aim: string;
  skills: string[];
  personalityType: string;
  strengths: string[];
  expertise: string[];
  personalityTraits: string[];
  weaknesses: string[];
  areasToImprove: string[];
  skillsToLearn: string[];
  bestFitIndustries: string[];
  recommendedCareers: string[];
  summary: string;
}

// Sample profile for testing via Fast Forward
const SAMPLE_PROFILE: Profile = {
  name: "Explorer",
  age: "21",
  institution: "IIT Bombay",
  organization: "Not mentioned",
  passion: "Artificial Intelligence and Ethics",
  aim: "To build sustainable AI solutions for rural India",
  skills: ["Python", "Public Speaking", "Quick Learning"],
  personalityType: "The Purposeful Innovator",
  strengths: ["Strategic Thinking", "High Empathy", "Technical Aptitude", "Resilience"],
  expertise: ["Data Structures", "Open Source Contribution", "Community Building"],
  personalityTraits: ["Visionary", "Analytical", "Compassionate", "Persistent"],
  weaknesses: ["Occasional Burnout", "Imposter Syndrome", "Delegation Issues"],
  areasToImprove: ["Personal Branding", "Networking Skills", "Advanced Math"],
  skillsToLearn: ["Large Language Models", "Product Management", "VC Fundamentals", "Venture Capital"],
  bestFitIndustries: ["Tech", "Social Impact", "Education", "Consulting"],
  recommendedCareers: ["AI Product Manager", "Social Entrepreneur", "Strategy Consultant"],
  summary: "You are a rare combination of technical talent and deep social awareness. Your desire to help rural India isn't just a whim; it's a core driver that makes your technical work meaningful. You thrive when you see the human impact of your code, and your ability to learn quickly will be your greatest asset in this fast-evolving landscape.",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load profile from sessionStorage (saved by chat page)
    const stored = sessionStorage.getItem("disha_profile");
    if (stored) {
      setProfile(JSON.parse(stored));
      setLoading(false);
    } else {
      // No profile yet — check if conversation data exists
      const convo = sessionStorage.getItem("disha_conversation");
      if (convo) {
        generateProfile(JSON.parse(convo));
      } else {
        setLoading(false);
      }
    }
  }, []);

  const generateProfile = async (history: any[]) => {
    setLoading(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history }),
      });
      const data = await res.json();
      setProfile(data);
      sessionStorage.setItem("disha_profile", JSON.stringify(data));
    } catch (error) {
      console.error("Failed to generate profile:", error);
    }
    setLoading(false);
  };

  const handleFastForward = () => {
    setProfile(SAMPLE_PROFILE);
    sessionStorage.setItem("disha_profile", JSON.stringify(SAMPLE_PROFILE));
    setLoading(false);
  };

  const handleUnlock = () => {
    // TODO: Integrate Razorpay here
    setIsUnlocked(true);
    sessionStorage.setItem("disha_unlocked", "true");
  };

  const handleContinue = () => {
    router.push("/careers");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-12 h-12 border-2 border-[#111] border-t-transparent rounded-full mx-auto mb-6"
          />
          <p className="text-[#666] text-lg">Analyzing your personality...</p>
          <p className="text-[#999] text-sm mt-2">This takes about 10 seconds</p>
        </div>
      </main>
    );
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4">No conversation found</h2>
          <p className="text-[#666] mb-8">Complete a session with Disha first to get your personality profile.</p>
          <div className="flex flex-col gap-3">
            <Link href="/chat" className="bg-[#111] text-white px-8 py-4 rounded-full font-semibold text-center">
              Start Session with Disha
            </Link>
            <button onClick={handleFastForward} className="text-sm text-red-500 border border-red-200 px-6 py-3 rounded-full hover:bg-red-50 transition-colors">
              Fast Forward (Testing)
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#111]">
      {/* Header */}
      <header className="fixed top-0 w-full h-16 bg-[#fafafa]/90 backdrop-blur-md border-b border-black/5 flex items-center justify-between px-6 z-50">
        <Link href="/chat" className="flex items-center gap-2 text-[#666] hover:text-[#111] transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </Link>
        <button onClick={handleFastForward} className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50">
          Fast Forward
        </button>
      </header>

      <div className="pt-24 pb-16 px-6 max-w-3xl mx-auto">
        {/* Hero Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-br from-[#111] to-[#333] rounded-full mx-auto mb-6 flex items-center justify-center shadow-xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <p className="text-sm font-medium text-[#888] uppercase tracking-widest mb-2">Your Personality</p>
          <h1 className="text-4xl font-bold tracking-tight mb-3">{profile.personalityType}</h1>
          <p className="text-[#555] text-lg leading-relaxed max-w-xl mx-auto">{profile.summary}</p>
        </motion.div>

        {/* Core Details Section */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-3xl p-8 border border-black/5 shadow-sm mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-[#111]" />
            <h3 className="font-bold text-xl">Core Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
            <div>
              <p className="text-xs font-bold text-[#aaa] uppercase tracking-tighter mb-1">Name</p>
              <p className="text-sm font-medium">{profile.name}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#aaa] uppercase tracking-tighter mb-1">Age</p>
              <p className="text-sm font-medium">{profile.age}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#aaa] uppercase tracking-tighter mb-1">Institution</p>
              <p className="text-sm font-medium">{profile.institution}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-[#aaa] uppercase tracking-tighter mb-1">Organization</p>
              <p className="text-sm font-medium">{profile.organization}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-bold text-[#aaa] uppercase tracking-tighter mb-1">Career Aim</p>
              <p className="text-sm font-medium">{profile.aim}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs font-bold text-[#aaa] uppercase tracking-tighter mb-1">Passion</p>
              <p className="text-sm font-medium">{profile.passion}</p>
            </div>
          </div>

          {isUnlocked && (profile.institution === "Not mentioned" || profile.age === "Not mentioned" || profile.name === "Explorer") && (
            <div className="mt-8 pt-8 border-t border-black/5">
              <p className="text-sm font-semibold mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 text-rose-500" /> Complete your details for a better roadmap
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input 
                  type="text" 
                  placeholder="Your Name" 
                  className="bg-[#fafafa] border border-black/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-black/20"
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Age" 
                  className="bg-[#fafafa] border border-black/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-black/20"
                  onChange={(e) => setProfile({...profile, age: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Institution/College" 
                  className="bg-[#fafafa] border border-black/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-black/20"
                  onChange={(e) => setProfile({...profile, institution: e.target.value})}
                />
                <input 
                  type="text" 
                  placeholder="Current Aim" 
                  className="bg-[#fafafa] border border-black/5 rounded-xl px-4 py-3 text-sm outline-none focus:border-black/20"
                  onChange={(e) => setProfile({...profile, aim: e.target.value})}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Visible Section: Strengths, Expertise, Passions, Traits */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-5 h-5 text-amber-500" />
              <h3 className="font-semibold text-lg">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {profile.strengths.map((s, i) => (
                <li key={i} className="text-[#444] text-sm flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">●</span> {s}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-blue-500" />
              <h3 className="font-semibold text-lg">Expertise</h3>
            </div>
            <ul className="space-y-2">
              {profile.expertise.map((e, i) => (
                <li key={i} className="text-[#444] text-sm flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">●</span> {e}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-rose-500" />
              <h3 className="font-semibold text-lg">Key Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((s, i) => (
                <span key={i} className="bg-rose-50 text-rose-700 text-sm px-3 py-1 rounded-full border border-rose-100">{s}</span>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-purple-500" />
              <h3 className="font-semibold text-lg">Personality</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {profile.personalityTraits.map((t, i) => (
                <span key={i} className="bg-purple-50 text-purple-700 text-sm px-3 py-1 rounded-full border border-purple-100">{t}</span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Blurred / Locked Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="relative mb-8">
          {!isUnlocked && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/60 backdrop-blur-md rounded-2xl">
              <Lock className="w-10 h-10 text-[#111] mb-4" />
              <h3 className="text-xl font-bold mb-2">Unlock Your Full Profile</h3>
              <p className="text-[#666] text-sm mb-6 max-w-xs text-center">See your weaknesses, skills to learn, best-fit industries, and get a personalized 60-day roadmap.</p>
              <button onClick={handleUnlock} className="bg-[#111] text-white px-8 py-3.5 rounded-full font-semibold shadow-lg hover:bg-black transition-all active:scale-95">
                Unlock — ₹799
              </button>
            </div>
          )}

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-5 ${!isUnlocked ? "blur-md pointer-events-none select-none" : ""}`}>
            <div className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-lg">Areas to Improve</h3>
              </div>
              <ul className="space-y-2">
                {profile.weaknesses.map((w, i) => (
                  <li key={i} className="text-[#444] text-sm flex items-start gap-2">
                    <span className="text-orange-500 mt-0.5">●</span> {w}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-teal-500" />
                <h3 className="font-semibold text-lg">Skills to Learn</h3>
              </div>
              <ul className="space-y-2">
                {profile.skillsToLearn.map((s, i) => (
                  <li key={i} className="text-[#444] text-sm flex items-start gap-2">
                    <span className="text-teal-500 mt-0.5">●</span> {s}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-indigo-500" />
                <h3 className="font-semibold text-lg">Things to Work On</h3>
              </div>
              <ul className="space-y-2">
                {profile.areasToImprove.map((a, i) => (
                  <li key={i} className="text-[#444] text-sm flex items-start gap-2">
                    <span className="text-indigo-500 mt-0.5">●</span> {a}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-black/5 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                <h3 className="font-semibold text-lg">Best-Fit Industries</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {profile.bestFitIndustries.map((ind, i) => (
                  <span key={i} className="bg-emerald-50 text-emerald-700 text-sm px-3 py-1 rounded-full border border-emerald-100">{ind}</span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Continue Button */}
        {isUnlocked && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <button onClick={handleContinue} className="bg-[#111] text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-black transition-all active:scale-95 inline-flex items-center gap-2">
              Choose Your Career Path <ChevronRight className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}
