"use client";

import * as React from "react";
import { BookOpen, Home, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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

const tools: { title: string; href: Page; description: string }[] = [
  {
    title: "Tax Calculator",
    href: "calculator",
    description: "Calculate your income tax for FY 2025-26 under both tax regimes.",
  },
  {
    title: "Salary Comparison",
    href: "comparison",
    description: "Compare different salary options to make informed career decisions.",
  },
  {
    title: "Tax Regimes",
    href: "regimes",
    description: "Learn about and compare old vs new tax regimes in detail.",
  },
];

export function Navbar() {
  const [open, setOpen] = React.useState(false);
  const { currentPage, setCurrentPage } = useNavigation();
  const { theme, setTheme } = useTheme();

  const handleNavigation = (href: Page) => {
    setCurrentPage(href);
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center px-4 mx-auto">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity duration-200 mr-8"
          onClick={() => handleNavigation("calculator")}
        >
          <div className="relative h-9 w-9">
            <Image
              src="/logo.svg"
              alt="Calcq Logo"
              width={36}
              height={36}
              className="h-9 w-9"
              priority
            />
          </div>
          <div className="flex items-center">
            <h1 className="text-3xl font-extrabold font-plus-jakarta bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
              Calcq
            </h1>
            <div className="ml-1 mt-1">
              <div className="w-1.5 h-1.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Button
                variant={currentPage === "calculator" ? "default" : "ghost"}
                className="h-10 px-4 py-2"
                onClick={() => handleNavigation("calculator")}
              >
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {tools.map((tool) => (
                    <ListItem
                      key={tool.title}
                      title={tool.title}
                      href={tool.href}
                      onNavigate={handleNavigation}
                      isActive={currentPage === tool.href}
                    >
                      {tool.description}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                  <li className="row-span-3">
                    <NavigationMenuLink asChild>
                      <button
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md hover:bg-gradient-to-b hover:from-muted/60 hover:to-muted/90 transition-all duration-200"
                        onClick={() => handleNavigation("guide")}
                      >
                        <BookOpen className="h-6 w-6" />
                        <div className="mb-2 mt-4 text-lg font-medium">
                          Tax Planning Guide
                        </div>
                        <p className="text-sm leading-tight text-muted-foreground">
                          Complete guide to Indian tax planning for FY 2025-26.
                        </p>
                      </button>
                    </NavigationMenuLink>
                  </li>
                  <ListItem 
                    href="help" 
                    title="Help & FAQs"
                    onNavigate={handleNavigation}
                    isActive={currentPage === "help"}
                  >
                    Get answers to common questions about tax calculations.
                  </ListItem>
                  <ListItem 
                    href="about" 
                    title="About"
                    onNavigate={handleNavigation}
                    isActive={currentPage === "about"}
                  >
                    Learn about the project and developer.
                  </ListItem>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Side Actions */}
        <div className="ml-auto flex items-center space-x-3">
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
                className="md:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] p-0">
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="border-b p-6">
                  <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9">
                      <Image
                        src="/logo.svg"
                        alt="Calcq Logo"
                        width={36}
                        height={36}
                        className="h-9 w-9"
                        priority
                      />
                    </div>
                    <div className="flex items-center">
                      <h1 className="text-3xl font-extrabold font-plus-jakarta bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent tracking-tighter">
                        Calcq
                      </h1>
                      <div className="ml-1 mt-1">
                        <div className="w-1.5 h-1.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile Live Indicator */}
                  <div className="mt-4">
                    <LiveIndicator />
                  </div>
                </div>

                {/* Navigation Content */}
                <div className="flex-1 overflow-y-auto py-4">
                  <nav className="space-y-1 px-4">
                    {/* Home */}
                    <Button
                      variant={currentPage === "calculator" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => handleNavigation("calculator")}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </Button>

                    {/* Tools Section */}
                    <div className="pt-4">
                      <h3 className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Tools
                      </h3>
                      <div className="space-y-1">
                        {tools.map((tool) => (
                          <Button
                            key={tool.href}
                            variant={currentPage === tool.href ? "default" : "ghost"}
                            className="w-full justify-start"
                            onClick={() => handleNavigation(tool.href)}
                          >
                            {tool.title}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Resources Section */}
                    <div className="pt-4">
                      <h3 className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        Resources
                      </h3>
                      <div className="space-y-1">
                        <Button
                          variant={currentPage === "guide" ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => handleNavigation("guide")}
                        >
                          Tax Planning Guide
                        </Button>
                        <Button
                          variant={currentPage === "help" ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => handleNavigation("help")}
                        >
                          Help & FAQs
                        </Button>
                        <Button
                          variant={currentPage === "about" ? "default" : "ghost"}
                          className="w-full justify-start"
                          onClick={() => handleNavigation("about")}
                        >
                          About
                        </Button>
                      </div>
                    </div>
                  </nav>
                </div>

                {/* Footer Actions */}
                <div className="border-t p-4 space-y-3">
                  {/* Theme Section */}
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
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"button">,
  React.ComponentPropsWithoutRef<"button"> & { 
    href: Page;
    onNavigate: (href: Page) => void;
    isActive?: boolean;
  }
>(({ className, title, children, href, onNavigate, isActive, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <button
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            isActive && "bg-accent text-accent-foreground",
            className
          )}
          onClick={() => onNavigate(href)}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </button>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem"; 