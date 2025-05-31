"use client";

import * as React from "react";
import { BookOpen, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { useNavigation, type Page } from "@/lib/navigation-context";
import { useTheme } from "@/lib/theme-context";
import { ThemeSwitcher } from "@/components/ui/kibo-ui/theme-switcher";
import { LiveIndicator } from "@/components/LiveIndicator";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const tools: { title: string; href: Page; description: string; icon?: string }[] = [
  {
    title: "Tax Calculator",
    href: "calculator",
    description: "Calculate your income tax for FY 2025-26 under both tax regimes.",
    icon: "🧮"
  },
  {
    title: "Salary Comparison",
    href: "comparison", 
    description: "Compare different salary options to make informed career decisions.",
    icon: "⚖️"
  },
  {
    title: "Tax Regimes",
    href: "regimes",
    description: "Learn about and compare old vs new tax regimes in detail.",
    icon: "📊"
  },
];

const resources: { title: string; href: Page; description: string; icon?: string }[] = [
  {
    title: "Help & FAQs",
    href: "help",
    description: "Get answers to common questions about tax calculations.",
    icon: "❓"
  },
  {
    title: "About",
    href: "about", 
    description: "Learn about the project and developer.",
    icon: "ℹ️"
  },
];

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const { currentPage, setCurrentPage } = useNavigation();
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
      className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm"
      role="banner"
    >
      <div className="container flex h-14 max-w-7xl items-center justify-between px-4 mx-auto">
        {/* Logo */}
        <motion.div 
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => handleNavigation("calculator")}
          onKeyDown={(e) => handleKeyDown(e, "calculator")}
          tabIndex={0}
          role="button"
          aria-label="Go to home page"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="relative h-8 w-8 group-hover:rotate-12 transition-transform duration-300">
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
          <div className="flex items-center">
            <h1 className="text-2xl font-extrabold font-plus-jakarta bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter group-hover:from-violet-500 group-hover:via-purple-500 group-hover:to-indigo-500 transition-all duration-300">
              Calcq
            </h1>
            <motion.div 
              className="ml-1 mt-0.5"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7] 
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut" 
              }}
            >
              <div className="w-1 h-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full shadow-sm"></div>
            </motion.div>
          </div>
        </motion.div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex" role="navigation" aria-label="Main navigation">
          <NavigationMenuList className="gap-0.5">
            <NavigationMenuItem>
              <Button
                variant={currentPage === "calculator" ? "default" : "ghost"}
                className={cn(
                  "h-8 px-4 py-1.5 text-sm font-medium transition-all duration-200 rounded-md",
                  "hover:bg-accent/90 hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary",
                  currentPage === "calculator" && "shadow-sm"
                )}
                onClick={() => handleNavigation("calculator")}
                aria-current={currentPage === "calculator" ? "page" : undefined}
              >
                Home
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-8 px-4 text-sm font-medium transition-all duration-200 hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-primary rounded-md">
                Tools
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <motion.ul 
                  className="grid w-[420px] gap-2 p-4 md:w-[520px] md:grid-cols-2 lg:w-[640px]"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {tools.map((tool, index) => (
                    <motion.li
                      key={tool.title}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <ListItem
                        title={tool.title}
                        href={tool.href}
                        onNavigate={handleNavigation}
                        isActive={currentPage === tool.href}
                        icon={tool.icon}
                      >
                        {tool.description}
                      </ListItem>
                    </motion.li>
                  ))}
                </motion.ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="h-8 px-4 text-sm font-medium transition-all duration-200 hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-primary rounded-md">
                Resources
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <motion.ul 
                  className="grid gap-2 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <motion.button
                        className="flex h-full w-full select-none flex-col justify-end rounded-lg bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 p-6 no-underline outline-none transition-all duration-300 hover:shadow-lg hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-primary border border-violet-100/50 dark:border-violet-800/20"
                        onClick={() => handleNavigation("guide")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="mb-2 text-2xl">📚</div>
                        <BookOpen className="h-6 w-6 mb-2 text-violet-600 dark:text-violet-400" />
                        <div className="mb-2 mt-2 text-lg font-semibold text-violet-900 dark:text-violet-100">
                          Tax Planning Guide
                        </div>
                        <p className="text-sm leading-tight text-violet-700 dark:text-violet-300">
                          Complete guide to Indian tax planning for FY 2025-26.
                        </p>
                      </motion.button>
                    </NavigationMenuLink>
                  </li>
                  {resources.map((resource, index) => (
                    <motion.li
                      key={resource.title}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.1 }}
                    >
                      <ListItem 
                        href={resource.href}
                        title={resource.title}
                        onNavigate={handleNavigation}
                        isActive={currentPage === resource.href}
                        icon={resource.icon}
                      >
                        {resource.description}
                      </ListItem>
                    </motion.li>
                  ))}
                </motion.ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-3">
          {/* Live Indicator */}
          <motion.div 
            className="hidden sm:flex"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <LiveIndicator />
          </motion.div>

          {/* Theme Switcher */}
          <motion.div 
            className="hidden sm:flex"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <ThemeSwitcher value={theme} onChange={setTheme} />
          </motion.div>

          {/* Mobile Menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden h-8 w-8 transition-all duration-200 hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-primary"
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
              className="w-[320px] p-0 bg-background/95 backdrop-blur-xl"
              id="mobile-menu"
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <SheetHeader className="border-b p-6 bg-gradient-to-r from-violet-50/30 to-purple-50/30 dark:from-violet-950/20 dark:to-purple-950/20">
                  <div className="flex items-center gap-2.5">
                    <div className="relative h-8 w-8">
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
                    <SheetTitle className="flex items-center">
                      <span className="text-2xl font-extrabold font-plus-jakarta bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
                        Calcq
                      </span>
                      <div className="ml-1 mt-0.5">
                        <div className="w-1 h-1 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
                      </div>
                    </SheetTitle>
                  </div>
                  
                  {/* Mobile Live Indicator */}
                  <motion.div 
                    className="mt-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <LiveIndicator />
                  </motion.div>
                </SheetHeader>

                {/* Navigation Content */}
                <div className="flex-1 overflow-y-auto py-6">
                  <nav className="space-y-2 px-4" aria-label="Mobile navigation">
                    {/* Home */}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Button
                        variant={currentPage === "calculator" ? "default" : "ghost"}
                        className="w-full justify-start font-medium h-10 hover:bg-accent/90 transition-all duration-200"
                        onClick={() => handleNavigation("calculator")}
                        aria-current={currentPage === "calculator" ? "page" : undefined}
                      >
                        🏠 Home
                      </Button>
                    </motion.div>

                    {/* Tools Section */}
                    <motion.div 
                      className="pt-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Tools
                      </h3>
                      <div className="space-y-1">
                        {tools.map((tool, index) => (
                          <motion.div
                            key={tool.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                          >
                            <Button
                              variant={currentPage === tool.href ? "default" : "ghost"}
                              className="w-full justify-start font-medium h-10 hover:bg-accent/90 transition-all duration-200"
                              onClick={() => handleNavigation(tool.href)}
                              aria-current={currentPage === tool.href ? "page" : undefined}
                            >
                              <span className="mr-2">{tool.icon}</span>
                              {tool.title}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Resources Section */}
                    <motion.div 
                      className="pt-6"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Resources
                      </h3>
                      <div className="space-y-1">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.25 }}
                        >
                          <Button
                            variant={currentPage === "guide" ? "default" : "ghost"}
                            className="w-full justify-start font-medium h-10 hover:bg-accent/90 transition-all duration-200"
                            onClick={() => handleNavigation("guide")}
                            aria-current={currentPage === "guide" ? "page" : undefined}
                          >
                            📚 Tax Planning Guide
                          </Button>
                        </motion.div>
                        {resources.map((resource, index) => (
                          <motion.div
                            key={resource.href}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                          >
                            <Button
                              variant={currentPage === resource.href ? "default" : "ghost"}
                              className="w-full justify-start font-medium h-10 hover:bg-accent/90 transition-all duration-200"
                              onClick={() => handleNavigation(resource.href)}
                              aria-current={currentPage === resource.href ? "page" : undefined}
                            >
                              <span className="mr-2">{resource.icon}</span>
                              {resource.title}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  </nav>
                </div>

                {/* Footer Actions */}
                <motion.div 
                  className="border-t bg-muted/20 p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Theme</span>
                    <ThemeSwitcher value={theme} onChange={setTheme} />
                  </div>
                </motion.div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"button">,
  React.ComponentPropsWithoutRef<"button"> & { 
    href: Page;
    onNavigate: (href: Page) => void;
    isActive?: boolean;
    icon?: string;
  }
>(({ className, title, children, href, onNavigate, isActive, icon }, ref) => {
  const MotionButton = motion.button;
  
  return (
    <NavigationMenuLink asChild>
      <MotionButton
        ref={ref}
        className={cn(
          "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-all duration-200 hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground hover:scale-[1.02] focus-visible:ring-2 focus-visible:ring-primary border border-transparent hover:border-accent",
          isActive && "bg-accent text-accent-foreground border-accent shadow-sm",
          className
        )}
        onClick={() => onNavigate(href)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        aria-current={isActive ? "page" : undefined}
        type="button"
      >
        <div className="flex items-center gap-2 mb-1">
          {icon && <span className="text-base">{icon}</span>}
          <div className="text-sm font-medium leading-none">{title}</div>
        </div>
        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
          {children}
        </p>
      </MotionButton>
    </NavigationMenuLink>
  );
});
ListItem.displayName = "ListItem"; 