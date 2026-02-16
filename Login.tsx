
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
    
    // Admin credentials: admin / password123
    setTimeout(() => {
      if (username === 'admin' && password === 'password123') {
        localStorage.setItem('krv_auth', 'true');
        onSuccess();
      } else {
        setError('Invalid credentials. Please try again.');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-red-100 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-200 blur-[120px] rounded-full"></div>
      
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-2xl p-8 md:p-12">
          <div className="flex flex-col items-center mb-10">
            <div className="w-20 h-20 bg-red-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-red-200 mb-6 rotate-2">
              <ShieldCheck size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase text-center">
              KRV Studio <span className="text-red-600">Pro</span>
            </h1>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Management System</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-slate-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-600 transition-all"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-600 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-4 text-red-600 text-xs font-bold text-center animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl shadow-xl shadow-red-200 active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  SIGN IN
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-slate-50 text-center">
            <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest leading-relaxed">
              © 2024 KRV Pro Studio<br/>
              Enterprise Edition
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
