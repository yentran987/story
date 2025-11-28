import React, { useState } from 'react';
import { View, User } from '../types';
import { BookOpen } from 'lucide-react';

interface AuthProps {
  onLogin: (user: User) => void;
  setView: (view: View) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, setView }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login with form data
    const mockUser: User = {
      id: Date.now().toString(),
      name: name || 'Dreamer',
      avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${name || 'Dreamer'}`,
      isAuthor: true
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
       {/* Background Elements */}
       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-50 to-pink-50 z-0"></div>
       <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] animate-float"></div>
       <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-200/40 rounded-full blur-[100px] animate-float" style={{animationDelay: '2s'}}></div>

      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white/80 backdrop-blur-xl border border-white shadow-2xl shadow-indigo-100/50 z-10">
        <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-purple-200">
                <BookOpen className="text-white w-8 h-8" />
            </div>
            <h2 className="text-3xl font-serif font-black text-indigo-950 mb-2">
            {isLogin ? 'Welcome Back' : 'Join StoryWeave'}
            </h2>
            <p className="text-slate-500">
            {isLogin ? 'Sign in to return to your world' : 'Begin your creative journey today'}
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
             <div>
               <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Username</label>
               <input 
                 type="text" 
                 className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all" 
                 value={name}
                 onChange={(e) => setName(e.target.value)}
                 required
               />
             </div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
            <input type="email" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all" defaultValue="alex@example.com" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <input type="password" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all" defaultValue="password" />
          </div>

          <button type="submit" className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg transition-all shadow-xl hover:-translate-y-1">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-slate-500 hover:text-purple-600 font-medium transition-colors"
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
          </button>
        </div>
        
        <div className="mt-6 text-center">
             <button onClick={() => setView(View.LANDING)} className="text-xs text-slate-400 hover:text-slate-600 font-bold uppercase tracking-widest">
                 Back to Home
             </button>
        </div>
      </div>
    </div>
  );
};