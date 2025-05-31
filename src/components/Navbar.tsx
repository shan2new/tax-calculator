"use client";

import * as React from "react";
import { 
  Menu, 
  X, 
  Calculator,
  BarChart3,
  HelpCircle,
  Info,
  Book
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useNavigation, type Page } from "@/lib/navigation-context";
import { useTheme } from "@/lib/theme-context";
import { ThemeSwitcher } from "@/components/ui/kibo-ui/theme-switcher";
import { LiveIndicator } from "@/components/LiveIndicator";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const tools: { title: string; href: Page; description: string; icon: React.ElementType }[] = [
  {
    title: "Calculator",
    href: "calculator",
    description: "Calculate income tax for FY 2025-26",
    icon: Calculator
  },
  {
    title: "Comparison",
    href: "comparison", 
    description: "Compare old vs new tax regimes",
    icon: BarChart3
  },
];

const resources: { title: string; href: Page; description: string; icon: React.ElementType; featured?: boolean }[] = [
  {
    title: "Tax Planning Guide",
    href: "guide",
    description: "Complete guide to Indian tax planning for FY 2025-26",
    icon: Book,
    featured: true
  },
  {
    title: "Help & FAQs",
    href: "help",
    description: "Get answers to common questions about tax calculations",
    icon: HelpCircle
  },
  {
    title: "About",
    href: "about", 
    description: "Learn about the project and developer",
    icon: Info
  },
];

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const { setCurrentPage } = useNavigation();
  const { theme, setTheme } = useTheme();

  const handleNavigation = React.useCallback((href: Page) => {
    setCurrentPage(href);
    setOpen(false);
  }, [setCurrentPage]);

  const handleKeyDown = React.useCallback((event: React.KeyboardEvent, href: Page) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigation(href);
    }
  }, [handleNavigation]);

  return (
    <header 
      className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80"
      role="banner"
    >
      <div className="container flex h-20 max-w-7xl items-center justify-center px-6 mx-auto">
        {/* Full Width Pill Container */}
        <div className="flex items-center justify-between w-full max-w-7xl bg-white/10 dark:bg-white/5 backdrop-blur-xl rounded-full border border-border px-6 py-3">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3 cursor-pointer group min-w-0 flex-shrink-0"
            onClick={() => handleNavigation("hero")}
            onKeyDown={(e) => handleKeyDown(e, "hero")}
            tabIndex={0}
            role="button"
            aria-label="Go to home page"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative h-8 w-8 group-hover:rotate-12 transition-transform duration-300 flex-shrink-0">
              <Image
                src="/logo.svg"
                alt="Calcq Logo"
                width={32}
                height={32}
                className="h-8 w-8"
                priority
                quality={100}
              />
            </div>
            <div className="flex items-center min-w-0">
              <h1 className="text-xl font-bold text-foreground tracking-tight">
                Calcq
              </h1>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-1">
                {/* Calculator Direct Link */}
                <NavigationMenuItem>
                  <Button
                    variant="ghost"
                    className="h-9 px-4 bg-transparent hover:bg-accent/50 text-sm font-normal text-foreground/80 hover:text-foreground transition-colors border-none rounded-full"
                    onClick={() => handleNavigation("calculator")}
                  >
                    Calculator
                  </Button>
                </NavigationMenuItem>

                {/* Tools Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 px-4 bg-transparent hover:bg-accent/50 text-sm font-normal text-foreground/80 hover:text-foreground transition-colors border-none rounded-full data-[state=open]:bg-accent/50">
                    Tools
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-2">
                      <div className="grid gap-1">
                        {tools.map((tool) => (
                          <motion.button
                            key={tool.title}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors text-left w-full"
                            onClick={() => handleNavigation(tool.href)}
                            whileHover={{ x: 2 }}
                          >
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                              <tool.icon className="w-4 h-4 text-muted-foreground" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-sm text-foreground">{tool.title}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5">{tool.description}</p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Resources Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="h-9 px-4 bg-transparent hover:bg-accent/50 text-sm font-normal text-foreground/80 hover:text-foreground transition-colors border-none rounded-full data-[state=open]:bg-accent/50">
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] p-2">
                      <div className="space-y-1">
                        {resources.map((resource) => (
                          <motion.button
                            key={resource.title}
                            className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition-all duration-300 hover:bg-accent/50 ${
                              resource.featured ? 'bg-accent/30' : ''
                            }`}
                            onClick={() => handleNavigation(resource.href)}
                            whileHover={{ scale: resource.featured ? 1.01 : 1, x: resource.featured ? 0 : 2 }}
                          >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              resource.featured ? 'bg-primary/10' : 'bg-muted'
                            }`}>
                              <resource.icon className={`h-4 w-4 ${
                                resource.featured ? 'text-primary' : 'text-muted-foreground'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <h4 className={`text-sm ${
                                resource.featured ? 'font-semibold text-foreground' : 'font-medium text-foreground'
                              }`}>{resource.title}</h4>
                              <p className="text-xs text-muted-foreground">{resource.description}</p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            {/* Live Indicator */}
            <div className="hidden sm:flex">
              <LiveIndicator />
            </div>

            {/* Theme Switcher */}
            <div className="hidden sm:flex">
              <ThemeSwitcher value={theme} onChange={setTheme} />
            </div>

            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-9 w-9 transition-all duration-200 hover:bg-accent/50 rounded-full"
                  aria-label={open ? "Close menu" : "Open menu"}
                  aria-expanded={open}
                  aria-controls="mobile-menu"
                >
                  <AnimatePresence mode="wait">
                    {open ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="h-4 w-4" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="right" 
                className="w-[320px] p-0 bg-background border-border"
                id="mobile-menu"
              >
                <div className="flex h-full flex-col">
                  {/* Header */}
                  <SheetHeader className="border-b border-border p-6">
                    <div className="flex items-center gap-3">
                      <div className="relative h-8 w-8 flex-shrink-0">
                        <Image
                          src="/logo.svg"
                          alt="Calcq Logo"
                          width={32}
                          height={32}
                          className="h-8 w-8"
                          priority
                        />
                      </div>
                      <SheetTitle className="text-xl font-bold text-foreground">
                        Calcq
                      </SheetTitle>
                    </div>
                    
                    <div className="mt-4">
                      <LiveIndicator />
                    </div>
                  </SheetHeader>

                  {/* Navigation Content */}
                  <div className="flex-1 overflow-y-auto py-6">
                    <nav className="space-y-6 px-6">
                      {/* Calculator */}
                      <div>
                        <Button
                          variant="ghost"
                          className="w-full justify-start h-12 text-left"
                          onClick={() => handleNavigation("calculator")}
                        >
                          <Calculator className="mr-3 h-5 w-5" />
                          <div>
                            <div className="font-medium text-sm">Calculator</div>
                            <div className="text-xs text-muted-foreground">Calculate income tax for FY 2025-26</div>
                          </div>
                        </Button>
                      </div>

                      {/* Tools */}
                      <div>
                        <h3 className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Tools
                        </h3>
                        <div className="space-y-2">
                          {tools.map((tool) => (
                            <Button
                              key={tool.title}
                              variant="ghost"
                              className="w-full justify-start h-12 text-left"
                              onClick={() => handleNavigation(tool.href)}
                            >
                              <tool.icon className="mr-3 h-5 w-5" />
                              <div>
                                <div className="font-medium text-sm">{tool.title}</div>
                                <div className="text-xs text-muted-foreground">{tool.description}</div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Resources */}
                      <div>
                        <h3 className="mb-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Resources
                        </h3>
                        <div className="space-y-2">
                          {resources.map((resource) => (
                            <Button
                              key={resource.href}
                              variant="ghost"
                              className="w-full justify-start h-12"
                              onClick={() => handleNavigation(resource.href)}
                            >
                              <resource.icon className="mr-3 h-5 w-5" />
                              {resource.title}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </nav>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-border p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Theme</span>
                      <ThemeSwitcher value={theme} onChange={setTheme} />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
} 