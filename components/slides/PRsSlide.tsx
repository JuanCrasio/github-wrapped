"use client";

import { motion } from "framer-motion";
import { GitPullRequest, GitMerge, TrendingUp } from "lucide-react";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import type { WrappedData } from "@/lib/types";
import { RadialSpotlightBackground } from "@/components/backgrounds/RadialSpotlightBackground";

interface PRsSlideProps {
  data: WrappedData;
}

export function PRsSlide({ data }: PRsSlideProps) {
  const { totalPRs, totalReviews, activeDays } = data.stats;
  const prsPerWeek = activeDays > 0 ? (totalPRs / (activeDays / 7)).toFixed(1) : "0";
  const reviewsPerPR = totalPRs > 0 ? (totalReviews / totalPRs).toFixed(1) : "0";

  return (
    <RadialSpotlightBackground
      spotlightColor="#3b82f6"
      spotlightIntensity={0.3}
      className="overflow-y-auto overflow-x-hidden"
    >
      <div className="h-full w-full flex items-center justify-center relative p-6 md:p-8">
        {/* Floating PR icons */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
              style={{
                left: `${5 + (i % 4) * 30}%`,
                top: `${10 + Math.floor(i / 4) * 30}%`,
            }}
            animate={{
                y: [0, -40, 0],
                opacity: [0, 0.35, 0],
                rotate: [0, 20, -20, 0],
                scale: [0.7, 1, 0.7],
            }}
            transition={{
                duration: 5 + i * 0.3,
              repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
            }}
          >
              <GitPullRequest className="w-8 h-8 text-white/12" />
          </motion.div>
        ))}
      </div>

        <div className="relative z-10 text-center w-full max-w-4xl mx-auto my-auto px-4 md:px-8">
        {/* Icon with PR text */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="mb-8"
        >
          <div className="relative">
            <div className="relative bg-white/20 backdrop-blur-sm px-8 py-6 rounded-full flex items-center gap-4">
              <GitMerge className="w-16 h-16 text-white flex-shrink-0" />
              <div className="text-left">
                <p className="text-white text-2xl md:text-3xl font-semibold">Pull Requests</p>
                <p className="text-white/70 text-base md:text-lg">Code contributions</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-light text-white/90 mb-4"
        >
          You opened
        </motion.h2>

        {/* Counter */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            delay: 0.4,
            type: "spring",
            stiffness: 200,
            damping: 20,
          }}
          className="mb-6"
        >
          <AnimatedCounter
            value={totalPRs}
            className="text-8xl md:text-9xl font-bold text-white"
          />
        </motion.div>

        {/* PR-style creative line */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-12"
        >
          <div className="glass-premium px-6 py-4 rounded-full border border-white/10 inline-block">
            <div className="flex items-center gap-3">
              <GitPullRequest className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <div className="text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-white/60 text-sm font-mono">#{totalPRs}</span>
                  <span className="text-white/40 text-sm">•</span>
                  <span className="text-green-400 text-xs font-semibold bg-green-400/10 px-2 py-0.5 rounded">
                    merged
                  </span>
                </div>
                <p className="text-white text-xl md:text-2xl font-medium mt-1">
                  feat: {totalPRs} pull request{totalPRs !== 1 ? 's' : ''} opened this year 🚀
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap justify-center gap-4 max-w-2xl"
        >
          <div className="glass px-6 py-3 rounded-full flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-white" />
            <span className="text-white font-semibold">~{prsPerWeek} PRs/week</span>
          </div>
          
          {totalReviews > 0 && (
            <div className="glass px-6 py-3 rounded-full flex items-center gap-2">
              <GitPullRequest className="w-5 h-5 text-white" />
              <span className="text-white font-semibold">
                ~{reviewsPerPR} reviews per PR
              </span>
            </div>
          )}
        </motion.div>

        {/* Fun message */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-lg text-white/80 italic"
        >
          {totalPRs === 0
            ? "Time to start contributing! 🚀"
            : totalPRs < 10
            ? "Every PR counts! 💪"
            : totalPRs < 50
            ? "Building momentum! 🔥"
            : totalPRs < 100
            ? "Impressive contribution rate! 🌟"
            : "PR powerhouse! 🏆"}
        </motion.p>
      </div>
    </div>
    </RadialSpotlightBackground>
  );
}

