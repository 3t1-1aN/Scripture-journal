import React, { useState, useEffect, useCallback } from "react";
import { StudyEntry } from "@/entities/StudyEntry";
import { format } from "date-fns";
import { BookOpen, Calendar, Search, Filter, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";

const modeLabels = {
    book_study: "Book Study",
    psalms_proverbs: "Psalms & Proverbs",
    character_study: "Character Study",
    gospels: "Gospel Study",
    general: "General Study"
};

const modeColors = {
    book_study: "text-blue-600",
    psalms_proverbs: "text-purple-600",
    character_study: "text-green-600",
    gospels: "text-orange-600",
    general: "text-pink-600"
};

export default function Archive() {
    const navigate = useNavigate();
    const [entries, setEntries] = useState([]);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedMode, setSelectedMode] = useState("all");
    const [selectedEntry, setSelectedEntry] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const loadEntries = useCallback(async () => {
        setIsLoading(true);
        try {
            const data = await StudyEntry.list("-study_date");
            setEntries(data);
        } catch (error) {
            console.error("Error loading entries:", error);
        }
        setIsLoading(false);
    }, []);

    const filterEntries = useCallback(() => {
        let filtered = entries;

        if (selectedMode !== "all") {
            filtered = filtered.filter(entry => entry.study_mode === selectedMode);
        }

        if (searchTerm) {
            filtered = filtered.filter(entry =>
                (entry.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (entry.scripture_reference || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                (entry.content || '').toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredEntries(filtered);
        // If the currently selected entry is no longer in the filtered list, deselect it
        if (selectedEntry && !filtered.find(e => e.id === selectedEntry.id)) {
            setSelectedEntry(null);
        }
    }, [entries, searchTerm, selectedMode, selectedEntry]);

    useEffect(() => {
        loadEntries();
    }, [loadEntries]);

    useEffect(() => {
        filterEntries();
    }, [filterEntries]);

    const handleEdit = () => {
        if (selectedEntry) {
            navigate(createPageUrl(`Study?mode=${selectedEntry.study_mode}&edit=${selectedEntry.id}`));
        }
    };

    const handleDelete = async () => {
        if (!selectedEntry) return;

        try {
            await StudyEntry.delete(selectedEntry.id);
            setShowDeleteConfirm(false);
            setSelectedEntry(null);
            // Re-fetch entries to reflect deletion
            await loadEntries();
        } catch (error) {
            console.error("Failed to delete entry:", error);
            // Optionally show an error to the user here
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="glass rounded-2xl p-8 text-center">
                    <div className="animate-pulse text-secondary">Loading your studies...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="glass rounded-2xl p-4 md:p-6">
                <h2 className="text-xl md:text-2xl font-light text-primary mb-2">Study Archive</h2>
                <p className="text-sm md:text-base text-secondary font-light">Your spiritual journey documented</p>
            </div>

            {/* Search and Filters */}
            <div className="neumorphic rounded-2xl p-4 md:p-6 relative overflow-hidden">
                <div className="glass rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search your studies..."
                                className="w-full neumorphic-inset rounded-xl pl-10 pr-4 py-3 text-primary font-light bg-transparent border-none outline-none placeholder-secondary"
                            />
                        </div>

                        <div className="relative">
                            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-secondary" />
                            <select
                                value={selectedMode}
                                onChange={(e) => setSelectedMode(e.target.value)}
                                className="w-full neumorphic-inset rounded-xl pl-10 pr-4 py-3 text-primary font-light bg-transparent border-none outline-none appearance-none cursor-pointer"
                            >
                                <option value="all">All Study Types</option>
                                <option value="book_study">Book Study</option>
                                <option value="psalms_proverbs">Psalms & Proverbs</option>
                                <option value="character_study">Character Study</option>
                                <option value="gospels">Gospel Study</option>
                                <option value="general">General Study</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Entries Grid */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    {filteredEntries.length === 0 ? (
                        <div className="glass rounded-2xl p-8 text-center">
                            <BookOpen className="w-12 h-12 text-secondary mx-auto mb-4" />
                            <p className="text-secondary font-light">
                                {searchTerm || selectedMode !== "all" ? "No studies match your search" : "No studies yet. Start your first study!"}
                            </p>
                        </div>
                    ) : (
                        filteredEntries.map((entry) => (
                            <div
                                key={entry.id}
                                onClick={() => setSelectedEntry(entry)}
                                className={`
                  neumorphic rounded-2xl p-4 sm:p-6 cursor-pointer transition-all duration-200 relative overflow-hidden group
                  hover:scale-[0.99]
                  ${selectedEntry?.id === entry.id ? 'neumorphic-pressed' : 'neumorphic-hover'}
                `}
                            >
                                {/* Glass overlay on selection */}
                                {selectedEntry?.id === entry.id && (
                                    <div className="absolute inset-0 glass-accent rounded-2xl" />
                                )}

                                <div className="space-y-3 relative z-10">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-base sm:text-lg font-medium text-primary mb-1">{entry.title}</h3>
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-secondary">
                                                <span className={`font-medium ${modeColors[entry.study_mode]} glass-accent rounded px-2 py-1 text-xs self-start`}>
                                                    {modeLabels[entry.study_mode]}
                                                </span>
                                                <span className="hidden sm:inline">•</span>
                                                <span className="flex items-center gap-1 text-xs sm:text-sm">
                                                    <Calendar className="w-3 h-3" />
                                                    {format(new Date(entry.study_date), "MMM d, yyyy")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {entry.scripture_reference && (
                                        <div className="glass-accent rounded-lg px-3 py-2">
                                            <p className="text-sm text-accent font-medium">{entry.scripture_reference}</p>
                                        </div>
                                    )}

                                    <p className="text-sm text-secondary font-light leading-relaxed line-clamp-2 sm:line-clamp-3">
                                        {(entry.content || '').substring(0, 150)}{(entry.content || '').length > 150 ? '...' : ''}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Entry Details */}
                <div className="lg:sticky lg:top-6">
                    {selectedEntry ? (
                        <div className="neumorphic rounded-2xl p-4 sm:p-6 space-y-6 relative overflow-hidden">
                            <div className="glass rounded-xl p-4 sm:p-6 space-y-4">
                                <div>
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg sm:text-xl font-medium text-primary flex-1">{selectedEntry.title}</h3>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={handleEdit}
                                                className="glass-accent rounded-full w-10 h-10 hover:bg-opacity-30"
                                            >
                                                <Edit3 className="w-4 h-4 text-accent" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setShowDeleteConfirm(true)}
                                                className="glass-accent rounded-full w-10 h-10 hover:bg-opacity-30"
                                            >
                                                <Trash2 className="w-4 h-4 text-accent" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-secondary mb-4">
                                        <span className={`font-medium ${modeColors[selectedEntry.study_mode]} glass-accent rounded px-2 py-1 text-xs self-start`}>
                                            {modeLabels[selectedEntry.study_mode]}
                                        </span>
                                        <span className="hidden sm:inline">•</span>
                                        <span className="text-xs sm:text-sm">{format(new Date(selectedEntry.study_date), "MMMM d, yyyy")}</span>
                                    </div>

                                    {selectedEntry.scripture_reference && (
                                        <div className="glass-accent rounded-lg px-4 py-3 mb-4">
                                            <p className="text-accent font-medium">{selectedEntry.scripture_reference}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-secondary mb-3">Reflection</h4>
                                    <div className="neumorphic-inset rounded-xl p-4">
                                        <div
                                            className="text-primary font-light leading-relaxed prose prose-sm max-w-none"
                                            dangerouslySetInnerHTML={{ __html: selectedEntry.content || '' }}
                                            style={{
                                                color: '#5A4A3A'
                                            }}
                                        />
                                    </div>
                                </div>

                                {selectedEntry.key_insights && selectedEntry.key_insights.length > 0 && (
                                    <div>
                                        <h4 className="text-sm font-medium text-secondary mb-3">Key Insights</h4>
                                        <div className="space-y-2">
                                            {selectedEntry.key_insights.map((insight, index) => (
                                                <div key={index} className="glass-accent rounded-lg px-3 py-2">
                                                    <p className="text-sm text-primary font-light">• {insight}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedEntry.prayer_requests && (
                                    <div>
                                        <h4 className="text-sm font-medium text-secondary mb-3">Prayer & Application</h4>
                                        <div className="neumorphic-inset rounded-xl p-4">
                                            <div
                                                className="text-primary font-light leading-relaxed prose prose-sm max-w-none"
                                                dangerouslySetInnerHTML={{ __html: selectedEntry.prayer_requests || '' }}
                                                style={{
                                                    color: '#5A4A3A'
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="glass rounded-2xl p-8 text-center">
                            <BookOpen className="w-12 h-12 text-secondary mx-auto mb-4" />
                            <p className="text-secondary font-light">Select a study to view details</p>
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent className="glass rounded-2xl text-primary">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription className="text-secondary font-light">
                            Are you sure you want to permanently delete the entry titled "{selectedEntry?.title}"? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteConfirm(false)}
                            className="glass hover:bg-white hover:bg-opacity-20 text-primary"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            className="bg-accent/80 hover:bg-accent text-white"
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}