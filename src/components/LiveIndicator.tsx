"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export function LiveIndicator() {
  return (
    <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-800">
      {/* Live Pulse Indicator */}
      <motion.div
        className="w-1.5 h-1.5 bg-green-500 rounded-full"
        animate={{
          opacity: [1, 0.3, 1],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* FY Text */}
      <span className="text-xs font-medium">FY 2025-26</span>
    </Badge>
  );
} 