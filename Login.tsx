
import React, { useState } from 'react';
import { Lock, User, ShieldCheck, ChevronRight } from 'lucide-react';

interface LoginProps {
  onSuccess: () => void;
}

const Login: React.FC<LoginProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Credentials: admin / password123
    setTimeout(() => {
      const userLower = username.trim().toLowerCase();
      const passTrimmed = password.trim();

      if (userLower === 'admin' && passTrimmed === 'password123') {
        localStorage.setItem('krv_auth', 'true');
        onSuccess();
      } else {
        setError('Invalid login details.');
        setIsLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 relative overflow-hidden font-sans">
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-red-100 blur-[150px] rounded-full opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-200 blur-[120px] rounded-full opacity-50"></div>
      
      <div className="w-full max-w-md p-6 relative z-10">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl p-10 md:p-14">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-200 mb-6 rotate-3">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase text-center leading-none">
              KRV Studio
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-3">Identity Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-black font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-600 transition-all"
                  placeholder="System ID"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Access Key</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400 group-focus-within:text-red-500 transition-colors" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-black font-bold placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-600 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 text-[10px] font-bold uppercase text-center animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-5 rounded-2xl shadow-xl shadow-red-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  AUTHORIZE ACCESS
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-100 text-center">
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest leading-relaxed">
              Karnataka Rakshana Vedike<br/>
              Internal Portal © 2024
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
