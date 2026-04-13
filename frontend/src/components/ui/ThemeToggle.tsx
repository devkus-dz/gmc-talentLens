"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react"; // Imported Lucide Icons

export default function ThemeToggle() {
    const [theme, setTheme] = useState("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const initialTheme = storedTheme || (systemPrefersDark ? "dark" : "light");

        setTheme(initialTheme);
        document.documentElement.setAttribute("data-theme", initialTheme);
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        localStorage.setItem("theme", newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };

    return (
        <button
            onClick={mounted ? toggleTheme : undefined}
            className="btn btn-ghost btn-circle btn-sm flex shrink-0 transition-transform hover:scale-110"
            aria-label="Toggle Theme"
        >
            {!mounted ? (
                <div className="w-5 h-5"></div>
            ) : theme === "light" ? (
                <Sun className="w-5 h-5 text-base-content/70" />
            ) : (
                <Moon className="w-5 h-5 text-warning" />
            )}
        </button>
    );
}