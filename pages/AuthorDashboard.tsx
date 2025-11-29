
import React from 'react';
import { Story } from '../types';
import { Plus, FolderOpen, Clock, FileText } from 'lucide-react';

interface AuthorDashboardProps {
  stories: Story[];
  onCreateStory: () => void;
  onEditStory: (story: Story) => void;
}

export const AuthorDashboard: React.FC<AuthorDashboardProps> = ({ stories, onCreateStory, onEditStory }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-bold font-serif text-indigo-950 mb-2">Your Stories</h1>
            <p className="text-slate-500 text-lg">Manage your drafts and published works</p>
          </div>
          <button 
            onClick={onCreateStory}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-purple-200 active:scale-95 hover:-translate-y-0.5"
          >
            <Plus className="w-5 h-5" />
            Create New Story
          </button>
        </div>

        {/* In Progress Section */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-indigo-900 mb-4 font-bold text-lg">
            <FolderOpen className="w-5 h-5 text-purple-500" />
            <span>In Progress</span>
          </div>

          {stories.length === 0 ? (
            <div className="border border-dashed border-slate-300 rounded-2xl p-16 text-center bg-white/50">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <FileText className="w-8 h-8" />
                </div>
                <p className="text-slate-500 mb-4 text-lg">You haven't started any stories yet.</p>
                <button onClick={onCreateStory} className="text-purple-600 hover:text-purple-700 font-bold hover:underline">Start writing your first masterpiece</button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {stories.map((story) => (
                <div 
                  key={story.id} 
                  className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition-all hover:border-purple-200"
                >
                  <div className="flex flex-col gap-1">
                    <h3 className="text-xl font-bold text-indigo-950 font-serif">{story.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-500">
                      <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">{story.genre}</span>
                      <span>•</span>
                      <span>{story.chapters.length} chapters</span>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Edited recently</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => onEditStory(story)}
                    className="w-full sm:w-auto px-6 py-2.5 bg-white border border-slate-200 hover:border-purple-300 hover:text-purple-700 text-slate-600 font-bold rounded-xl transition-all shadow-sm active:scale-95"
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
