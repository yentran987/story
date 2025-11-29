
import React from 'react';
import { Story } from '../types';
import { Play, Bookmark, Share2, Star, Clock, List, ChevronRight, Check } from 'lucide-react';

interface StoryDetailProps {
  story: Story;
  onStartReading: (chapterIndex?: number) => void;
  onBack: () => void;
  onToggleLibrary: (story: Story) => void;
  isSaved: boolean;
}

export const StoryDetail: React.FC<StoryDetailProps> = ({ story, onStartReading, onBack, onToggleLibrary, isSaved }) => {
  return (
    <div className="min-h-screen pb-20 font-sans">
      {/* Hero / Header with Dreamy Gradient Overlay */}
      <div className="relative h-[28rem] w-full overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-2xl opacity-50 scale-110" 
          style={{ backgroundImage: `url(${story.coverUrl})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8fafc] via-white/40 to-indigo-100/50"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 h-full flex items-start pt-8">
            <button onClick={onBack} className="px-5 py-2.5 bg-white/80 backdrop-blur-md rounded-full text-slate-700 font-bold hover:bg-white transition-colors shadow-sm border border-white/50 z-20">
                ← Back
            </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-64 relative z-10">
        <div className="flex flex-col md:flex-row gap-10">
          {/* Cover Image */}
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <img 
              src={story.coverUrl} 
              alt={story.title} 
              className="w-72 h-[28rem] object-cover rounded-2xl shadow-2xl shadow-indigo-200/50 border-4 border-white"
            />
          </div>

          {/* Details */}
          <div className="flex-1 pt-4 md:pt-16 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
               <span className="px-4 py-1.5 rounded-full bg-white/60 backdrop-blur-md text-indigo-900 text-sm font-bold border border-white shadow-sm">
                 {story.genre}
               </span>
               {story.completed && (
                 <span className="px-4 py-1.5 rounded-full bg-green-100/80 backdrop-blur-md text-green-700 text-sm font-bold border border-white shadow-sm">
                   Completed
                 </span>
               )}
            </div>

            <h1 className="text-4xl md:text-6xl font-serif font-black text-indigo-950 mb-3 drop-shadow-sm leading-tight">{story.title}</h1>
            <p className="text-xl text-slate-600 mb-8 font-medium">by <span className="text-indigo-600">{story.author}</span></p>

            <div className="flex items-center justify-center md:justify-start gap-8 text-sm text-slate-500 mb-10">
                <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-1 mb-1">
                         <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                         <span className="text-slate-800 font-bold text-xl">{story.rating}</span>
                    </div>
                    <span className="text-xs uppercase tracking-wider font-bold opacity-60">Rating</span>
                </div>
                <div className="w-px h-10 bg-slate-300/50"></div>
                <div className="flex flex-col items-center md:items-start">
                    <div className="flex items-center gap-1 mb-1">
                        <Clock className="w-5 h-5 text-purple-400" />
                        <span className="text-slate-800 font-bold text-xl">{story.chapters.length}</span>
                    </div>
                    <span className="text-xs uppercase tracking-wider font-bold opacity-60">Chapters</span>
                </div>
                <div className="w-px h-10 bg-slate-300/50"></div>
                <div className="flex flex-col items-center md:items-start">
                     <div className="text-slate-800 font-bold text-xl mb-1">{story.views.toLocaleString()}</div>
                     <span className="text-xs uppercase tracking-wider font-bold opacity-60">Reads</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-10">
                <button 
                  onClick={() => onStartReading()}
                  className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold flex items-center gap-2 transition-all shadow-xl hover:-translate-y-1"
                >
                    <Play className="w-5 h-5 fill-current" />
                    Read Now
                </button>
                <button 
                    onClick={() => onToggleLibrary(story)}
                    className={`px-6 py-4 border rounded-full font-bold flex items-center gap-2 transition-all shadow-sm ${
                        isSaved 
                        ? 'bg-purple-100 border-purple-200 text-purple-700' 
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                    {isSaved ? <Check className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
                    {isSaved ? 'Saved' : 'Library'}
                </button>
                <button className="p-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-full transition-all shadow-sm">
                    <Share2 className="w-5 h-5" />
                </button>
            </div>
            
            <div className="mb-10 bg-white p-8 rounded-3xl shadow-xl shadow-indigo-100/50 border border-white">
                <h3 className="text-lg font-bold text-indigo-950 mb-4 font-serif">Synopsis</h3>
                <p className="text-slate-600 leading-loose text-lg text-justify font-serif">
                    {story.summary}
                </p>
            </div>

            {/* Tags */}
            <div className="mb-16">
                 <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {story.tags.map(tag => (
                        <span key={tag} className="text-sm text-slate-500 font-medium px-4 py-2 rounded-lg bg-slate-100 hover:bg-purple-100 hover:text-purple-600 cursor-pointer transition-colors">
                            #{tag}
                        </span>
                    ))}
                 </div>
            </div>

          </div>
        </div>

        {/* Chapters List */}
        <div className="mt-8 border-t border-indigo-100 pt-12">
            <h3 className="text-3xl font-bold font-serif text-indigo-950 mb-8 flex items-center gap-3">
                <List className="w-7 h-7 text-purple-500" />
                Table of Contents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {story.chapters.map((chapter, i) => (
                    <div 
                        key={chapter.id}
                        onClick={() => onStartReading(i)} 
                        className="group flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl cursor-pointer hover:border-purple-200 hover:shadow-lg hover:shadow-purple-100/50 transition-all"
                    >
                        <div>
                            <span className="text-xs font-bold text-purple-400 uppercase mb-1 block">Chapter {i + 1}</span>
                            <h4 className="font-bold text-slate-800 group-hover:text-purple-700 transition-colors line-clamp-1 font-serif">
                                {chapter.title}
                            </h4>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-purple-50 transition-colors">
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500" />
                        </div>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </div>
  );
};
