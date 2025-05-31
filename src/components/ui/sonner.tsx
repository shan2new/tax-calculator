"use client"

import { useTheme } from "@/lib/theme-context"
import { Toaster as Sonner, ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme()

  // Get actual theme (resolve system preference)
  const getEffectiveTheme = () => {
    if (theme === "system") {
      return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    }
    return theme
  }

  return (
    <Sonner
      theme={getEffectiveTheme() as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
