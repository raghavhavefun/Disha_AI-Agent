"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Brain, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white rounded-full blur-[120px] opacity-60 pointer-events-none" />

      {/* Navigation */}
      <nav className="absolute top-0 w-full max-w-6xl flex justify-between items-center p-6 z-10">
        <div className="text-xl font-medium tracking-tight text-[#111111] flex items-center gap-2">
          <div className="w-6 h-6 bg-[#111111] rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
          Disha.
        </div>
        <Link href="/chat">
          <button className="glass-button px-5 py-2.5 rounded-full text-sm font-medium flex items-center gap-2 text-[#444]">
            Sign In
          </button>
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="max-w-4xl w-full flex flex-col items-center text-center z-10 mt-20">
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs font-medium text-[#666] mb-8"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Your personal AI career companion</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-7xl font-semibold tracking-tight text-[#111111] leading-[1.1] mb-6"
        >
          Figure out your career, <br className="hidden md:block" />
          <span className="text-[#888]">on your own terms.</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-lg md:text-xl text-[#555] max-w-2xl mb-12 font-light"
        >
          Disha is an emotionally intelligent AI that talks like a friend, understands your background, and builds a 60-day roadmap to get you hired.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link href="/chat">
            <button className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-4 rounded-full text-base font-medium flex items-center gap-3 transition-all duration-300 hover:shadow-lg hover:shadow-black/10 active:scale-95">
              Start talking to Disha
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <p className="text-xs text-[#888] mt-4 font-medium tracking-wide uppercase">Free 30-minute onboarding</p>
        </motion.div>
      </div>

      {/* Feature Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full mt-24 z-10"
      >
        <div className="glass-card p-8 rounded-3xl">
          <Brain className="w-6 h-6 text-[#111111] mb-4" />
          <h3 className="text-lg font-semibold text-[#111111] mb-2">Zero Judgement Zone</h3>
          <p className="text-[#666] leading-relaxed text-sm">She doesn't care if you have bad grades or don't know what you want. She asks the right questions until you figure it out.</p>
        </div>
        
        <div className="glass-card p-8 rounded-3xl">
          <ShieldCheck className="w-6 h-6 text-[#111111] mb-4" />
          <h3 className="text-lg font-semibold text-[#111111] mb-2">60-Day Action Plan</h3>
          <p className="text-[#666] leading-relaxed text-sm">No generic advice. Get daily tasks tailored exactly to your strengths, skills, and the Indian job market reality.</p>
        </div>
      </motion.div>

    </main>
  );
}
