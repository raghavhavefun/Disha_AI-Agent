"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Check, X, ChevronRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CAREER_DATABASE, CAREER_CATEGORIES, type Career } from "@/lib/careers";
import Fuse from "fuse.js";

export default function CareersPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selected, setSelected] = useState<string[]>([]);
  const [recommended, setRecommended] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem("disha_profile");
    if (stored) {
      const profile = JSON.parse(stored);
      if (profile.recommendedCareers) {
        setRecommended(profile.recommendedCareers);
      }
    }
  }, []);

  const fuse = useMemo(() => {
    return new Fuse(CAREER_DATABASE, {
      keys: ["name", "category", "description", "keywords"],
      threshold: 0.4,
      distance: 100,
    });
  }, []);

  const filteredCareers = useMemo(() => {
    let list = CAREER_DATABASE;
    
    // First apply category filter
    if (selectedCategory !== "All") {
      list = list.filter(c => c.category === selectedCategory);
    }

    // Then apply fuzzy search if search string exists
    if (search.trim()) {
      const results = fuse.search(search);
      // If we are in a category, filter search results by that category
      if (selectedCategory !== "All") {
        return results
          .map(r => r.item)
          .filter(item => item.category === selectedCategory);
      }
      return results.map(r => r.item);
    }
    
    return list;
  }, [search, selectedCategory, fuse]);

  const toggleCareer = (name: string) => {
    if (selected.includes(name)) {
      setSelected(selected.filter(s => s !== name));
    } else if (selected.length < 3) {
      setSelected([...selected, name]);
    }
  };

  const acceptRecommendations = () => {
    setSelected(recommended.slice(0, 3));
  };

  const handleContinue = async () => {
    if (selected.length === 0) return;
    sessionStorage.setItem("disha_selected_careers", JSON.stringify(selected));
    router.push("/roadmap");
  };

  const handleFastForward = () => {
    const sample = ["Product Manager", "Full Stack Developer", "Data Analyst"];
    setSelected(sample);
    sessionStorage.setItem("disha_selected_careers", JSON.stringify(sample));
    router.push("/roadmap");
  };

  return (
    <main className="min-h-screen bg-[#fafafa] text-[#111]">
      <header className="fixed top-0 w-full h-16 bg-[#fafafa]/90 backdrop-blur-md border-b border-black/5 flex items-center justify-between px-6 z-50">
        <Link href="/profile" className="flex items-center gap-2 text-[#666] hover:text-[#111] transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Profile</span>
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#888]">{selected.length}/3 selected</span>
          <button onClick={handleFastForward} className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-full hover:bg-red-50">
            Fast Forward
          </button>
        </div>
      </header>

      <div className="pt-24 pb-40 px-6 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Choose Your Career Paths</h1>
          <p className="text-[#666] max-w-lg mx-auto">Select up to 3 careers you want to explore. We will create a personalized 60-day roadmap combining all three.</p>
        </motion.div>

        {/* AI Recommendations */}
        {recommended.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-gradient-to-r from-[#111] to-[#333] text-white rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <h3 className="font-semibold">Disha Recommends</h3>
            </div>
            <p className="text-white/70 text-sm mb-4">Based on your personality and passions, these careers could be a great fit:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {recommended.map((r, i) => (
                <span key={i} className="bg-white/10 text-white text-sm px-4 py-2 rounded-full border border-white/10">{r}</span>
              ))}
            </div>
            <button onClick={acceptRecommendations} className="bg-white text-[#111] px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors">
              Accept Recommendations
            </button>
          </motion.div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search careers..."
              className="w-full bg-white border border-black/5 rounded-full pl-11 pr-4 py-3 text-sm outline-none focus:border-black/15 transition-colors"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory("All")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === "All" ? "bg-[#111] text-white" : "bg-white text-[#666] border border-black/5 hover:border-black/15"
            }`}
          >
            All
          </button>
          {CAREER_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat ? "bg-[#111] text-white" : "bg-white text-[#666] border border-black/5 hover:border-black/15"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Career Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredCareers.map(career => {
            const isSelected = selected.includes(career.name);
            const isDisabled = !isSelected && selected.length >= 3;

            return (
              <motion.button
                key={career.id}
                layout
                onClick={() => !isDisabled && toggleCareer(career.name)}
                className={`text-left p-4 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? "bg-[#111] text-white border-[#111] shadow-lg"
                    : isDisabled
                    ? "bg-[#f5f5f5] text-[#bbb] border-black/5 cursor-not-allowed"
                    : "bg-white text-[#333] border-black/5 hover:border-black/15 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-sm mb-1">{career.name}</p>
                    <p className={`text-xs ${isSelected ? "text-white/60" : "text-[#999]"}`}>{career.description}</p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-4 h-4 text-[#111]" />
                    </div>
                  )}
                </div>
                <span className={`inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  isSelected ? "bg-white/10 text-white/70" : "bg-black/5 text-[#888]"
                }`}>
                  {career.category}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Selected Bar */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-black/5 p-4 z-50"
          >
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1 overflow-x-auto">
                {selected.map(s => (
                  <span key={s} className="inline-flex items-center gap-1.5 bg-[#111] text-white text-xs px-3 py-1.5 rounded-full whitespace-nowrap">
                    {s}
                    <button onClick={() => toggleCareer(s)} className="hover:text-red-300">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <button
                onClick={handleContinue}
                className="bg-[#111] text-white px-8 py-3 rounded-full font-semibold text-sm shadow-lg hover:bg-black transition-all active:scale-95 flex items-center gap-2 ml-4 flex-shrink-0"
              >
                Generate Roadmap <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
