import { Activity, CheckCircle2, CircleDashed, Lock, LogOut, PlayCircle, Plus, User as UserIcon, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAgents } from './hooks/useAgents';
import { useTasks } from './hooks/useTasks';
// Firebase imports are kept minimal as actual logic is mocked for this context
// import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';

const FIXED_UID = 'evanildo_admin_001';
const CREDENTIALS = {
  username: 'evanildobarros',
  password: 'jedai2003'
};

// Componente para o Toggle de Tema
const ThemeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Verifica se a classe 'dark' está no HTML ao carregar
        if (typeof window !== 'undefined') {
             return document.documentElement.classList.contains('dark');
        }
        return false;
    });

    useEffect(() => {
        const updateTheme = (matches: MediaQueryListEvent) => {
            setIsDarkMode(matches.matches);
        };
        
        if (typeof window !== 'undefined') {
            // Observa as mudanças de preferência do sistema operacional
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', updateTheme);

            // Aplica a classe baseada no estado inicial ou no SO
            if (isDarkMode) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }

            return () => {
                mediaQuery.removeEventListener('change', updateTheme);
            };
        }
    }, [isDarkMode]); 

    const toggleTheme = () => {
        const newState = !isDarkMode;
        setIsDarkMode(newState);
        if (typeof window !== 'undefined') {
            if (newState) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors relative group"
            title={isDarkMode ? "Alternar para Tema Claro" : "Alternar para Tema Escuro"}
        >
            {/* Ícone de sol/lua para indicar o estado atual */}
            {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="M4.93 4.93l1.41 1.41"/><path d="M17.66 17.66l1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="M4.93 19.07l1.41-1.41"/><path d="M17.66 6.34l1.41-1.41"/></svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            )}
            
            {/* Tooltip */}
            <div className="absolute right-0 top-full mt-2 scale-0 transition-all rounded-lg bg-white/10 text-white text-xs p-1.5 group-hover:scale-100 whitespace-nowrap">
                {isDarkMode ? "Tema Claro" : "Tema Escuro"}
            </div>
        </button>
    );
};


function App() {
  // Mocks para simular o estado inicial
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
      if (typeof window !== 'undefined') {
          return localStorage.getItem('openclaw_auth') === 'true';
      }
      return false;
  });
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Mocks para simular a busca de dados do Firebase, já que não temos o serviço rodando
  const { agents, loading: agentsLoading } = useAgents(isLoggedIn ? FIXED_UID : undefined);
  const { tasks } = useTasks(isLoggedIn ? FIXED_UID : undefined);
  const [selectedAgent, setSelectedAgent] = useState<any | null>(null);
  const [taskDescription, setTaskDescription] = useState('');

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

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !selectedAgent || !taskDescription.trim()) return;

    // SIMULAÇÃO DE INTERAÇÃO COM FIREBASE (APENAS NOTIFICA O USUÁRIO)
    console.log("--- SIMULAÇÃO DE ATRIBUIÇÃO DE TAREFA ---");
    console.log(`Proprietário: ${FIXED_UID}`);
    console.log(`Agente Alvo: ${selectedAgent.name} (${selectedAgent.id})`);
    console.log(`Descrição: ${taskDescription}`);
    console.log("-------------------------------------------");
    console.log("-------------------------------------------");

    setTaskDescription('');

    setTaskDescription('');
    setSelectedAgent(null);
  };

  const completeTask = async (taskId: string, agentId: string) => {
    // SIMULAÇÃO DE INTERAÇÃO COM FIREBASE
    console.log(`--- TASK COMPLETION SIMULATION: ${taskId} ---`);
    alert(`Tarefa ${taskId} marcada como concluída (SIMULADO).`);
    // Em um ambiente real, isso faria um update no firestore
  };

  // --- RENDERIZAÇÃO DE LOGIN ---
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center text-white p-4 font-sans">
        <div className="max-w-md w-full bg-surface-dark p-8 rounded-2xl border border-white/10 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="w-8 h-8 text-emerald-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-center">OpenClaw Controller</h1>
          <p className="text-zinc-400 mb-8 text-center">Acesse com suas credenciais de administrador.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Usuário</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-primary transition-all"
                  placeholder="Seu usuário"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-primary transition-all"
                  placeholder="Sua senha"
                  required
                />
              </div>
            </div>
            {loginError && <p className="text-red-500 text-xs text-center">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-emerald-primary text-black font-bold py-3 px-4 rounded-xl hover:bg-emerald-400 transition-colors mt-4"
            >
              Entrar no Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- RENDERIZAÇÃO PRINCIPAL (LOGADO) ---
  return (
    <div className="min-h-screen bg-background-dark text-text-light font-sans selection:bg-emerald-primary/30">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#141414]/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-primary/20 rounded-lg flex items-center justify-center border border-emerald-primary/30">
              <Activity className="w-5 h-5 text-emerald-primary" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">OpenClaw</h1>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <div className="w-8 h-8 rounded-full border border-white/10 bg-emerald-primary/10 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-emerald-primary" />
              </div>
              <span className="hidden sm:inline">evanildobarros</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-zinc-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Agents Grid */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold tracking-tight">Meus Agentes</h2>
              <div className="text-sm font-mono text-zinc-500">
                {agentsLoading ? '...' : `${agents.length} ONLINE`}
              </div>
            </div>

            {agentsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-32 bg-surface-dark rounded-2xl border border-white/5 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {agents.map(agent => (
                  <div 
                    key={agent.id} 
                    className="bg-surface-dark rounded-2xl border border-white/10 p-5 hover:border-white/20 transition-colors group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          {agent.name}
                          {agent.name === 'Mary' && ( 
                            <span className="text-[10px] uppercase tracking-wider bg-emerald-primary/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono border border-emerald-primary/20">
                              MAIN
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-zinc-500 font-mono mt-1">{agent.role}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2.5 w-2.5">
                          {agent.status === 'working' && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          )}
                          <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                            agent.status === 'working' ? 'bg-emerald-primary' : 
                            agent.status === 'idle' ? 'bg-zinc-500' : 
                            agent.status === 'error' ? 'bg-danger-red' : 'bg-zinc-700'
                          }`}></span>
                        </span>
                        <span className="text-xs uppercase tracking-wider font-mono text-zinc-400">
                          {agent.status}
                        </span>
                      </div>
                    </div>

                    {agent.status === 'working' && agent.currentTask ? (
                      <div className="bg-black/50 rounded-lg p-3 border border-white/5 mb-4">
                        <p className="text-sm text-zinc-300 line-clamp-2">{agent.currentTask}</p>
                      </div>
                    ) : (
                      <div className="h-12 mb-4 flex items-center text-sm text-zinc-600 italic">
                        Aguardando instruções...
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        onClick={() => setSelectedAgent(agent)}
                        disabled={agent.status === 'working'}
                        className="text-sm font-medium bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Atribuir Tarefa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Task Feed */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight">Feed de Atividades</h2>
            <div className="bg-surface-dark rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[600px]">
              <div className="p-4 border-b border-white/10 bg-black/20">
                <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider">Tarefas Recentes</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {tasks.length === 0 ? (
                  <div className="text-center text-zinc-500 text-sm py-8">
                    Nenhuma tarefa registrada.
                  </div>
                ) : (
                  tasks.map(task => {
                    const agent = agents.find(a => a.id === task.agentId);
                    return (
                      <div key={task.id} className="relative pl-6 pb-4 border-l border-white/10 last:border-0 last:pb-0">
                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-background-dark border-2 border-zinc-500" />
                        <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono text-emerald-400">
                              {agent?.name || 'Agente Desconhecido'}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500">
                              {task.createdAt?.toLocaleTimeString ? task.createdAt.toLocaleTimeString() : 'Recente'}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-300 mb-3">{task.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {task.status === 'completed' ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-primary" />
                              ) : task.status === 'in-progress' || task.status === 'pending' ? (
                                <CircleDashed className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-danger-red" />
                              )}
                              <span className="text-xs uppercase tracking-wider font-mono text-zinc-500">
                                {task.status}
                              </span>
                            </div>
                            
                            {task.status !== 'completed' && task.status !== 'failed' && (
                              <button 
                                onClick={() => completeTask(task.id, task.agentId)}
                                className="text-xs bg-emerald-primary/10 text-emerald-400 hover:bg-emerald-primary/20 px-2 py-1 rounded transition-colors"
                              >
                                Concluir
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Task Assignment Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-surface-dark border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold">Nova Tarefa para {selectedAgent.name}</h3>
              <button 
                onClick={() => setSelectedAgent(null)}
                className="text-zinc-500 hover:text-white transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAssignTask}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Descrição da Tarefa
                </label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-primary focus:ring-1 focus:ring-emerald-primary transition-all resize-none h-32"
                  placeholder="Ex: Analisar os logs do servidor e gerar um relatório..."
                  required
                  autoFocus
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedAgent(null)}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!taskDescription.trim()}
                  className="px-4 py-2 text-sm font-medium bg-emerald-primary text-black hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center gap-2"
                >
                  <PlayCircle className="w-4 h-4" />
                  Iniciar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
