
import React, { useState } from 'react';
import { Story } from '../types';
import { BookOpen, Bookmark, Clock, MoreVertical, Edit, Trash2 } from 'lucide-react';

interface LibraryProps {
  myStories: Story[];
  savedStories: Story[];
  onSelectStory: (story: Story) => void;
  onEditStory: (story: Story) => void;
  onDeleteStory: (id: string) => void;
}

export const Library: React.FC<LibraryProps> = ({ myStories, savedStories, onSelectStory, onEditStory, onDeleteStory }) => {
  const [activeTab, setActiveTab] = useState<'my_stories' | 'saved'>('my_stories');

  const displayedStories = activeTab === 'my_stories' ? myStories : savedStories;

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      e.preventDefault();
      if (window.confirm("Are you sure you want to delete this story? This action cannot be undone.")) {
          onDeleteStory(id);
      }
  };

  const handleEditClick = (e: React.MouseEvent, story: Story) => {
      e.stopPropagation();
      e.preventDefault();
      onEditStory(story);
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
          <div>
            <h1 className="text-4xl font-serif font-bold text-indigo-950 mb-2">My Library</h1>
            <p className="text-slate-500 text-lg">Your personal collection of dreams and drafts.</p>
          </div>
          
          <div className="flex bg-white p-1.5 rounded-full border border-slate-200 shadow-sm">
            <button 
              onClick={() => setActiveTab('my_stories')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === 'my_stories' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-slate-500 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              My Stories
            </button>
            <button 
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                activeTab === 'saved' 
                  ? 'bg-purple-600 text-white shadow-md' 
                  : 'text-slate-500 hover:text-purple-600 hover:bg-purple-50'
              }`}
            >
              Saved Stories
            </button>
          </div>
        </div>

        {/* Content */}
        {displayedStories.length === 0 ? (
           <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-200 border-dashed">
              <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6">
                  {activeTab === 'my_stories' ? <BookOpen className="w-8 h-8 text-slate-400"/> : <Bookmark className="w-8 h-8 text-slate-400"/>}
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2 font-serif">
                  {activeTab === 'my_stories' ? 'No stories written yet' : 'No saved stories'}
              </h3>
              <p className="text-slate-500 max-w-sm text-center">
                  {activeTab === 'my_stories' 
                    ? 'Start your journey as an author by creating your first story.' 
                    : 'Browse our collection and save stories to read them here.'}
              </p>
           </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayedStories.map(story => (
              <div key={story.id} className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-purple-100/50 transition-all flex flex-col hover:-translate-y-1">
                <div className="relative aspect-[2/3] overflow-hidden bg-slate-100">
                   {/* Clickable Image Layer */}
                   <img 
                      src={story.coverUrl} 
                      alt={story.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer" 
                      onClick={() => onSelectStory(story)}
                   />
                   
                   {/* Actions Overlay - pointer-events-none allows clicks to pass through to image where buttons aren't present */}
                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 z-10 pointer-events-none">
                      {/* Re-enable pointer events for the button container */}
                      <div className="pointer-events-auto w-full">
                        {activeTab === 'my_stories' ? (
                            <div className="flex gap-2">
                                <button 
                                    onClick={(e) => handleEditClick(e, story)}
                                    className="flex-1 py-3 bg-white text-indigo-900 font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg hover:bg-indigo-50 active:scale-95 transition-transform"
                                >
                                    <Edit className="w-4 h-4" /> Edit
                                </button>
                                <button 
                                    onClick={(e) => handleDeleteClick(e, story.id)}
                                    className="px-4 py-3 bg-red-100 text-red-600 font-bold rounded-xl text-sm flex items-center justify-center shadow-lg hover:bg-red-200 active:scale-95 transition-transform"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => onSelectStory(story)}
                                className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl text-sm shadow-lg hover:bg-purple-700 active:scale-95 transition-transform"
                            >
                                Continue Reading
                            </button>
                        )}
                      </div>
                   </div>
                </div>
                
                <div className="p-5 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold font-serif text-slate-900 line-clamp-1 cursor-pointer hover:text-purple-600" onClick={() => onSelectStory(story)}>{story.title}</h3>
                        {activeTab === 'my_stories' && (
                             <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-4 h-4" /></button>
                        )}
                    </div>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">{story.summary}</p>
                    
                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400 font-medium">
                        <div className="flex items-center gap-1">
                             <Clock className="w-3 h-3" />
                             <span>Updated recently</span>
                        </div>
                        <div className="flex items-center gap-1">
                             <span className={`w-2 h-2 rounded-full ${story.completed ? 'bg-green-400' : 'bg-amber-400'}`}></span>
                             <span>{story.completed ? 'Completed' : 'Ongoing'}</span>
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
