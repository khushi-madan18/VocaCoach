"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isLight = theme === "light";

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-12 w-12 rounded-full border dark:border-gray-700"
      onClick={() => setTheme(isLight ? "dark" : "light")}
    >
      {isLight ? (
        <Moon className="h-6 w-6 text-blue-600" />
      ) : (
        <Sun className="h-6 w-6 text-yellow-400" />
      )}
    </Button>
  );
}
