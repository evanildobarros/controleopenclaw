import { Activity, CheckCircle2, CircleDashed, Lock, LogOut, PlayCircle, Plus, User as UserIcon, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAgents } from '../hooks/useAgents';
import { useTasks } from '../hooks/useTasks';
import { supabase } from './lib/supabase';

const FIXED_UID = 'evanildo_admin_001';
const CREDENTIALS = {
  username: 'evanildobarros',
  password: 'jedai2003'
};

// Componente para o Toggle de Tema (Desabilitado ou fixado em Light para garantir fontes pretas)
const ThemeToggle = () => {
    return null; // Forçar light theme e fontes pretas.
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

    try {
        const { error: taskError } = await supabase
          .from('tasks')
          .insert([
            {
                owner_id: FIXED_UID,
                agent_id: selectedAgent.id,
                description: taskDescription,
                status: 'pending'
            }
          ]);
        
        if (taskError) {
            console.error("Erro ao criar tarefa:", taskError);
            alert("Falha ao atribuir tarefa: " + taskError.message);
            return;
        }

        const { error: agentError } = await supabase
          .from('agents')
          .update({
              status: 'working',
              current_task: taskDescription,
              updated_at: new Date().toISOString()
          })
          .eq('id', selectedAgent.id);

        if (agentError) {
            console.error("Erro ao atualizar status do agente:", agentError);
        }

        setTaskDescription('');
        setSelectedAgent(null);
    } catch (err: any) {
        console.error("Erro inesperado:", err);
    }
  };

  const completeTask = async (taskId: string, agentId: string) => {
    try {
        const { error: taskError } = await supabase
          .from('tasks')
          .update({
              status: 'completed',
              completed_at: new Date().toISOString()
          })
          .eq('id', taskId);

        if (taskError) {
            console.error("Erro ao concluir tarefa:", taskError);
            return;
        }

        const { error: agentError } = await supabase
          .from('agents')
          .update({
              status: 'idle',
              current_task: null,
              updated_at: new Date().toISOString()
          })
          .eq('id', agentId);

        if (agentError) {
            console.error("Erro ao atualizar status do agente:", agentError);
        }
    } catch (err: any) {
        console.error("Erro inesperado:", err);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-black p-4 font-sans">
        <div className="max-w-md w-full bg-zinc-50 p-8 rounded-2xl border border-zinc-200 shadow-xl">
          <div className="w-16 h-16 bg-emerald-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 text-center text-black">OpenClaw Controller</h1>
          <p className="text-black/60 mb-8 text-center">Acesse com suas credenciais de administrador.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">Usuário</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-black focus:outline-none focus:border-black transition-all"
                  placeholder="Seu usuário"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white border border-zinc-200 rounded-xl py-2.5 pl-10 pr-4 text-black focus:outline-none focus:border-black transition-all"
                  placeholder="Sua senha"
                  required
                />
              </div>
            </div>
            {loginError && <p className="text-red-600 text-xs text-center">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-black text-white font-bold py-3 px-4 rounded-xl hover:bg-zinc-800 transition-colors mt-4"
            >
              Entrar no Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-zinc-200">
      <header className="border-b border-zinc-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-zinc-100 rounded-lg flex items-center justify-center border border-zinc-200">
              <Activity className="w-5 h-5 text-black" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-black">OpenClaw</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-black">
              <div className="w-8 h-8 rounded-full border border-zinc-200 bg-zinc-50 overflow-hidden">
                <img src="/avatars/perfil.png" alt="Perfil" className="w-full h-full object-cover" />
              </div>
              <span className="hidden sm:inline font-mono">evanildobarros</span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-black hover:bg-zinc-100 rounded-lg transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
             <div className="py-4">
               <div className="max-w-7xl">
                 <div className="mb-8">
                   <h2 className="text-3xl font-semibold tracking-tight text-black sm:text-4xl">Meet our Agents</h2>
                   <p className="mt-4 text-lg text-black/60">Dynamic agents dedicated to orchestrating results.</p>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-xl">
                        <p className="text-xs text-black uppercase tracking-wider mb-1">Total Ativos</p>
                        <p className="text-2xl font-semibold text-black">{agents.length}</p>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl shadow-sm">
                        <p className="text-xs text-black uppercase tracking-wider mb-1">Em Execução</p>
                        <p className="text-2xl font-semibold text-black">{agents.filter(a => a.status === 'working').length}</p>
                    </div>
                    <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-xl">
                        <p className="text-xs text-black uppercase tracking-wider mb-1">Ociosos</p>
                        <p className="text-2xl font-semibold text-black">{agents.filter(a => a.status === 'idle').length}</p>
                    </div>
                </div>

                 {agentsLoading ? (
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                     {[1, 2, 3].map(i => <div key={i} className="h-64 bg-zinc-50 rounded-2xl border border-zinc-100 animate-pulse" />)}
                   </div>
                 ) : (
                   <ul role="list" className="grid gap-8 sm:grid-cols-2">
                     {agents.map(agent => (
                       <li key={agent.id} className="bg-zinc-50 border border-zinc-200 p-8 rounded-3xl hover:border-black transition-all hover:shadow-md">
                         <div className="flex items-center gap-x-6">
                           <img 
                             className="size-16 rounded-full border border-zinc-300" 
                             src={agent.avatar || `https://ui-avatars.com/api/?name=${agent.name}&background=000&color=fff`} 
                             alt={agent.name} 
                           />
                           <div>
                             <p className="text-xs font-bold text-black uppercase tracking-widest">{agent.name}</p>
                             <h3 className="text-sm font-semibold text-black leading-tight mt-1">{agent.role}</h3>
                           </div>
                         </div>
                         <div className="mt-6">
                           <button
                             onClick={() => setSelectedAgent(agent)}
                             disabled={agent.status === 'working'}
                             className="w-full text-sm font-medium bg-black text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-2"
                           >
                             <Plus className="w-4 h-4 text-white" />
                             Atribuir Tarefa
                           </button>
                         </div>
                       </li>
                     ))}
                   </ul>
                 )}
               </div>
             </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-semibold tracking-tight text-black">Feed de Atividades</h2>
            <div className="bg-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden flex flex-col h-[600px]">
              <div className="p-4 border-b border-zinc-200 bg-zinc-100/50">
                <h3 className="text-sm font-mono text-black uppercase tracking-wider">Tarefas Recentes</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {tasks.length === 0 ? (
                  <div className="text-center text-black/40 text-sm py-8">
                    Nenhuma tarefa registrada.
                  </div>
                ) : (
                  tasks.map(task => {
                    const agent = agents.find(a => a.id === task.agentId);
                    const taskDate = task.createdAt ? new Date(task.createdAt) : null;
                    return (
                      <div key={task.id} className="relative pl-6 pb-4 border-l border-zinc-300 last:border-0 last:pb-0">
                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-white border-2 border-black" />
                        <div className="bg-white rounded-xl p-3 border border-zinc-200 shadow-sm">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-black">
                              {agent?.name || 'Agente Desconhecido'}
                            </span>
                            <span className="text-[10px] font-mono text-black">
                              {taskDate ? taskDate.toLocaleTimeString() : 'Recente'}
                            </span>
                          </div>
                          <p className="text-sm text-black mb-3">{task.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {task.status === 'completed' ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                              ) : task.status === 'in-progress' || task.status === 'pending' ? (
                                <CircleDashed className="w-3.5 h-3.5 text-black animate-spin-slow" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-black" />
                              )}
                              <span className="text-xs uppercase tracking-wider font-bold text-black">
                                {task.status}
                              </span>
                            </div>
                            
                            {task.status !== 'completed' && task.status !== 'failed' && (
                              <button 
                                onClick={() => completeTask(task.id, agent?.id || '')}
                                className="text-xs bg-black text-white hover:bg-zinc-800 px-2 py-1 rounded transition-colors"
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

      {selectedAgent && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-black rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6 border-b border-zinc-100 pb-4">
              <h3 className="text-xl font-bold text-black">Nova Tarefa para {selectedAgent.name}</h3>
              <button 
                onClick={() => setSelectedAgent(null)}
                className="text-black hover:text-red-600 transition-colors"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleAssignTask}>
              <div className="mb-6">
                <label className="block text-sm font-bold text-black mb-2">
                  Descrição da Tarefa
                </label>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full bg-zinc-50 border border-black rounded-xl p-3 text-black placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-black transition-all resize-none h-32"
                  placeholder="Ex: Analisar os logs do servidor e gerar um relatório..."
                  required
                  autoFocus
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedAgent(null)}
                  className="px-4 py-2 text-sm font-bold text-black hover:underline transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!taskDescription.trim()}
                  className="px-4 py-2 text-sm font-bold bg-black text-white hover:bg-zinc-800 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center gap-2"
                >
                  <PlayCircle className="w-4 h-4 text-white" />
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
