
import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, Loader2, Lock, Mail, UserPlus, LogIn } from 'lucide-react';
import { supabase } from '../services/supabase';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [isRegister, setIsRegister] = useState(false);
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
      if (isRegister) {
        // Sign Up
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: 'admin', // Metadata to identify admin users
            },
          },
        });

        if (error) throw error;

        if (data.user && !data.session) {
          setMessage("Registration successful! Please check your email for the confirmation link.");
        } else if (data.user && data.session) {
          onLogin();
        }
      } else {
        // Login
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        onLogin();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
      
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100 relative z-10">
        <div className="flex justify-between items-center mb-8">
            <button 
              onClick={onBack} 
              className="text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 text-sm font-medium"
            >
                <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">CMS Portal</span>
                <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
                    <ShieldCheck className="w-4 h-4" />
                </div>
            </div>
        </div>
        
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-2 font-serif">
              {isRegister ? 'Admin Registration' : 'Admin Login'}
            </h2>
            <p className="text-slate-500 text-sm">
              {isRegister ? 'Create a new administrator account.' : 'Authenticate to manage platform content.'}
            </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
                <input 
                type="email" 
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@storyweave.ai"
                required
                />
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
                <input 
                type="password" 
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                />
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            </div>
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

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegister ? <UserPlus className="w-5 h-5"/> : <LogIn className="w-5 h-5"/>)}
            {isRegister ? 'Register Admin' : 'Access Dashboard'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <button 
                onClick={() => {
                    setIsRegister(!isRegister);
                    setError('');
                    setMessage('');
                }}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
            >
                {isRegister ? 'Already have an admin ID? Login' : 'Need to register a new admin? Sign Up'}
            </button>
        </div>
      </div>
    </div>
  );
};
