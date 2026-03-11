import React, { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { StudyEntry } from "@/entities/StudyEntry";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Save, Plus, Minus, ArrowLeft } from "lucide-react";
import { format } from "date-fns";

const modeConfigs = {
    book_study: {
        title: "Book Study",
        prompts: [
            "What is the main theme of this passage?",
            "How does this connect to the broader narrative?",
            "What does this reveal about God's character?"
        ],
        placeholder: "Reflect on the passage's meaning and context..."
    },
    psalms_proverbs: {
        title: "Psalms & Proverbs",
        prompts: [
            "What emotions does this passage evoke?",
            "What practical wisdom can I apply today?",
            "How does this relate to my current circumstances?"
        ],
        placeholder: "Let your heart respond to these words..."
    },
    character_study: {
        title: "Character Study",
        prompts: [
            "What character qualities do I observe?",
            "What can I learn from their choices?",
            "How does God work through this person?"
        ],
        placeholder: "Explore the character's journey and lessons..."
    },
    gospels: {
        title: "Gospel Study",
        prompts: [
            "What does this reveal about Jesus?",
            "How does this impact my understanding of the Gospel?",
            "What is Jesus calling me to do?"
        ],
        placeholder: "Walk with Jesus through this passage..."
    },
    general: {
        title: "General Study",
        prompts: [
            "What stands out to me in this passage?",
            "What questions does this raise?",
            "How can I apply this to my life?"
        ],
        placeholder: "Share your thoughts and reflections..."
    }
};

// Rich text editor configuration
const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ 'color': ['#000000', '#C5534A', '#5A4A3A', '#8B7B6B', '#4A90E2', '#F39C12', '#27AE60'] }],
        [{ 'background': ['#FFF2CC', '#FFE6E6', '#E6F3FF', '#E8F5E8', '#F3E6FF'] }],
        ['blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        ['clean']
    ],
    clipboard: {
        matchVisual: false,
    }
};

const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'color', 'background',
    'blockquote', 'list', 'bullet', 'indent'
];

