"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Github, 
  Heart, 
  Code, 
  Database, 
  Globe, 
  Sparkles, 
  Star, 
  Coffee,
  ExternalLink,
  Mail,
  Calendar,
  Award
} from "lucide-react";

export function About() {
  const techStack = [
    { name: "React", icon: "⚛️", description: "Component-based UI library" },
    { name: "Next.js", icon: "🚀", description: "Full-stack React framework" },
    { name: "TypeScript", icon: "📘", description: "Type-safe JavaScript" },
    { name: "Tailwind CSS", icon: "🎨", description: "Utility-first CSS framework" },
    { name: "Framer Motion", icon: "🎭", description: "Production-ready motion library" },
    { name: "shadcn/ui", icon: "🎯", description: "Beautiful component library" },
    { name: "Vercel Analytics", icon: "📊", description: "Performance insights" }
  ];

  const features = [
    "Accurate tax calculations based on FY 2025-26 tax slabs",
    "Real-time tax liability computation",
    "Mobile-responsive design for all devices",
    "Dark/Light theme support with system preference",
    "Comprehensive tax breakdown and visualization",
    "Open source and completely free to use"
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <Badge variant="secondary" className="px-4 py-2">
            <Code className="w-4 h-4 mr-2" />
            About the Project
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Indian Tax Calculator
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A modern, user-friendly tax calculator built for the Indian tax system, 
            helping individuals make informed financial decisions.
          </p>
        </motion.div>

        {/* Developer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Code className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-3xl">shan2new</CardTitle>
              <CardDescription className="text-lg">
                Full-Stack Developer & Tech Enthusiast
              </CardDescription>
              <div className="flex justify-center gap-1 mt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                ))}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-muted-foreground leading-relaxed">
                Passionate full-stack developer creating innovative solutions for complex problems. 
                Building user-friendly applications that make a difference in people&apos;s lives.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm">
                  <Database className="w-5 h-5 text-primary" />
                  <span>Full-Stack Development</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Globe className="w-5 h-5 text-primary" />
                  <span>Open Source Contributor</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span>Project: 2024</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Award className="w-5 h-5 text-primary" />
                  <span>Quality-First Approach</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button asChild className="flex-1">
                  <a 
                    href="https://github.com/shan2new" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Github className="w-4 h-4" />
                    GitHub Profile
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <a 
                    href="mailto:contact@shan2new.dev"
                    className="flex items-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Get in Touch
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tech Stack Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Built With Modern Technology
              </CardTitle>
              <CardDescription>
                Leveraging the latest tools and frameworks for optimal performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {techStack.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-lg border bg-card hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{tech.icon}</span>
                      <h3 className="font-semibold">{tech.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{tech.description}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
              <CardDescription>
                What makes this tax calculator special
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Footer Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center space-y-4"
        >
          <Separator />
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>and</span>
            <Coffee className="w-4 h-4 text-amber-600" />
            <span>for the Indian developer community</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            This calculator is provided for educational purposes. Always consult with a 
            certified tax professional for personalized financial advice.
          </p>
        </motion.div>
      </div>
    </div>
  );
} 