"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Award, Share2, Trophy } from "lucide-react";
import Link from "next/link";

export default function CertificatePage() {
  const [profile, setProfile] = useState<any>(null);
  const [careers, setCareers] = useState<string[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const certRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const p = sessionStorage.getItem("disha_profile");
    if (p) setProfile(JSON.parse(p));
    const c = sessionStorage.getItem("disha_selected_careers");
    if (c) setCareers(JSON.parse(c));
    const tasks = sessionStorage.getItem("disha_completed_tasks");
    if (tasks) setCompletedCount(JSON.parse(tasks).length);
  }, []);

  const getMilestone = () => {
    if (completedCount >= 56) return { week: 8, title: "Career Launch Certification", type: "final" };
    if (completedCount >= 42) return { week: 6, title: "Advanced Skills Certificate", type: "milestone" };
    if (completedCount >= 28) return { week: 4, title: "Core Competency Certificate", type: "milestone" };
    if (completedCount >= 14) return { week: 2, title: "Foundation Skills Certificate", type: "milestone" };
    return { week: 0, title: "Keep going!", type: "none" };
  };

  const milestone = getMilestone();
  const today = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  const handleFastForward = () => {
    setCompletedCount(56);
    sessionStorage.setItem("disha_completed_tasks", JSON.stringify(Array.from({ length: 56 }, (_, i) => `w${Math.floor(i / 7) + 1}-d${i + 1}-t0`)));
  };

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#111]">
      <header className="fixed top-0 w-full h-16 bg-[#fafafa]/90 backdrop-blur-md border-b border-black/5 flex items-center justify-between px-6 z-50">
        <Link href="/roadmap" className="flex items-center gap-2 text-[#666] hover:text-[#111] transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Roadmap</span>
        </Link>
        <button onClick={handleFastForward} className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50">
          Fast Forward
        </button>
      </header>

      <div className="pt-24 pb-16 px-6 max-w-2xl mx-auto">
        {milestone.type === "none" ? (
          <div className="text-center py-20">
            <Award className="w-16 h-16 text-[#ccc] mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-3">No certificates yet</h2>
            <p className="text-[#666]">Complete 14 tasks to earn your first certificate.</p>
            <p className="text-[#999] text-sm mt-2">{completedCount} tasks completed so far</p>
            <Link href="/roadmap" className="inline-block mt-6 bg-[#111] text-white px-8 py-3 rounded-full font-semibold">
              Back to Roadmap
            </Link>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            {/* Certificate Card */}
            <div ref={certRef} className="bg-white rounded-[2.5rem] border-[3px] border-[#111] p-12 shadow-2xl shadow-black/10 mb-8 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-black/[0.02] rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/[0.02] rounded-tr-full" />
              
              <div className="border-[1.5px] border-black/10 rounded-[1.5rem] p-10 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-[#111] to-[#444] rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl">
                  <Award className="w-10 h-10 text-white" />
                </div>

                <p className="text-[10px] font-bold text-[#888] uppercase tracking-[0.4em] mb-6">Official Certification of Excellence</p>

                <h1 className="text-4xl font-bold tracking-tight mb-4 text-[#111]">{milestone.title}</h1>

                <p className="text-[#666] text-xl mb-8">This is to certify that</p>
                <p className="text-3xl font-black mb-8 tracking-tight text-[#111]">{profile?.name || "The Explorer"}</p>

                <div className="w-32 h-[2px] bg-black/10 mx-auto mb-8" />

                <p className="text-[#555] text-base leading-relaxed max-w-lg mx-auto mb-10">
                  Has successfully completed an intensive 60-day career acceleration program, demonstrating mastery in key competencies and showing a verified improvement of <span className="font-bold text-[#111]">84%</span> in professional readiness
                  {careers.length > 0 && <span> for <span className="font-bold text-[#111]">{careers.join(", ")}</span> roles</span>}.
                </p>

                <div className="flex flex-col items-center gap-6 mb-10">
                  <div className="bg-amber-50 text-amber-800 border border-amber-200 px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2">
                    <Trophy className="w-4 h-4" /> Specialization: {careers[0] || "Generalist"}
                  </div>
                </div>

                <div className="flex justify-between items-center px-6 text-xs text-[#999]">
                  <div className="text-left">
                    <p className="font-bold text-[#111] mb-0.5">{today}</p>
                    <p className="uppercase tracking-widest text-[9px]">Date of Issue</p>
                  </div>
                  <div className="w-20 h-20 opacity-10 grayscale">
                    {/* Simulated Stamp/Watermark */}
                    <div className="w-full h-full border-4 border-black rounded-full flex items-center justify-center font-black text-[10px] rotate-[-15deg]">
                      DISHA AI
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#111] mb-0.5">Disha AI Engine</p>
                    <p className="uppercase tracking-widest text-[9px]">Authorized By</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-3">
              <button className="flex items-center gap-2 bg-[#111] text-white px-6 py-3 rounded-full font-semibold text-sm hover:bg-black transition-all">
                <Download className="w-4 h-4" /> Download
              </button>
              <button className="flex items-center gap-2 bg-white text-[#111] px-6 py-3 rounded-full font-semibold text-sm border border-black/10 hover:border-black/20 transition-all">
                <Share2 className="w-4 h-4" /> Share on LinkedIn
              </button>
            </div>

            {/* Final Interview CTA */}
            {milestone.type === "final" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-12 bg-gradient-to-r from-[#111] to-[#333] text-white rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-2">Ready for your final interview?</h3>
                <p className="text-white/70 text-sm mb-6">Disha will evaluate your growth, analyze your improvement, and give you a personalized job-readiness score.</p>
                <Link href="/interview" className="bg-white text-[#111] px-8 py-3 rounded-full font-semibold inline-block hover:bg-white/90 transition-colors">
                  Start 4-Minute Interview
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
