"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Github, Heart, Code, Database, Globe, Sparkles, Star } from "lucide-react";

export function DeveloperFooter() {
  const techStack = [
    { name: "React", icon: "⚛️", color: "from-blue-400 to-blue-600" },
    { name: "Next.js", icon: "🚀", color: "from-gray-700 to-black" },
    { name: "TypeScript", icon: "📘", color: "from-blue-600 to-blue-800" },
    { name: "Tailwind CSS", icon: "🎨", color: "from-cyan-400 to-cyan-600" },
    { name: "Framer Motion", icon: "🎭", color: "from-purple-400 to-purple-600" },
    { name: "shadcn/ui", icon: "🎯", color: "from-orange-400 to-orange-600" },
    { name: "Vercel Analytics", icon: "📊", color: "from-green-400 to-green-600" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="mt-20 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 dark:from-black dark:via-gray-900 dark:to-black text-white relative overflow-hidden"
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 via-purple-900/10 to-green-900/10 dark:from-blue-800/5 dark:via-purple-800/5 dark:to-green-800/5 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-400/3 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-400/3 rounded-full blur-3xl" />
      
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white/20 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200), 
              y: Math.random() * 400,
              opacity: 0 
            }}
            animate={{ 
              y: [-50, 0, -50],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20">
        <div className="text-center space-y-12">
          {/* Developer Badge with Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="inline-block"
            >
              <Badge 
                variant="outline" 
                className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 text-blue-200 border-blue-400/50 px-6 py-3 text-base mb-8 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Code className="w-5 h-5 mr-2" />
                <span className="font-semibold">Developed with passion by</span>
                <Sparkles className="w-4 h-4 ml-2" />
              </Badge>
            </motion.div>
          </motion.div>

          {/* Enhanced Developer Name */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="space-y-4"
          >
            <motion.h2
              className="text-6xl md:text-8xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent leading-tight"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              shan2new
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex justify-center gap-2"
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8 + i * 0.1 }}
                  whileHover={{ scale: 1.2, rotate: 180 }}
                >
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Enhanced Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="max-w-3xl mx-auto"
          >
            <p className="text-xl text-gray-300 leading-relaxed mb-6">
              Passionate full-stack developer creating innovative solutions for complex problems. 
              Building user-friendly applications that make a difference in people&apos;s lives.
            </p>
            
            <div className="flex justify-center gap-8 text-sm text-gray-400">
              <motion.div
                whileHover={{ scale: 1.05, color: "#60A5FA" }}
                className="flex items-center gap-2 cursor-default"
              >
                <Database className="w-4 h-4" />
                <span>Full-Stack Developer</span>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, color: "#34D399" }}
                className="flex items-center gap-2 cursor-default"
              >
                <Globe className="w-4 h-4" />
                <span>Curious Enthusiast</span>
              </motion.div>
            </div>
          </motion.div>

          {/* Enhanced GitHub Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <motion.a
              href="https://github.com/shan2new"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 hover:from-blue-700 hover:via-purple-700 hover:to-blue-800 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Github className="w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
              <span>View My GitHub Profile</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.div>
            </motion.a>
          </motion.div>

          {/* Enhanced Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="pt-12 border-t border-gray-700/50"
          >
            <motion.h4 
              className="text-lg font-bold text-gray-300 uppercase tracking-wider mb-8 flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-5 h-5" />
              Built With Modern Technology
              <Sparkles className="w-5 h-5" />
            </motion.h4>
            
            <div className="flex flex-wrap justify-center gap-4">
              {techStack.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                  whileHover={{ 
                    scale: 1.1, 
                    y: -5,
                    transition: { duration: 0.2 } 
                  }}
                  className="group"
                >
                  <Badge
                    variant="outline"
                    className={`bg-gradient-to-r ${tech.color} text-white border-white/20 hover:border-white/40 transition-all duration-300 px-4 py-3 text-base font-bold shadow-lg hover:shadow-xl cursor-default relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="mr-3 text-lg group-hover:scale-110 transition-transform duration-200 inline-block">
                      {tech.icon}
                    </span>
                    <span className="relative z-10">{tech.name}</span>
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Enhanced Made with Love */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.6 }}
            className="flex items-center justify-center gap-3 text-gray-400 text-lg pt-12"
          >
            <span className="font-medium">Crafted with</span>
            <motion.div
              animate={{ 
                scale: [1, 1.3, 1],
                rotate: [0, 15, -15, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatDelay: 3 
              }}
              whileHover={{ scale: 1.5 }}
              className="cursor-pointer"
            >
              <Heart className="w-6 h-6 text-red-500 fill-current drop-shadow-lg" />
            </motion.div>
            <span className="font-medium">and</span>
            <motion.div
              animate={{ 
                rotate: 360
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity,
                ease: "linear"
              }}
              className="text-yellow-400"
            >
              ☕
            </motion.div>
            <span className="font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              by shan2new
            </span>
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="pt-8 text-gray-500 text-sm"
          >
            <p>© 2024 Indian Tax Calculator. Open source and free to use.</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 