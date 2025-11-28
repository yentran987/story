
import React from 'react';
import { Story } from '../types';
import { Plus, FolderOpen } from 'lucide-react';

interface AuthorDashboardProps {
  stories: Story[];
  onCreateStory: () => void;
  onEditStory: (story: Story) => void;
}

export const AuthorDashboard: React.FC<AuthorDashboardProps> = ({ stories, onCreateStory, onEditStory }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif text-white mb-2">Your Stories</h1>
            <p className="text-slate-400">Manage your drafts and published works</p>
          </div>
          <button 
            onClick={onCreateStory}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-purple-500/20 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Create New Story
          </button>
        </div>

        {/* In Progress Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-slate-300 mb-4 font-bold text-lg">
            <FolderOpen className="w-5 h-5" />
            <span>In Progress</span>
          </div>

          {stories.length === 0 ? (
            <div className="border border-slate-800 rounded-xl p-12 text-center bg-slate-900/50">
                <p className="text-slate-500 mb-4">You haven't started any stories yet.</p>
                <button onClick={onCreateStory} className="text-purple-400 hover:text-purple-300 font-bold hover:underline">Start writing your first masterpiece</button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {stories.map((story) => (
                <div 
                  key={story.id} 
                  className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-700 transition-colors"
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold text-white font-serif">{story.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span className="text-purple-400 font-medium">{story.genre}</span>
                      <span>•</span>
                      <span>{story.chapters.length} chapters</span>
                      <span>•</span>
                      <span>Edited recently</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => onEditStory(story)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors shadow-md"
                  >
                    Continue Editing
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
