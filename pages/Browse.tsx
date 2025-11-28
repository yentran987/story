import React, { useState, useMemo } from 'react';
import { Story } from '../types';
import { Search, Filter, Star, Clock, LayoutGrid, List as ListIcon, Check, ChevronDown } from 'lucide-react';

interface BrowseProps {
  stories: Story[];
  onSelectStory: (story: Story) => void;
}

export const Browse: React.FC<BrowseProps> = ({ stories, onSelectStory }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('Popularity');

  // Extract unique genres and tags from stories for the sidebar
  const allGenres = Array.from(new Set(stories.map(s => s.genre))).sort();
  const allTags = Array.from(new Set(stories.flatMap(s => s.tags))).sort();

  // Filter Logic
  const filteredStories = useMemo(() => {
    return stories.filter(s => {
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            s.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesGenre = selectedGenres.length === 0 || selectedGenres.includes(s.genre);
      
      // Check if story has at least one of the selected tags (if any tags are selected)
      const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => s.tags.includes(tag));

      return matchesSearch && matchesGenre && matchesTags;
    }).sort((a, b) => {
        if (sortBy === 'Popularity') return b.views - a.views;
        if (sortBy === 'Rating') return b.rating - a.rating;
        if (sortBy === 'Newest') return parseInt(b.id) - parseInt(a.id); // Mock sort by ID as proxy for date
        return 0;
    });
  }, [stories, searchQuery, selectedGenres, selectedTags, sortBy]);

  const toggleGenre = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) ? prev.filter(g => g !== genre) : [...prev, genre]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="flex h-[calc(100vh-65px)] bg-slate-50 font-sans">
      
      {/* Sidebar Filters */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-slate-200 bg-white overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center gap-2 mb-8">
            <Filter className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-serif font-bold text-indigo-950">Filters</h2>
          </div>

          {/* Genre Section */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Genre</h3>
            <div className="space-y-3">
              {allGenres.map(genre => (
                <label key={genre} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedGenres.includes(genre) ? 'bg-purple-600 border-purple-600' : 'border-slate-300 group-hover:border-purple-400 bg-white'}`}>
                    {selectedGenres.includes(genre) && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={selectedGenres.includes(genre)}
                    onChange={() => toggleGenre(genre)}
                  />
                  <span className={`text-sm font-medium transition-colors ${selectedGenres.includes(genre) ? 'text-purple-700' : 'text-slate-600 group-hover:text-slate-900'}`}>
                    {genre}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags Section */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Tags</h3>
            <div className="relative mb-4">
               <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search tags..." 
                 className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-300 transition-all"
               />
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
              {allTags.map(tag => (
                <label key={tag} className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${selectedTags.includes(tag) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 group-hover:border-indigo-400 bg-white'}`}>
                    {selectedTags.includes(tag) && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <input 
                    type="checkbox" 
                    className="hidden" 
                    checked={selectedTags.includes(tag)}
                    onChange={() => toggleTag(tag)}
                  />
                  <span className={`text-sm font-medium transition-colors ${selectedTags.includes(tag) ? 'text-indigo-700' : 'text-slate-600 group-hover:text-slate-900'}`}>
                    {tag}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-100">
            <button 
                onClick={() => { setSelectedGenres([]); setSelectedTags([]); setSearchQuery(''); }}
                className="w-full py-3 bg-indigo-50 text-indigo-600 font-bold rounded-xl text-sm hover:bg-indigo-100 transition-colors"
            >
                Reset All Filters
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white border-b border-slate-200 shadow-sm z-10">
           {/* Search */}
           <div className="relative w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl leading-5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                placeholder="Search stories, authors, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>

           {/* Controls */}
           <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative group">
                  <button className="flex items-center justify-between gap-2 min-w-[140px] px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-white hover:border-purple-200 transition-all">
                      <span>{sortBy}</span>
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                  </button>
                  {/* Dropdown would go here - simplified for this view */}
                  <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-slate-100 rounded-xl shadow-xl p-1 hidden group-hover:block z-20">
                      {['Popularity', 'Rating', 'Newest'].map(opt => (
                          <button 
                            key={opt}
                            onClick={() => setSortBy(opt)}
                            className={`w-full text-left px-4 py-2 text-sm rounded-lg ${sortBy === opt ? 'bg-purple-50 text-purple-700 font-bold' : 'text-slate-600 hover:bg-slate-50'}`}
                          >
                              {opt}
                          </button>
                      ))}
                  </div>
              </div>

              <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-200">
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                      <ListIcon className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                      <LayoutGrid className="w-5 h-5" />
                  </button>
              </div>
           </div>
        </div>

        {/* Story Grid */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
            {filteredStories.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <Search className="w-12 h-12 mb-4 opacity-20" />
                    <p className="text-lg font-medium">No stories found matching your criteria.</p>
                    <button onClick={() => {setSearchQuery(''); setSelectedGenres([]); setSelectedTags([])}} className="mt-2 text-purple-600 hover:underline">Clear all filters</button>
                </div>
            ) : (
                <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5' : 'grid-cols-1'}`}>
                    {filteredStories.map((story) => (
                    <div 
                        key={story.id} 
                        onClick={() => onSelectStory(story)}
                        className={`group relative bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-purple-100 transition-all duration-300 cursor-pointer hover:-translate-y-1 ${viewMode === 'list' ? 'flex flex-row h-48' : 'flex flex-col'}`}
                    >
                        <div className={`relative overflow-hidden bg-slate-100 ${viewMode === 'list' ? 'w-32 flex-shrink-0' : 'aspect-[2/3] w-full'}`}>
                        <img 
                            src={story.coverUrl} 
                            alt={story.title} 
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {viewMode === 'grid' && (
                            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold text-indigo-900 border border-white shadow-sm uppercase tracking-wider">
                                {story.genre}
                            </div>
                        )}
                        </div>
                        
                        <div className="p-5 flex flex-col flex-1 min-w-0">
                            {viewMode === 'list' && (
                                <div className="mb-2">
                                    <span className="px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wider border border-purple-100">
                                        {story.genre}
                                    </span>
                                </div>
                            )}
                            
                            <h3 className="text-lg font-bold font-serif text-slate-900 mb-1 line-clamp-1 group-hover:text-purple-600 transition-colors">{story.title}</h3>
                            <p className="text-sm text-slate-500 mb-3 font-medium">by <span className="text-indigo-600">{story.author}</span></p>
                            
                            {viewMode === 'list' && (
                                <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-1">{story.summary}</p>
                            )}

                            <div className={`flex flex-wrap gap-1 mb-4 ${viewMode === 'list' ? 'hidden sm:flex' : ''}`}>
                                {story.tags.slice(0, 3).map(tag => (
                                <span key={tag} className="text-[10px] px-2 py-1 rounded-md bg-slate-50 text-slate-500 border border-slate-100 group-hover:border-purple-100 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors">
                                    #{tag}
                                </span>
                                ))}
                            </div>

                            <div className="mt-auto flex items-center justify-between text-xs text-slate-400 border-t border-slate-50 pt-3">
                                <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                                <span className="font-bold text-slate-700">{story.rating}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1" title="Views">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
                                        <span>{story.views > 1000 ? (story.views/1000).toFixed(1) + 'k' : story.views}</span>
                                    </div>
                                    <div className="flex items-center gap-1" title="Chapters">
                                        <Clock className="w-3 h-3" />
                                        <span>{story.chapters.length} ch</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};