import React, { useState } from 'react';
import { View, Story } from '../types';
import { Search, Filter, Star, Clock } from 'lucide-react';

interface BrowseProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
}

export const Browse: React.FC<BrowseProps> = ({ stories, onSelectStory }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = ['All', 'Fantasy', 'Sci-Fi', 'Romance', 'Mystery', 'Horror'];

  const filteredStories = stories.filter(s => {
    const matchesFilter = activeFilter === 'All' || s.genre === activeFilter;
    const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-serif font-bold text-indigo-950 mb-3">Explore Dreams</h2>
          <p className="text-slate-500 text-lg">Find your next adventure among thousands of worlds.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-full leading-5 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 shadow-sm transition-all"
            placeholder="Search by title, author, or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide">
        <div className="p-2 rounded-full bg-white border border-slate-200 text-slate-400 shadow-sm">
            <Filter className="w-5 h-5" />
        </div>
        {filters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all shadow-sm ${
              activeFilter === filter 
                ? 'bg-purple-600 text-white shadow-purple-200' 
                : 'bg-white text-slate-500 hover:text-purple-600 border border-slate-200 hover:border-purple-200'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredStories.map((story) => (
          <div 
            key={story.id} 
            onClick={() => onSelectStory(story)}
            className="group relative flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-purple-100 transition-all duration-300 cursor-pointer hover:-translate-y-1"
          >
            <div className="aspect-[2/3] w-full overflow-hidden bg-slate-100 relative">
              <img 
                src={story.coverUrl} 
                alt={story.title} 
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-xs font-bold text-indigo-900 border border-white shadow-sm">
                {story.genre}
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-lg font-bold font-serif text-slate-900 mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors">{story.title}</h3>
              <p className="text-sm text-slate-500 mb-3 font-medium">by {story.author}</p>
              
              <div className="flex flex-wrap gap-1 mb-4">
                {story.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] px-2 py-1 rounded-md bg-slate-50 text-slate-500 border border-slate-100">
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between text-xs text-slate-400 border-t border-slate-100 pt-3">
                <div className="flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span className="font-medium text-slate-600">{story.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{story.chapters.length} ch</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};