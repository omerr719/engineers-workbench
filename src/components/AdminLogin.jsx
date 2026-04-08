import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, KeyRound, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      if (onLoginSuccess) onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4 font-sans text-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-dark-panel border border-gray-800 rounded-2xl p-8 glass-panel shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-electronic-blue to-neon-green"></div>
        
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-800">
            <Lock className="w-8 h-8 text-electronic-blue" />
          </div>
          <h2 className="text-2xl font-bold font-mono tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
            SYSTEM ACCESS
          </h2>
          <p className="text-gray-400 text-sm mt-2">Restricted Area - Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-400 text-sm">{error === 'Invalid login credentials' ? 'Hatalı e-posta veya şifre girdiniz.' : error}</p>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-400 text-xs font-mono mb-1.5 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/30 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-electronic-blue focus:ring-1 focus:ring-electronic-blue transition-colors"
                placeholder="admin@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-xs font-mono mb-1.5 uppercase tracking-wider">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <KeyRound className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/30 border border-gray-700 text-white rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-electronic-blue focus:ring-1 focus:ring-electronic-blue transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-electronic-blue hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin"></div>
            ) : (
              <>
                AUTHENTICATE
                <Lock className="w-4 h-4 group-hover:scale-110 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
