
import React, { useState } from 'react';
import { View } from '../types';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
  onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin123') {
      onLogin();
    } else {
      setError('Invalid admin credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <div className="flex justify-between items-center mb-8">
            <button onClick={onBack} className="text-slate-400 hover:text-slate-600 transition-colors">
                <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="w-5"></div> {/* Spacer */}
        </div>
        
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2 font-serif">CMS Login</h2>
        <p className="text-center text-slate-500 mb-6 text-sm">Enter administrator credentials to edit site content.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Username</label>
            <input 
              type="text" 
              className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
              value={username}
              onChange={(e) => {
                  setUsername(e.target.value);
                  setError('');
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none"
              value={password}
              onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
              }}
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

          <button 
            type="submit" 
            className="w-full py-3 mt-2 rounded-lg bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors shadow-lg"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};
