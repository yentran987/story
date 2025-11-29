
import React, { useState } from 'react';
import { View, User } from '../types';
import { BookOpen, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabase';

interface AuthProps {
  onLogin: (user: User) => void;
  setView: (view: View) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, setView }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      if (isLogin) {
        // Sign In
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        if (data.user) {
            const userData: User = {
                id: data.user.id,
                name: data.user.email?.split('@')[0] || 'Dreamer',
                avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${data.user.id}`,
                isAuthor: true
            };
            onLogin(userData);
        }
      } else {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        if (data.user && !data.session) {
            setMessage("Sign up successful! Please check your email for the confirmation link.");
        } else if (data.user && data.session) {
            const userData: User = {
                id: data.user.id,
                name: data.user.email?.split('@')[0] || 'Dreamer',
                avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${data.user.id}`,
                isAuthor: true
            };
            onLogin(userData);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
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
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email</label>
            <input 
                type="email" 
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <input 
                type="password" 
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 focus:outline-none transition-all" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-xs font-bold rounded-lg text-center animate-fade-in">
              {error}
            </div>
          )}

          {message && (
            <div className="p-3 bg-green-50 border border-green-100 text-green-600 text-xs font-bold rounded-lg text-center animate-fade-in">
              {message}
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg transition-all shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setMessage('');
            }}
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
