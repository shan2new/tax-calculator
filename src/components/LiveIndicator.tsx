"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Calendar, Sparkles } from "lucide-react";

export function LiveIndicator() {
  return (
    <Badge 
      variant="secondary" 
      className="relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50 text-emerald-700 dark:from-emerald-950 dark:via-green-950 dark:to-teal-950 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/50 shadow-sm backdrop-blur-sm overflow-hidden group hover:shadow-md transition-all duration-300"
    >
      {/* Background shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent dark:via-white/5"
        animate={{
          x: [-100, 300],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      
      {/* Live Pulse Indicator */}
      <div className="relative flex items-center">
        <motion.div
          className="w-2 h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full shadow-sm"
          animate={{
            opacity: [1, 0.4, 1],
            scale: [1, 0.8, 1],
            boxShadow: [
              "0 0 0 0 rgba(16, 185, 129, 0.4)",
              "0 0 0 4px rgba(16, 185, 129, 0.1)",
              "0 0 0 0 rgba(16, 185, 129, 0.4)"
            ],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Sparkle effect */}
        <motion.div
          className="absolute -top-0.5 -right-0.5"
          animate={{
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="w-2.5 h-2.5 text-emerald-400/60 dark:text-emerald-400/40" />
        </motion.div>
      </div>
      
      {/* FY Text with enhanced styling */}
      <div className="flex items-center gap-1.5 relative z-10">
        <Calendar className="w-3.5 h-3.5 text-emerald-600/70 dark:text-emerald-400/70" />
        <div className="flex flex-col leading-none">
          <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-600/60 dark:text-emerald-400/60">
            Active
          </span>
          <span className="text-xs font-bold bg-gradient-to-r from-emerald-700 to-green-700 dark:from-emerald-300 dark:to-green-300 bg-clip-text text-transparent">
            FY 2025-26
          </span>
        </div>
      </div>
      
      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-md bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Badge>
  );
} 