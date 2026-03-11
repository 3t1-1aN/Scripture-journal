import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BookOpen, Scroll, Users, Cross, Lightbulb, ArrowRight } from "lucide-react";

const studyModes = [
    {
        id: "book_study",
        title: "Book Study",
        description: "Deep dive into entire books of the Bible",
        icon: BookOpen,
        color: "text-blue-600"
    },
    {
        id: "psalms_proverbs",
        title: "Psalms & Proverbs",
        description: "Daily wisdom and worship through poetry",
        icon: Scroll,
        color: "text-purple-600"
    },
    {
        id: "character_study",
        title: "Character Study",
        description: "Learn from biblical figures and their journeys",
        icon: Users,
        color: "text-green-600"
    },
    {
        id: "gospels",
        title: "Gospel Study",
        description: "Walk with Jesus through the four Gospels",
        icon: Cross,
        color: "text-orange-600"
    },
    {
        id: "general",
        title: "General Study",
        description: "Open-ended study for any passage or topic",
        icon: Lightbulb,
        color: "text-pink-600"
    }
];

export default function Home() {
    const navigate = useNavigate();
    const [selectedMode, setSelectedMode] = useState(null);

    const handleModeSelect = (mode) => {
        setSelectedMode(mode);
        setTimeout(() => {
            navigate(createPageUrl(`Study?mode=${mode.id}`));
        }, 150);
    };

    return (
        <div className="space-y-6 md:space-y-8">
            {/* Welcome Section with glass overlay */}
            <div className="relative">
                <div className="neumorphic rounded-3xl p-4 md:p-8 text-center">
                    <div className="glass rounded-2xl p-4 md:p-6 mx-auto max-w-2xl">
                        <h2 className="text-2xl sm:text-3xl font-light text-primary mb-3">Begin Your Study</h2>
                        <p className="text-secondary font-light leading-relaxed text-sm md:text-base">
                            Choose a study mode that resonates with your spiritual journey today.
                            Each mode is designed to guide your reflection and deepen your understanding.
                        </p>
                    </div>
                </div>
            </div>

            {/* Study Mode Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {studyModes.map((mode) => (
                    <div
                        key={mode.id}
                        onClick={() => handleModeSelect(mode)}
                        className={`
              neumorphic rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-300 group
              hover:shadow-inner hover:scale-[0.98] active:scale-[0.96] relative overflow-hidden
              ${selectedMode?.id === mode.id ? 'neumorphic-pressed' : 'neumorphic-hover'}
            `}
                    >
                        {/* Glass overlay on hover */}
                        <div className="absolute inset-0 glass opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                        <div className="space-y-3 md:space-y-4 relative z-10">
                            <div className="flex items-center justify-between">
                                <div className="glass-accent rounded-xl p-3 group-hover:bg-opacity-30 transition-all duration-200">
                                    <mode.icon className={`w-5 h-5 md:w-6 md:h-6 ${mode.color}`} />
                                </div>
                                <ArrowRight className="w-4 h-4 text-secondary opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>

                            <div>
                                <h3 className="text-base md:text-lg font-medium text-primary mb-2">{mode.title}</h3>
                                <p className="text-sm text-secondary font-light leading-relaxed">
                                    {mode.description}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Quick Stats with glass accents */}
            <div className="neumorphic-inset rounded-2xl p-4 md:p-6 relative overflow-hidden">
                <div className="glass rounded-xl p-2 md:p-4">
                    <div className="grid grid-cols-3 gap-2 md:gap-6 text-center">
                        <div className="glass-accent rounded-lg p-2 md:p-3">
                            <div className="text-xl md:text-2xl font-light text-primary">12</div>
                            <div className="text-xs md:text-sm text-secondary font-light">Studies</div>
                        </div>
                        <div className="glass-accent rounded-lg p-2 md:p-3">
                            <div className="text-xl md:text-2xl font-light text-primary">3</div>
                            <div className="text-xs md:text-sm text-secondary font-light">Streak</div>
                        </div>
                        <div className="glass-accent rounded-lg p-2 md:p-3">
                            <div className="text-xl md:text-2xl font-light text-primary">45</div>
                            <div className="text-xs md:text-sm text-secondary font-light">Entries</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}