
import React from 'react';
import { View, Story, LandingPageContent, User } from '../types';
import { Edit, Play, BookOpen, Sparkles, Settings } from 'lucide-react';

interface LandingProps {
  setView: (view: View) => void;
  onSelectStory: (story: Story) => void;
  trendingStories: Story[];
  content: LandingPageContent;
  user?: User | null;
}

export const Landing: React.FC<LandingProps> = ({ setView, onSelectStory, trendingStories, content, user }) => {
  const { hero, stats, trending, features, cta } = content;

  return (
    <div className="flex flex-col min-h-screen text-slate-800 font-sans">
      
      {/* Hero Section */}
      <section className="relative w-full">
        <div className="relative flex min-h-[70vh] flex-col gap-6 rounded-b-[3rem] bg-cover bg-center bg-no-repeat items-center justify-center p-6 text-center shadow-2xl shadow-indigo-100" 
             style={{backgroundImage: `url("${hero.backgroundImage}")`}}>
          
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px] rounded-b-[3rem]"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-50/90 to-transparent rounded-b-[3rem]"></div>

          <div className="relative z-10 flex flex-col gap-4 max-w-4xl animate-float">
            <div className="mx-auto bg-white/40 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/50 text-indigo-900 text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span>{hero.badgeText}</span>
            </div>
            <h1 className="text-indigo-950 text-5xl md:text-7xl font-serif font-black leading-tight tracking-tight drop-shadow-sm">
              {hero.headlineStart} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">{hero.headlineHighlight}</span>
            </h1>
            <h2 className="text-slate-700 text-lg md:text-xl font-normal leading-relaxed max-w-2xl mx-auto">
              {hero.subheadline}
            </h2>
          </div>
          <div className="relative z-10 flex flex-wrap gap-4 justify-center mt-6">
            <button 
              onClick={() => setView(View.BROWSE)}
              className="flex min-w-[140px] items-center justify-center rounded-full h-14 px-8 bg-slate-900 hover:bg-slate-800 text-white text-lg font-semibold transition-transform hover:-translate-y-1 shadow-xl shadow-slate-200"
            >
              {hero.buttonRead}
            </button>
            <button 
              onClick={() => setView(View.EDITOR)}
              className="flex min-w-[140px] items-center justify-center rounded-full h-14 px-8 bg-white hover:bg-indigo-50 text-indigo-900 text-lg font-semibold transition-transform hover:-translate-y-1 shadow-xl shadow-white/50 border border-indigo-100"
            >
              {hero.buttonWrite}
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="flex flex-wrap gap-6 px-4 sm:px-10 -mt-12 relative z-20 max-w-7xl mx-auto w-full">
        <div className="flex min-w-[158px] flex-1 flex-col gap-1 rounded-2xl p-8 border border-white/60 bg-white/80 backdrop-blur-md shadow-xl shadow-indigo-100/50 text-center">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stats.label1}</p>
          <p className="text-indigo-900 text-4xl font-serif font-black">{stats.value1}</p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-1 rounded-2xl p-8 border border-white/60 bg-white/80 backdrop-blur-md shadow-xl shadow-indigo-100/50 text-center">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stats.label2}</p>
          <p className="text-indigo-900 text-4xl font-serif font-black">{stats.value2}</p>
        </div>
        <div className="flex min-w-[158px] flex-1 flex-col gap-1 rounded-2xl p-8 border border-white/60 bg-white/80 backdrop-blur-md shadow-xl shadow-indigo-100/50 text-center">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider">{stats.label3}</p>
          <p className="text-indigo-900 text-4xl font-serif font-black">{stats.value3}</p>
        </div>
      </section>

      {/* Trending Stories */}
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-10 py-24">
        <h2 className="text-indigo-950 text-4xl font-serif font-bold mb-12 text-center">{trending.title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {trendingStories.slice(0, 4).map((story) => (
            <div key={story.id} className="flex flex-col gap-4 group cursor-pointer" onClick={() => onSelectStory(story)}>
              <div 
                className="w-full bg-center bg-no-repeat aspect-[2/3] bg-cover rounded-2xl overflow-hidden shadow-lg shadow-indigo-100 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-200 group-hover:-translate-y-2" 
                style={{backgroundImage: `url("${story.coverUrl}")`}}
              >
                <div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="text-center">
                <p className="text-slate-800 text-lg font-bold leading-tight truncate font-serif mb-1 group-hover:text-purple-600 transition-colors">{story.title}</p>
                <p className="text-slate-500 text-sm font-medium">By {story.author}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-full">{story.genre}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-50/50 to-white"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-10 text-center relative z-10">
            <h2 className="text-indigo-950 text-4xl font-serif font-bold mb-4">{features.title}</h2>
            <p className="text-slate-600 mb-16 max-w-2xl mx-auto text-lg">{features.subtitle}</p>
            
            <div className="grid md:grid-cols-3 gap-10">
                <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 transition-transform hover:-translate-y-1">
                    <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center text-pink-500 mb-2">
                        <Edit className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">{features.item1Title}</h3>
                    <p className="text-slate-500 leading-relaxed">{features.item1Desc}</p>
                </div>
                <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 transition-transform hover:-translate-y-1">
                    <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center text-purple-500 mb-2">
                        <BookOpen className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">{features.item2Title}</h3>
                    <p className="text-slate-500 leading-relaxed">{features.item2Desc}</p>
                </div>
                <div className="flex flex-col items-center gap-6 p-8 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 transition-transform hover:-translate-y-1">
                    <div className="w-20 h-20 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-500 mb-2">
                        <Play className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">{features.item3Title}</h3>
                    <p className="text-slate-500 leading-relaxed">{features.item3Desc}</p>
                </div>
            </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto w-full px-4 sm:px-10 py-24">
        <div className="rounded-[3rem] bg-gradient-to-r from-purple-600 to-indigo-600 p-12 md:p-20 text-center shadow-2xl shadow-purple-200 relative overflow-hidden">
            <div 
                className="absolute top-0 left-0 w-full h-full opacity-20"
                style={{backgroundImage: `url("${cta.backgroundImage}")`}}
            ></div>
            <h2 className="text-white text-3xl md:text-5xl font-serif font-bold mb-6 relative z-10">{cta.title}</h2>
            <p className="text-purple-100 max-w-xl mx-auto mb-10 text-lg relative z-10">{cta.description}</p>
            <button 
              onClick={() => setView(View.AUTH)}
              className="relative z-10 inline-flex items-center justify-center h-14 px-10 bg-white text-purple-600 font-bold rounded-full hover:bg-purple-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
                {cta.buttonText}
            </button>
        </div>
      </section>

      {/* Footer / Admin Access */}
      <footer className="w-full py-8 text-center text-slate-400 bg-slate-50 border-t border-slate-100">
        <p className="mb-2">© 2024 {content.general.logoText}. All rights reserved.</p>
        <button 
          onClick={() => setView(View.ADMIN_LOGIN)}
          className="flex items-center justify-center gap-1 mx-auto text-xs font-bold uppercase tracking-wider hover:text-purple-600 transition-colors"
        >
          <Settings className="w-3 h-3" /> Admin Access
        </button>
      </footer>

    </div>
  );
};
