
import React, { useState, useEffect } from 'react';
import { Story, ThemeMode } from '../types';
import { geminiService } from '../services/geminiService';
import { ChevronLeft, Settings, Sparkles } from 'lucide-react';

interface ReaderProps {
  story: Story;
  initialChapterIndex: number;
  onSaveProgress: (index: number) => void;
  onBack: () => void;
}

export const Reader: React.FC<ReaderProps> = ({ story, initialChapterIndex, onSaveProgress, onBack }) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(initialChapterIndex);
  const [fontSize, setFontSize] = useState(18);
  const [theme, setTheme] = useState<ThemeMode>(ThemeMode.DARK);
  const [showSettings, setShowSettings] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sync state if prop changes (re-opening reader)
  useEffect(() => {
    setCurrentChapterIndex(initialChapterIndex);
  }, [initialChapterIndex]);

  // Update progress whenever chapter changes
  useEffect(() => {
      onSaveProgress(currentChapterIndex);
  }, [currentChapterIndex, onSaveProgress]);

  // Get current chapter based on index. Fallback to first if empty (though stories should have chapters)
  const currentChapter = story.chapters[currentChapterIndex] || { title: 'End', content: 'No content available.' };

  // Reset summary when chapter changes
  useEffect(() => {
    setAiSummary('');
  }, [currentChapterIndex]);

  const handleSummarize = async () => {
    setIsLoading(true);
    const summary = await geminiService.summarizeText(currentChapter.content);
    setAiSummary(summary);
    setIsLoading(false);
  };

  const handleNextChapter = () => {
    if (currentChapterIndex < story.chapters.length - 1) {
      setCurrentChapterIndex(prev => prev + 1);
      document.getElementById('reader-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(prev => prev - 1);
      document.getElementById('reader-scroll-container')?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getThemeClasses = () => {
    switch(theme) {
        case ThemeMode.LIGHT: return 'bg-[#f8f9fa] text-gray-900';
        case ThemeMode.SEPIA: return 'bg-[#f4ecd8] text-[#5b4636]';
        default: return 'bg-[#16161a] text-[#d1d5db]';
    }
  };

  // Helper to parse title for display (e.g. "Chapter 1: The Storm" -> "The Storm")
  const displayTitle = currentChapter.title.includes(':') 
    ? currentChapter.title.split(':')[1].trim() 
    : currentChapter.title;

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${getThemeClasses()} transition-colors duration-300`}>
      {/* Reader Nav */}
      <div className={`h-16 flex flex-shrink-0 items-center justify-between px-6 lg:px-10 border-b ${theme === ThemeMode.DARK ? 'border-dark-border bg-dark-card' : 'border-gray-200 bg-white/90'} backdrop-blur-sm z-30`}>
        <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors">
                <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex flex-col">
                <h2 className="text-sm font-bold uppercase tracking-widest opacity-80">{story.title}</h2>
                <div className="flex items-center gap-2 text-xs opacity-60">
                    <span>{currentChapter.title}</span>
                </div>
            </div>
        </div>
        
        <div className="flex items-center space-x-3">
            <button 
                onClick={() => setShowAI(!showAI)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors text-sm font-medium ${showAI ? 'bg-primary-600 text-white' : 'bg-transparent border border-current opacity-60 hover:opacity-100'}`}
            >
                <Sparkles className="w-4 h-4" />
                <span>AI Companion</span>
            </button>
            <div className="h-6 w-px bg-current opacity-20"></div>
            <button 
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full transition-colors"
            >
                <Settings className="w-5 h-5" />
            </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Main Text - Horizontal Wide Layout */}
        <div 
            id="reader-scroll-container"
            className="flex-1 overflow-y-auto w-full scroll-smooth"
        >
            <div className="w-full max-w-5xl mx-auto px-8 md:px-16 lg:px-24 py-16 pb-32">
                
                <h1 className="text-4xl md:text-5xl font-bold mb-12 font-serif text-center leading-tight">
                    Chapter {currentChapterIndex + 1} <br/>
                    <span className="text-2xl md:text-3xl opacity-60 font-sans font-normal">{displayTitle}</span>
                </h1>

                <div 
                    style={{ fontSize: `${fontSize}px`, lineHeight: '1.8' }} 
                    className="font-serif whitespace-pre-line text-justify"
                >
                    {currentChapter.content}
                </div>
                
                <div className="mt-24 flex justify-between items-center pt-8 border-t border-current border-opacity-10">
                    <button 
                        onClick={handlePrevChapter}
                        disabled={currentChapterIndex === 0}
                        className={`px-8 py-4 rounded-xl border border-current border-opacity-20 font-medium transition-all ${currentChapterIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}
                    >
                        Previous Chapter
                    </button>
                    <button 
                        onClick={handleNextChapter}
                        disabled={currentChapterIndex === story.chapters.length - 1}
                        className={`px-8 py-4 rounded-xl bg-primary-600 text-white font-bold shadow-lg shadow-primary-900/20 transition-all ${currentChapterIndex === story.chapters.length - 1 ? 'opacity-50 cursor-not-allowed bg-gray-500' : 'hover:bg-primary-700'}`}
                    >
                        {currentChapterIndex === story.chapters.length - 1 ? 'End of Story' : 'Next Chapter'}
                    </button>
                </div>
            </div>
        </div>

        {/* AI Sidebar - Collapsible on Right */}
        {showAI && (
            <div className={`w-96 border-l flex-shrink-0 flex flex-col h-full shadow-2xl z-20 transition-all ${theme === ThemeMode.DARK ? 'border-dark-border bg-[#1a1a20]' : 'border-gray-200 bg-gray-50'}`}>
                <div className="p-5 border-b border-gray-500/10 bg-opacity-50">
                    <h3 className="font-bold flex items-center text-lg">
                        <Sparkles className="w-5 h-5 mr-2 text-primary-500" /> 
                        Reading Companion
                    </h3>
                </div>
                <div className="p-5 overflow-y-auto flex-1 space-y-6">
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-xs font-bold opacity-60 uppercase tracking-wider">Fast Recap</h4>
                        </div>
                        {!aiSummary ? (
                            <button 
                                onClick={handleSummarize}
                                disabled={isLoading}
                                className="w-full py-3 bg-primary-600/10 hover:bg-primary-600/20 text-primary-500 rounded-lg text-sm font-medium border border-primary-500/20 transition-colors flex items-center justify-center gap-2"
                            >
                                {isLoading ? <span className="animate-spin">↻</span> : <Sparkles className="w-4 h-4" />}
                                {isLoading ? "Analyzing..." : "Summarize Chapter"}
                            </button>
                        ) : (
                            <div className={`text-sm leading-relaxed p-4 rounded-xl border ${theme === ThemeMode.DARK ? 'bg-black/20 border-white/10' : 'bg-white border-gray-200'}`}>
                                {aiSummary}
                            </div>
                        )}
                    </div>
                    
                    <div>
                        <h4 className="text-xs font-bold opacity-60 uppercase mb-3 tracking-wider">Context & Lore</h4>
                        <div className={`p-4 rounded-xl border ${theme === ThemeMode.DARK ? 'bg-black/20 border-white/10' : 'bg-white border-gray-200'}`}>
                             <ul className="space-y-3 text-sm opacity-90">
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-500 mt-2"></span>
                                    <span><strong>{story.author}:</strong> Author of this tale.</span>
                                </li>
                                <li className="flex gap-3">
                                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-500 mt-2"></span>
                                    <span><strong>Genre:</strong> {story.genre}</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                     <div>
                        <h4 className="text-xs font-bold opacity-60 uppercase mb-3 tracking-wider">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                            {story.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 text-xs border border-primary-500/20">
                                    {tag}
                                </span>
                            ))}
                        </div>
                     </div>
                </div>
            </div>
        )}

        {/* Settings Popover */}
        {showSettings && (
             <div className={`absolute top-20 right-10 w-80 p-6 rounded-2xl shadow-2xl z-30 border ${theme === ThemeMode.DARK ? 'bg-[#1e1e24] border-dark-border' : 'bg-white border-gray-200'}`}>
                <h3 className="font-bold text-lg mb-4">Reading Settings</h3>
                
                <div className="mb-6">
                    <label className="text-xs font-bold opacity-50 uppercase mb-3 block">Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                        <button onClick={() => setTheme(ThemeMode.LIGHT)} className={`h-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center ${theme === ThemeMode.LIGHT ? 'ring-2 ring-primary-500' : ''}`}>
                            <span className="text-gray-900 font-serif">Aa</span>
                        </button>
                        <button onClick={() => setTheme(ThemeMode.SEPIA)} className={`h-12 rounded-lg bg-[#f4ecd8] border border-[#eaddc5] flex items-center justify-center ${theme === ThemeMode.SEPIA ? 'ring-2 ring-primary-500' : ''}`}>
                             <span className="text-[#5b4636] font-serif">Aa</span>
                        </button>
                        <button onClick={() => setTheme(ThemeMode.DARK)} className={`h-12 rounded-lg bg-[#16161a] border border-gray-700 flex items-center justify-center ${theme === ThemeMode.DARK ? 'ring-2 ring-primary-500' : ''}`}>
                             <span className="text-gray-300 font-serif">Aa</span>
                        </button>
                    </div>
                </div>
                
                <div>
                    <div className="flex justify-between mb-2">
                        <label className="text-xs font-bold opacity-50 uppercase block">Font Size</label>
                        <span className="text-xs opacity-70">{fontSize}px</span>
                    </div>
                    <input 
                        type="range" 
                        min="16" 
                        max="32" 
                        step="2"
                        value={fontSize} 
                        onChange={(e) => setFontSize(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                    <div className="flex justify-between mt-2 text-xs opacity-50 font-serif">
                        <span>Small</span>
                        <span>Large</span>
                    </div>
                </div>
             </div>
        )}
      </div>
    </div>
  );
};
