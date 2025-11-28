import React, { useState } from 'react';
import { User, Story } from '../types';
import { Settings, MapPin, Link as LinkIcon, Calendar, Edit2, Save, X, BookOpen, Bookmark, Trophy } from 'lucide-react';

interface ProfileProps {
  user: User;
  stories: Story[];
  savedStories: Story[];
  onUpdateUser: (updatedUser: User) => void;
  onSelectStory: (story: Story) => void;
}

export const Profile: React.FC<ProfileProps> = ({ user, stories, savedStories, onUpdateUser, onSelectStory }) => {
  const [activeTab, setActiveTab] = useState('stories');
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for editing
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState("Crafting worlds one word at a time. Coffee-fueled storyteller and lover of fantasy epics.");
  const [editLocation, setEditLocation] = useState("New York, USA");

  const handleSave = () => {
      onUpdateUser({
          ...user,
          name: editName
      });
      setIsEditing(false);
  };

  const handleCancel = () => {
      setEditName(user.name);
      setIsEditing(false);
  };

  // Filter content based on active tab
  const displayContent = activeTab === 'stories' ? stories : activeTab === 'saved' ? savedStories : [];

  return (
    <div className="min-h-screen pb-20">
      {/* Dreamy Header Background */}
      <div className="h-80 bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-100 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Sidebar Profile Card */}
          <div className="w-full md:w-80 flex-shrink-0">
             <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-xl shadow-indigo-100/50">
                <div className="relative -mt-20 mb-6 flex justify-center md:justify-start">
                    <img 
                        src={user.avatar} 
                        alt={user.name} 
                        className="w-36 h-36 rounded-full border-[6px] border-white object-cover shadow-lg"
                    />
                </div>
                
                {isEditing ? (
                    <div className="space-y-4 animate-fade-in">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Name</label>
                            <input 
                                className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Bio</label>
                            <textarea 
                                className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm"
                                rows={4}
                                value={editBio}
                                onChange={(e) => setEditBio(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Location</label>
                            <input 
                                className="w-full mt-1 p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm"
                                value={editLocation}
                                onChange={(e) => setEditLocation(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button onClick={handleSave} className="flex-1 py-2 bg-purple-600 text-white rounded-lg text-sm font-bold hover:bg-purple-700 flex items-center justify-center gap-2">
                                <Save className="w-4 h-4" /> Save
                            </button>
                            <button onClick={handleCancel} className="flex-1 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 flex items-center justify-center gap-2">
                                <X className="w-4 h-4" /> Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <h1 className="text-3xl font-serif font-black text-indigo-950 mb-1 text-center md:text-left">{user.name}</h1>
                        <p className="text-purple-600 font-medium mb-6 text-center md:text-left">@{user.name.toLowerCase().replace(/\s+/g, '')}</p>
                        
                        <p className="text-slate-600 text-sm leading-relaxed mb-6 text-center md:text-left">
                            {editBio}
                        </p>

                        <div className="space-y-3 text-sm text-slate-500 mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 rounded-full text-indigo-500"><MapPin className="w-4 h-4" /></div>
                                <span>{editLocation}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-pink-50 rounded-full text-pink-500"><LinkIcon className="w-4 h-4" /></div>
                                <a href="#" className="text-slate-600 hover:text-purple-600 transition-colors">storyweave.ai/{user.name.toLowerCase().replace(/\s+/g, '')}</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-50 rounded-full text-purple-500"><Calendar className="w-4 h-4" /></div>
                                <span>Joined March 2024</span>
                            </div>
                        </div>

                        <button 
                            onClick={() => setIsEditing(true)}
                            className="w-full py-3 rounded-xl bg-white border border-indigo-100 text-indigo-900 font-bold hover:bg-indigo-50 hover:shadow-md transition-all flex items-center justify-center gap-2"
                        >
                            <Edit2 className="w-4 h-4" /> Edit Profile
                        </button>
                    </>
                )}
             </div>

             {/* Stats */}
             <div className="mt-6 grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-white shadow-lg shadow-indigo-100/50 text-center">
                    <div className="text-2xl font-black text-indigo-900">{stories.length}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-bold">Stories</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-white shadow-lg shadow-indigo-100/50 text-center">
                    <div className="text-2xl font-black text-indigo-900">1.2k</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-bold">Followers</div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-white shadow-lg shadow-indigo-100/50 text-center">
                    <div className="text-2xl font-black text-indigo-900">{savedStories.length}</div>
                    <div className="text-xs text-slate-400 uppercase tracking-wider mt-1 font-bold">Saved</div>
                </div>
             </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 w-full pt-4 md:pt-32">
             
             {/* Tabs */}
             <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                <button 
                    onClick={() => setActiveTab('stories')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm ${activeTab === 'stories' ? 'bg-white text-purple-600 shadow-md ring-1 ring-purple-100' : 'bg-transparent text-slate-500 hover:bg-white/50'}`}
                >
                    <BookOpen className="w-4 h-4" /> My Stories <span className="ml-1 opacity-60">({stories.length})</span>
                </button>
                <button 
                    onClick={() => setActiveTab('saved')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm ${activeTab === 'saved' ? 'bg-white text-purple-600 shadow-md ring-1 ring-purple-100' : 'bg-transparent text-slate-500 hover:bg-white/50'}`}
                >
                    <Bookmark className="w-4 h-4" /> Saved Library <span className="ml-1 opacity-60">({savedStories.length})</span>
                </button>
                <button 
                    onClick={() => setActiveTab('achievements')}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm ${activeTab === 'achievements' ? 'bg-white text-purple-600 shadow-md ring-1 ring-purple-100' : 'bg-transparent text-slate-500 hover:bg-white/50'}`}
                >
                    <Trophy className="w-4 h-4" /> Achievements
                </button>
             </div>

             {/* Grid */}
             {activeTab === 'achievements' ? (
                <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-500">
                        <Trophy className="w-10 h-10" />
                    </div>
                    <h3 className="font-serif font-bold text-xl text-indigo-950 mb-2">Coming Soon</h3>
                    <p className="text-slate-500">Achievements and badges will appear here as you write and read more.</p>
                </div>
             ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayContent.map(story => (
                            <div 
                                key={story.id} 
                                onClick={() => onSelectStory(story)}
                                className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:shadow-purple-100/50 transition-all cursor-pointer hover:-translate-y-1"
                            >
                                <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
                                <img src={story.coverUrl} alt={story.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold font-serif text-slate-900 truncate group-hover:text-purple-600 transition-colors">{story.title}</h3>
                                    <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wider">{story.genre}</p>
                                    <p className="text-xs text-slate-400 mt-2">by {story.author}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {displayContent.length === 0 && (
                        <div className="text-center py-20 text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
                            <p>No stories found in this section.</p>
                        </div>
                    )}
                </>
             )}
          </div>

        </div>
      </div>
    </div>
  );
};