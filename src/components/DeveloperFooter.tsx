"use client";

import { motion } from "framer-motion";
import { Heart, Coffee } from "lucide-react";
import { useNavigation } from "@/lib/navigation-context";

export function DeveloperFooter() {
  const { setCurrentPage } = useNavigation();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="border-t border-border bg-background/50 backdrop-blur-sm"
    >
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2024 Indian Tax Calculator. Open source and free to use.
          </p>
          
          {/* Right side - Developer credit */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Crafted with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>and</span>
            <Coffee className="w-4 h-4 text-amber-600" />
            <span>by</span>
            <button 
              className="text-primary hover:text-primary/80 font-medium transition-colors"
              onClick={() => setCurrentPage("about")}
            >
              shan2new
            </button>
          </div>
        </div>
      </div>
    </motion.footer>
  );
} 