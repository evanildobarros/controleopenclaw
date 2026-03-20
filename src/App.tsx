import { Activity, Lock, LogOut, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAgents } from '../hooks/useAgents';
import { Home } from './pages/Home';
import { AgentDashboard } from './pages/AgentDashboard';

const FIXED_UID = 'evanildo_admin_001';
const CREDENTIALS = {
  username: 'evanildobarros',
  password: 'jedai2003'
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
      if (typeof window !== 'undefined') {
          return localStorage.getItem('openclaw_auth') === 'true';
      }
      return false;
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const { agents, loading: agentsLoading } = useAgents(isLoggedIn ? FIXED_UID : undefined);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      setIsLoggedIn(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('openclaw_auth', 'true');
      }
      setLoginError('');
    } else {
      setLoginError('Usuário ou senha incorretos.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    if (typeof window !== 'undefined') {
        localStorage.removeItem('openclaw_auth');
    }
    setUsername('');
    setPassword('');
  };

  if (!isLoggedIn) {
     return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4 font-sans">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl border border-gray-700 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-center text-white">OpenClaw Controller</h1>
          <p className="text-gray-400 mb-8 text-center">Acesse com suas credenciais de administrador.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Usuário</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all"
                  placeholder="Seu usuário"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all"
                  placeholder="Sua senha"
                  required
                />
              </div>
            </div>
            {loginError && <p className="text-red-500 text-xs text-center">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-emerald-500 text-gray-900 font-bold py-3 px-4 rounded-xl hover:bg-emerald-400 transition-colors mt-4"
            >
              Entrar no Sistema
            </button>
          </form>
        </div>
      </div>
     )
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white font-sans selection:bg-emerald-500/30">
        <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-md sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                <Activity className="w-5 h-5 text-emerald-500" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">OpenClaw</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <div className="w-8 h-8 rounded-full border border-gray-700 bg-gray-800 overflow-hidden">
                  <img src="/avatars/perfil.png" alt="Perfil" className="w-full h-full object-cover text-[10px]" />
                </div>
                <span className="hidden sm:inline font-mono">evanildobarros</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <main>
          <Routes>
            <Route path="/" element={<Home agents={agents} agentsLoading={agentsLoading} />} />
            <Route path="/agent/:agentId" element={<AgentDashboard agents={agents} fixedUid={FIXED_UID} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
