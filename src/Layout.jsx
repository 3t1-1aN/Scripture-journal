import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BookOpen, Archive, Home, Sun, Moon } from "lucide-react";

export default function Layout({ children, currentPageName }) {
    const location = useLocation();
    const [isDarkMode, setIsDarkMode] = useState(false);

    const navItems = [
        { name: "Home", url: createPageUrl("Home"), icon: Home },
        { name: "Archive", url: createPageUrl("Archive"), icon: Archive }
    ];

    useEffect(() => {
        // Load dark mode preference from localStorage
        const savedMode = localStorage.getItem('darkMode');
        if (savedMode) {
            setIsDarkMode(JSON.parse(savedMode));
        }
    }, []);

    useEffect(() => {
        // Save dark mode preference to localStorage
        localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    }, [isDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode(!isDarkMode);
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'dark-mode' : ''}`} style={{ backgroundColor: isDarkMode ? '#2D2520' : '#F0EDE5' }}>
            <style>
                {`
          .neumorphic {
            background: ${isDarkMode ? '#2D2520' : '#F0EDE5'};
            box-shadow: 
              8px 8px 16px ${isDarkMode ? '#1F1A17' : '#D4CFC4'},
              -8px -8px 16px ${isDarkMode ? '#3B302A' : '#FFFFFF'};
          }
          
          .neumorphic-inset {
            background: ${isDarkMode ? '#2D2520' : '#F0EDE5'};
            box-shadow: 
              inset 8px 8px 16px ${isDarkMode ? '#1F1A17' : '#D4CFC4'},
              inset -8px -8px 16px ${isDarkMode ? '#3B302A' : '#FFFFFF'};
          }
          
          .neumorphic-hover:hover {
            box-shadow: 
              4px 4px 8px ${isDarkMode ? '#1F1A17' : '#D4CFC4'},
              -4px -4px 8px ${isDarkMode ? '#3B302A' : '#FFFFFF'};
          }
          
          .neumorphic-pressed {
            box-shadow: 
              inset 4px 4px 8px ${isDarkMode ? '#1F1A17' : '#D4CFC4'},
              inset -4px -4px 8px ${isDarkMode ? '#3B302A' : '#FFFFFF'};
          }
          
          .glass {
            background: ${isDarkMode ? 'rgba(45, 37, 32, 0.25)' : 'rgba(240, 237, 229, 0.25)'};
            backdrop-filter: blur(10px);
            border: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.18)'};
            box-shadow: 0 8px 32px 0 rgba(197, 83, 74, 0.05);
          }
          
          .glass-nav {
            background: ${isDarkMode ? 'rgba(45, 37, 32, 0.8)' : 'rgba(240, 237, 229, 0.8)'};
            backdrop-filter: blur(20px);
            border: 1px solid ${isDarkMode ? 'rgba(255, 255, 255, 0.15)' : 'rgba(255, 255, 255, 0.3)'};
          }
          
          .glass-accent {
            background: ${isDarkMode ? 'rgba(197, 83, 74, 0.15)' : 'rgba(197, 83, 74, 0.1)'};
            backdrop-filter: blur(8px);
            border: 1px solid rgba(197, 83, 74, 0.2);
          }
          
          .text-primary { color: ${isDarkMode ? '#E8E0D6' : '#5A4A3A'}; }
          .text-secondary { color: ${isDarkMode ? '#B5A297' : '#8B7B6B'}; }
          .text-accent { color: ${isDarkMode ? '#E67B70' : '#C5534A'}; }
          
          /* Paper texture effect */
          body {
            background-image: 
              radial-gradient(circle at 1px 1px, rgba(196, 83, 74, ${isDarkMode ? '0.03' : '0.02'}) 1px, transparent 0);
            background-size: 20px 20px;
          }
          
          .dark-mode-toggle {
            background: ${isDarkMode ? '#2D2520' : '#F0EDE5'};
            box-shadow: 
              inset 4px 4px 8px ${isDarkMode ? '#1F1A17' : '#D4CFC4'},
              inset -4px -4px 8px ${isDarkMode ? '#3B302A' : '#FFFFFF'};
          }
          
          .dark-mode-toggle:hover {
            box-shadow: 
              inset 2px 2px 4px ${isDarkMode ? '#1F1A17' : '#D4CFC4'},
              inset -2px -2px 4px ${isDarkMode ? '#3B302A' : '#FFFFFF'};
          }
        `}
            </style>

            {/* Header with glass effect */}
            <header className="p-4 md:p-6 pb-4 glass-nav sticky top-0 z-10">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="glass-accent rounded-xl p-3 md:p-4">
                                <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-accent" />
                            </div>
                            <div>
                                <h1 className="text-xl md:text-2xl font-light text-primary">Scripture & Reflection</h1>
                                <p className="text-xs md:text-sm text-secondary font-light">Your digital Bible journal</p>
                            </div>
                        </div>

                        {/* Dark Mode Toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="dark-mode-toggle rounded-full p-3 transition-all duration-200 hover:scale-105"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? (
                                <Sun className="w-5 h-5 text-accent" />
                            ) : (
                                <Moon className="w-5 h-5 text-accent" />
                            )}
                        </button>
                    </div>
                </div>
            </header>

            {/* Navigation with glass */}
            <nav className="px-4 md:px-6 pb-6">
                <div className="max-w-4xl mx-auto">
                    <div className="glass rounded-2xl p-2 inline-flex gap-1 md:gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                to={item.url}
                                className={`
                  flex items-center gap-2 px-3 py-2 md:px-6 md:py-3 rounded-xl transition-all duration-200 font-light text-sm md:text-base
                  ${location.pathname === item.url
                                        ? 'glass-accent text-accent'
                                        : 'text-secondary hover:text-primary hover:bg-white hover:bg-opacity-10'
                                    }
                `}
                            >
                                <item.icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="px-4 md:px-6 pb-8">
                <div className="max-w-4xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}