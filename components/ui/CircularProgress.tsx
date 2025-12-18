"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { useEffect, useState } from "react";

interface CircularProgressProps {
  progress: number; // 0 to 100
  isPaused: boolean;
  onTogglePause: () => void;
  size?: number;
  strokeWidth?: number;
}

export function CircularProgress({
  progress,
  isPaused,
  onTogglePause,
  size = 48,
  strokeWidth = 3,
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  const [sparkles, setSparkles] = useState<Array<{ id: number; angle: number }>>([]);

  // Generate sparkles when progress updates
  useEffect(() => {
    if (!isPaused && progress > 0) {
      const newSparkle = {
        id: Date.now(),
        angle: (progress / 100) * 360 - 90, // Convert progress to angle
      };
      setSparkles((prev) => [...prev.slice(-2), newSparkle]);
      
      // Remove sparkle after animation
      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
      }, 600);
    }
  }, [progress, isPaused]);

  // Calculate positions for rotating particles
  const particleCount = 8;
  const particles = Array.from({ length: particleCount }, (_, i) => {
    const angle = (i / particleCount) * 360;
    const particleRadius = radius + 4;
    const x = size / 2 + Math.cos((angle * Math.PI) / 180) * particleRadius;
    const y = size / 2 + Math.sin((angle * Math.PI) / 180) * particleRadius;
    return { x, y, angle };
  });

  const gradientId = `progressGradient-${size}`;

  return (
    <motion.div 
      className="relative group"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 200, 
        damping: 20 
      }}
    >
      {/* Outer rotating glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: isPaused 
            ? "transparent" 
            : "conic-gradient(from 0deg, rgba(255,255,255,0.1), rgba(255,255,255,0.3), rgba(255,255,255,0.1))",
        }}
        animate={{
          rotate: isPaused ? 0 : 360,
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Pulsing glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-white/20 blur-xl"
        animate={{
          scale: isPaused ? 1 : [1, 1.3, 1],
          opacity: isPaused ? 0 : [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Rotating particles around the circle */}
      {!isPaused && (
        <svg
          width={size}
          height={size}
          className="absolute inset-0 z-0"
        >
          {particles.map((particle, i) => (
            <motion.circle
              key={i}
              cx={particle.x}
              cy={particle.y}
              r={1.5}
              fill="white"
              opacity={0.6}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </svg>
      )}
      
      {/* Circular SVG Progress */}
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 relative z-10"
      >
        {/* Background circle with pulse */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth={strokeWidth}
          fill="none"
          animate={isPaused ? {} : {
            strokeWidth: [strokeWidth, strokeWidth + 1.5, strokeWidth],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Progress circle with gradient effect */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 1)" />
            <stop offset="50%" stopColor="rgba(147, 197, 253, 1)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 1)" />
          </linearGradient>
        </defs>
        
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ 
            strokeDashoffset: offset,
            opacity: isPaused ? 0.5 : [0.9, 1, 0.9],
            strokeWidth: isPaused ? strokeWidth : [strokeWidth, strokeWidth + 0.5, strokeWidth],
          }}
          transition={{ 
            strokeDashoffset: { duration: 0.3, ease: "linear" },
            opacity: { duration: 1, repeat: Infinity, ease: "easeInOut" },
            strokeWidth: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
        />

        {/* Sparkle effects at progress point */}
        {sparkles.map((sparkle) => {
          const sparkleAngle = (sparkle.angle * Math.PI) / 180;
          const sparkleX = size / 2 + Math.cos(sparkleAngle) * radius;
          const sparkleY = size / 2 + Math.sin(sparkleAngle) * radius;
          
          return (
            <motion.g key={sparkle.id}>
              <motion.circle
                cx={sparkleX}
                cy={sparkleY}
                r={2}
                fill="white"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 2, 0], opacity: [1, 0.5, 0] }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              <motion.circle
                cx={sparkleX}
                cy={sparkleY}
                r={1}
                fill="#93c5fd"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ scale: [0, 1.5, 0], opacity: [1, 0, 0] }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
              />
            </motion.g>
          );
        })}
      </svg>

      {/* Pause/Play button overlay */}
      <AnimatePresence>
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onTogglePause();
          }}
          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {isPaused ? (
              <Play className="w-4 h-4 text-white" fill="white" />
            ) : (
              <Pause className="w-4 h-4 text-white" fill="white" />
            )}
          </motion.div>
        </motion.button>
      </AnimatePresence>
      
      {/* Paused indicator */}
      {isPaused && (
        <motion.div
          className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 text-xs whitespace-nowrap"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
        >
          Paused
        </motion.div>
      )}
    </motion.div>
  );
}

