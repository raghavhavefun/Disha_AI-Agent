"use client";

import { motion } from "framer-motion";

interface VoiceOrbProps {
  isSpeaking: boolean;
  isListening: boolean;
}

export function VoiceOrb({ isSpeaking, isListening }: VoiceOrbProps) {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Outer Glow Ripples */}
      {isSpeaking && (
        <>
          <motion.div
            animate={{ scale: [1, 1.5], opacity: [0.4, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
            className="absolute w-48 h-48 bg-[#111111] rounded-full opacity-20"
          />
          <motion.div
            animate={{ scale: [1, 1.3], opacity: [0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            className="absolute w-48 h-48 bg-[#111111] rounded-full opacity-20"
          />
        </>
      )}

      {isListening && (
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-56 h-56 bg-red-500 rounded-full blur-2xl opacity-20"
        />
      )}

      {/* Main Center Orb */}
      <motion.div
        animate={{
          scale: isSpeaking ? [1, 1.05, 1] : isListening ? [1, 0.98, 1] : 1,
        }}
        transition={{
          duration: isSpeaking ? 0.3 : 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={`relative w-48 h-48 rounded-full shadow-2xl z-10 overflow-hidden transition-all duration-500 flex items-center justify-center ${
          isSpeaking 
            ? "bg-gradient-to-tr from-[#111111] to-[#333333] shadow-black/30" 
            : isListening 
              ? "bg-gradient-to-tr from-[#222222] to-[#444444] shadow-black/20" 
              : "bg-gradient-to-tr from-[#eeeeee] to-[#ffffff] shadow-black/5 border border-black/5"
        }`}
      >
        {/* Inner subtle highlight */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/20 to-transparent rounded-full" />
      </motion.div>
    </div>
  );
}
