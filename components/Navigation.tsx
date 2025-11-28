
import React from 'react';
import { View, User } from '../types';
import { BookOpen, Search, LogOut } from 'lucide-react';

interface NavigationProps {
  currentView: View;
  setView: (view: View) => void;
  user: User | null;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView, user, onLogout }) => {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-indigo-100 bg-white/70 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center cursor-pointer gap-2" onClick={() => setView(View.LANDING)}>
            <div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-2 rounded-xl shadow-lg shadow-purple-200">
              <BookOpen className="text-white h-5 w-5" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 font-serif">
              StoryWeave
            </span>
          </div>

          {/* Center Nav */}
          <div className="hidden md:flex space-x-1">
            <button 
              onClick={() => setView(View.BROWSE)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${currentView === View.BROWSE ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'}`}
            >
              Browse
            </button>
            {user && (
               <button 
               onClick={() => setView(View.LIBRARY)}
               className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${currentView === View.LIBRARY ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'}`}
             >
               Library
             </button>
            )}
            <button 
              onClick={() => user ? setView(View.AUTHOR_DASHBOARD) : setView(View.AUTH)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${currentView === View.AUTHOR_DASHBOARD || currentView === View.EDITOR ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-50'}`}
            >
              Write
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Search className="h-5 w-5" />
            </button>
            
            {user ? (
              <div className="flex items-center space-x-3">
                 <button 
                  onClick={() => setView(View.PROFILE)}
                  className="flex items-center space-x-2 pl-1 pr-3 py-1 rounded-full border border-indigo-100 bg-white hover:shadow-md transition-all group"
                >
                  <img src={user.avatar} alt="User" className="h-8 w-8 rounded-full border border-indigo-100" />
                  <span className="text-sm font-medium text-slate-600 group-hover:text-indigo-600">{user.name}</span>
                </button>
                <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-400 transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setView(View.AUTH)}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-sm font-medium transition-all shadow-lg shadow-indigo-200"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