export default function Study() {
    const navigate = useNavigate();
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode') || 'general';
    const editId = urlParams.get('edit');
    const isEditing = !!editId;
    const config = modeConfigs[mode];

    const [entry, setEntry] = useState({
        title: "",
        study_mode: mode,
        scripture_reference: "",
        content: "",
        key_insights: [""],
        prayer_requests: "",
        study_date: format(new Date(), 'yyyy-MM-dd')
    });

    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(isEditing);

    useEffect(() => {
        if (isEditing) {
            loadEntryForEditing();
        }
    }, [editId, isEditing]);

    const loadEntryForEditing = async () => {
        setIsLoading(true);
        try {
            const entries = await StudyEntry.list();
            const entryToEdit = entries.find(e => e.id === editId);
            if (entryToEdit) {
                setEntry({
                    ...entryToEdit,
                    key_insights: entryToEdit.key_insights?.length > 0 ? entryToEdit.key_insights : [""]
                });
            } else {
                navigate(createPageUrl("Archive"));
            }
        } catch (error) {
            console.error("Error loading entry for editing:", error);
            navigate(createPageUrl("Archive"));
        }
        setIsLoading(false);
    };

    const handleInputChange = (field, value) => {
        setEntry(prev => ({ ...prev, [field]: value }));
    };

    const handleInsightChange = (index, value) => {
        const newInsights = [...entry.key_insights];
        newInsights[index] = value;
        setEntry(prev => ({ ...prev, key_insights: newInsights }));
    };

    const addInsight = () => {
        setEntry(prev => ({
            ...prev,
            key_insights: [...prev.key_insights, ""]
        }));
    };

    const removeInsight = (index) => {
        if (entry.key_insights.length > 1) {
            setEntry(prev => ({
                ...prev,
                key_insights: prev.key_insights.filter((_, i) => i !== index)
            }));
        }
    };

    const handleSave = async () => {
        if (!entry.title.trim()) return;

        setIsSaving(true);
        try {
            const dataToSave = {
                ...entry,
                key_insights: entry.key_insights.filter(insight => insight.trim() !== "")
            };

            if (isEditing) {
                await StudyEntry.update(editId, dataToSave);
            } else {
                await StudyEntry.create(dataToSave);
            }
            navigate(createPageUrl("Archive"));
        } catch (error) {
            console.error("Error saving entry:", error);
        }
        setIsSaving(false);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="glass rounded-2xl p-8 text-center">
                    <div className="animate-pulse text-secondary">Loading study...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with glass backdrop */}
            <div className="glass rounded-2xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4">
                        <button
                            onClick={() => navigate(createPageUrl("Archive"))}
                            className="glass-accent rounded-xl p-3 hover:bg-opacity-30 transition-all duration-200"
                        >
                            <ArrowLeft className="w-5 h-5 text-secondary" />
                        </button>
                        <div>
                            <h2 className="text-lg sm:text-xl md:text-2xl font-light text-primary">{config.title}</h2>
                            <p className="text-xs sm:text-sm text-secondary font-light">
                                {isEditing ? 'Edit study entry' : 'New study entry'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={!entry.title.trim() || isSaving}
                        className={`
              glass-accent rounded-xl px-3 py-3 sm:px-4 sm:py-3 flex items-center gap-2 transition-all duration-200 font-light
              ${entry.title.trim() ? 'hover:bg-opacity-30 text-accent' : 'text-secondary cursor-not-allowed'}
            `}
                    >
                        <Save className="w-4 h-4" />
                        <span className="hidden sm:inline text-sm">
                            {isSaving ? (isEditing ? 'Updating...' : 'Saving...') : (isEditing ? 'Update' : 'Save')}
                        </span>
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Study Form */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <div className="neumorphic rounded-2xl p-6 space-y-4 relative overflow-hidden">
                        <div className="glass rounded-xl p-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-light text-secondary mb-2">Study Title</label>
                                    <input
                                        type="text"
                                        value={entry.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        placeholder="Give your study a meaningful title..."
                                        className="w-full neumorphic-inset rounded-xl px-4 py-3 text-primary font-light bg-transparent border-none outline-none placeholder-secondary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-light text-secondary mb-2">Scripture Reference</label>
                                    <input
                                        type="text"
                                        value={entry.scripture_reference}
                                        onChange={(e) => handleInputChange('scripture_reference', e.target.value)}
                                        placeholder="e.g., John 3:16-21, Psalm 23, etc."
                                        className="w-full neumorphic-inset rounded-xl px-4 py-3 text-primary font-light bg-transparent border-none outline-none placeholder-secondary"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-light text-secondary mb-2">Study Date</label>
                                    <input
                                        type="date"
                                        value={entry.study_date}
                                        onChange={(e) => handleInputChange('study_date', e.target.value)}
                                        className="neumorphic-inset rounded-xl px-4 py-3 text-primary font-light bg-transparent border-none outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Reflection with Rich Text Editor */}
                    <div className="neumorphic rounded-2xl p-6">
                        <label className="block text-sm font-light text-secondary mb-4">Reflection & Notes</label>
                        <div className="neumorphic-inset rounded-xl overflow-hidden">
                            <style>
                                {`
                  .ql-editor {
                    min-height: 300px;
                    font-family: inherit;
                    font-weight: 300;
                    line-height: 1.6;
                    color: #5A4A3A;
                    background: transparent;
                  }
                  
                  .ql-editor.ql-blank::before {
                    color: #8B7B6B;
                    font-style: normal;
                    font-weight: 300;
                    left: 16px;
                    right: 16px;
                  }
                  
                  .ql-toolbar {
                    border: none !important;
                    border-bottom: 1px solid rgba(139, 123, 107, 0.2) !important;
                    background: rgba(240, 237, 229, 0.5);
                    backdrop-filter: blur(10px);
                    padding: 8px 16px;
                  }
                  
                  .ql-container {
                    border: none !important;
                    font-size: 14px;
                  }
                  
                  .ql-toolbar .ql-stroke {
                    stroke: #8B7B6B;
                  }
                  
                  .ql-toolbar .ql-fill {
                    fill: #8B7B6B;
                  }
                  
                  .ql-toolbar button:hover .ql-stroke {
                    stroke: #C5534A;
                  }
                  
                  .ql-toolbar button:hover .ql-fill {
                    fill: #C5534A;
                  }
                  
                  .ql-toolbar button.ql-active .ql-stroke {
                    stroke: #C5534A;
                  }
                  
                  .ql-toolbar button.ql-active .ql-fill {
                    fill: #C5534A;
                  }
                  
                  .ql-picker-label {
                    color: #8B7B6B !important;
                  }
                  
                  .ql-picker-options {
                    background: #F0EDE5;
                    border: 1px solid rgba(139, 123, 107, 0.2);
                    border-radius: 8px;
                  }
                  
                  .ql-editor h1, .ql-editor h2, .ql-editor h3 {
                    color: #5A4A3A;
                    font-weight: 500;
                  }
                  
                  .ql-editor blockquote {
                    border-left: 4px solid #C5534A;
                    background: rgba(197, 83, 74, 0.05);
                    padding: 12px 16px;
                    margin: 16px 0;
                    font-style: italic;
                  }
                  
                  .ql-editor strong {
                    font-weight: 600;
                  }
                `}
                            </style>
                            <ReactQuill
                                theme="snow"
                                value={entry.content}
                                onChange={(value) => handleInputChange('content', value)}
                                placeholder={config.placeholder}
                                modules={quillModules}
                                formats={quillFormats}
                            />
                        </div>
                    </div>

                    {/* Key Insights */}
                    <div className="neumorphic rounded-2xl p-6 space-y-4">
                        <div className="glass rounded-xl p-4">
                            <div className="flex items-center justify-between mb-4">
                                <label className="text-sm font-light text-secondary">Key Insights</label>
                                <button
                                    onClick={addInsight}
                                    className="glass-accent rounded-lg p-2 hover:bg-opacity-30 transition-all duration-200"
                                >
                                    <Plus className="w-4 h-4 text-secondary" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                {entry.key_insights.map((insight, index) => (
                                    <div key={index} className="flex gap-3 items-start">
                                        <input
                                            type="text"
                                            value={insight}
                                            onChange={(e) => handleInsightChange(index, e.target.value)}
                                            placeholder="What key insight did you discover?"
                                            className="flex-1 neumorphic-inset rounded-lg px-3 py-2 text-primary font-light bg-transparent border-none outline-none placeholder-secondary"
                                        />
                                        {entry.key_insights.length > 1 && (
                                            <button
                                                onClick={() => removeInsight(index)}
                                                className="glass-accent rounded-lg p-2 hover:bg-opacity-30 transition-all duration-200"
                                            >
                                                <Minus className="w-4 h-4 text-secondary" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Prayer Requests with Rich Text */}
                    <div className="neumorphic rounded-2xl p-6">
                        <label className="block text-sm font-light text-secondary mb-4">Prayer & Application</label>
                        <div className="neumorphic-inset rounded-xl overflow-hidden">
                            <style>
                                {`
                  .prayer-editor .ql-editor {
                    min-height: 120px;
                  }
                  
                  .prayer-editor .ql-toolbar {
                    padding: 6px 12px;
                  }
                  
                  .prayer-editor .ql-container {
                    font-size: 14px;
                  }
                `}
                            </style>
                            <div className="prayer-editor">
                                <ReactQuill
                                    theme="snow"
                                    value={entry.prayer_requests}
                                    onChange={(value) => handleInputChange('prayer_requests', value)}
                                    placeholder="How can you pray about this? What will you apply to your life?"
                                    modules={{
                                        toolbar: [
                                            ['bold', 'italic', 'underline'],
                                            [{ 'color': ['#000000', '#C5534A', '#5A4A3A', '#8B7B6B'] }],
                                            [{ 'background': ['#FFF2CC', '#FFE6E6', '#E6F3FF'] }],
                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                            ['clean']
                                        ]
                                    }}
                                    formats={['bold', 'italic', 'underline', 'color', 'background', 'list', 'bullet']}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Study Prompts Sidebar - Enhanced with formatting tips */}
                <div className="space-y-6">
                    <div className="neumorphic rounded-2xl p-6 relative overflow-hidden">
                        <div className="glass rounded-xl p-4">
                            <h3 className="text-lg font-light text-primary mb-4">Reflection Prompts</h3>
                            <div className="space-y-3">
                                {config.prompts.map((prompt, index) => (
                                    <div key={index} className="glass-accent rounded-lg p-3">
                                        <p className="text-sm text-secondary font-light">{prompt}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="neumorphic-inset rounded-2xl p-6 relative overflow-hidden">
                        <div className="glass rounded-xl p-4">
                            <h3 className="text-lg font-light text-primary mb-3">Formatting Tips</h3>
                            <div className="space-y-2 text-sm text-secondary font-light leading-relaxed">
                                <p>• Use <strong>bold</strong> for key verses or concepts</p>
                                <p>• <em>Italicize</em> for personal reflections</p>
                                <p>• Highlight important insights with colors</p>
                                <p>• Use quotes for scripture passages</p>
                                <p>• Create lists for action items</p>
                            </div>
                        </div>
                    </div>

                    <div className="neumorphic-inset rounded-2xl p-6 relative overflow-hidden">
                        <div className="glass rounded-xl p-4">
                            <h3 className="text-lg font-light text-primary mb-3">Study Tips</h3>
                            <div className="space-y-2 text-sm text-secondary font-light leading-relaxed">
                                <p>• Read the passage slowly, multiple times</p>
                                <p>• Consider the historical and cultural context</p>
                                <p>• Look for connections to other scriptures</p>
                                <p>• Ask how this applies to your life today</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}