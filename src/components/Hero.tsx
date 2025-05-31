"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calculator, Target, BarChart3, Shield } from "lucide-react";
import { useNavigation } from "@/lib/navigation-context";
import Image from "next/image";

export function Hero() {
  const { setCurrentPage } = useNavigation();

  const features = [
    { icon: Calculator, name: "Tax Calculator", description: "FY 2025-26" },
    { icon: BarChart3, name: "Regime Comparison", description: "Old vs New" },
    { icon: Target, name: "Smart Deductions", description: "Optimize Savings" },
    { icon: Shield, name: "Accurate Results", description: "Latest Rules" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/80 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 rounded-full opacity-10 blur-3xl bg-gradient-to-r from-violet-500 to-purple-500" />
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full opacity-10 blur-3xl bg-gradient-to-r from-blue-500 to-indigo-500" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl bg-gradient-to-r from-pink-500 to-rose-500" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(100, 100, 100, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 100, 100, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="w-20 h-20 sm:w-24 sm:h-24 relative">
                <Image
                  src="/logo.svg"
                  alt="Calcq Logo"
                  width={96}
                  height={96}
                  className="w-full h-full"
                  priority
                />
              </div>
              {/* Animated ring around logo */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-violet-500/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
              Calculate your taxes with{" "}
              <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">
                Calcq
              </span>
            </h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Smart Indian tax calculator for FY 2025-26. Compare regimes, optimize deductions, 
              and make informed financial decisions with our free, accurate, and user-friendly tool.
            </motion.p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              onClick={() => setCurrentPage("calculator")}
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white border-0 px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              Calculate Tax Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              onClick={() => setCurrentPage("about")}
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg font-semibold border-2 hover:bg-accent/50 group"
            >
              Learn more
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-24 space-y-8"
        >
          <p className="text-sm text-muted-foreground font-medium">
            Everything you need for accurate tax calculation
          </p>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className="flex flex-col items-center gap-3 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 flex items-center justify-center group-hover:from-violet-200 group-hover:to-purple-200 dark:group-hover:from-violet-800/40 dark:group-hover:to-purple-800/40 transition-all duration-300 border border-violet-200/50 dark:border-violet-700/30">
                  <feature.icon className="w-7 h-7 text-violet-600 dark:text-violet-400 group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-semibold text-foreground group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">
                    {feature.name}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </div>
  );
} 