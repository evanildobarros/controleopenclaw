import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { useAgents } from './hooks/useAgents';
import { useTasks } from './hooks/useTasks';
import { Activity, CheckCircle2, CircleDashed, LogOut, Plus, User as UserIcon, XCircle, Clock, PlayCircle, Lock } from 'lucide-react';
import { collection, addDoc, serverTimestamp, updateDoc, doc } from 'firebase/firestore';

const FIXED_UID = 'evanildo_admin_001';
const CREDENTIALS = {
  username: 'evanildobarros',
  password: 'jedai2003'
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem('openclaw_auth') === 'true');
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
      localStorage.setItem('openclaw_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Usuário ou senha incorretos.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('openclaw_auth');
    setUsername('');
    setPassword('');
  };

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn || !selectedAgent || !taskDescription.trim()) return;

    try {
      await addDoc(collection(db, 'tasks'), {
        ownerId: FIXED_UID,
        agentId: selectedAgent.id,
        description: taskDescription,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, 'agents', selectedAgent.id), {
        status: 'working',
        currentTask: taskDescription,
        updatedAt: serverTimestamp(),
      });

      setTaskDescription('');
      setSelectedAgent(null);
    } catch (error) {
      console.error("Error assigning task:", error);
      alert("Falha ao atribuir tarefa. Verifique as permissões do banco de dados.");
    }
  };

  const completeTask = async (taskId: string, agentId: string) => {
    try {
      await updateDoc(doc(db, 'tasks', taskId), {
        status: 'completed',
        completedAt: serverTimestamp(),
      });
      await updateDoc(doc(db, 'agents', agentId), {
        status: 'idle',
        currentTask: null,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-white p-4">
        <div className="max-w-md w-full bg-[#141414] p-8 rounded-2xl border border-white/10 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Activity className="w-8 h-8 text-emerald-500" />
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
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all"
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
                  className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-all"
                  placeholder="Sua senha"
                  required
                />
              </div>
            </div>
            {loginError && <p className="text-red-500 text-xs text-center">{loginError}</p>}
            <button
              type="submit"
              className="w-full bg-emerald-500 text-black font-bold py-3 px-4 rounded-xl hover:bg-emerald-400 transition-colors mt-4"
            >
              Entrar no Sistema
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-sans selection:bg-emerald-500/30">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#141414]/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center border border-emerald-500/30">
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            <h1 className="text-xl font-semibold tracking-tight">OpenClaw</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-zinc-400">
              <div className="w-8 h-8 rounded-full border border-white/10 bg-emerald-500/10 flex items-center justify-center">
                <UserIcon className="w-4 h-4 text-emerald-500" />
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
                {agents.length} ONLINE
              </div>
            </div>

            {agentsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-32 bg-[#141414] rounded-2xl border border-white/5 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {agents.map(agent => (
                  <div 
                    key={agent.id} 
                    className="bg-[#141414] rounded-2xl border border-white/10 p-5 hover:border-white/20 transition-colors group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-medium flex items-center gap-2">
                          {agent.name}
                          {agent.name === 'Fred' && (
                            <span className="text-[10px] uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full font-mono border border-emerald-500/20">
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
                            agent.status === 'working' ? 'bg-emerald-500' : 
                            agent.status === 'idle' ? 'bg-zinc-500' : 
                            agent.status === 'error' ? 'bg-red-500' : 'bg-zinc-700'
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
            <div className="bg-[#141414] rounded-2xl border border-white/10 overflow-hidden flex flex-col h-[600px]">
              <div className="p-4 border-b border-white/10 bg-black/20">
                <h3 className="text-sm font-mono text-zinc-400 uppercase tracking-wider">Tarefas Recentes</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {tasks.length === 0 ? (
                  <div className="text-center text-zinc-500 text-sm py-8">
                    Nenhuma tarefa registrada.
                  </div>
                ) : (
                  tasks.map(task => {
                    const agent = agents.find(a => a.id === task.agentId);
                    return (
                      <div key={task.id} className="relative pl-6 pb-4 border-l border-white/10 last:border-0 last:pb-0">
                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-[#141414] border-2 border-zinc-500" />
                        <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-mono text-emerald-400">
                              {agent?.name || 'Agente'}
                            </span>
                            <span className="text-[10px] font-mono text-zinc-500">
                              {task.createdAt?.toDate?.().toLocaleTimeString() || 'Agora'}
                            </span>
                          </div>
                          <p className="text-sm text-zinc-300 mb-3">{task.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {task.status === 'completed' ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                              ) : task.status === 'in-progress' || task.status === 'pending' ? (
                                <CircleDashed className="w-3.5 h-3.5 text-blue-500 animate-spin-slow" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5 text-red-500" />
                              )}
                              <span className="text-xs uppercase tracking-wider font-mono text-zinc-500">
                                {task.status}
                              </span>
                            </div>
                            
                            {task.status !== 'completed' && task.status !== 'failed' && (
                              <button 
                                onClick={() => completeTask(task.id, task.agentId)}
                                className="text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-2 py-1 rounded transition-colors"
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
          <div className="bg-[#141414] border border-white/10 rounded-2xl max-w-md w-full p-6 shadow-2xl">
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
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none h-32"
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
                  className="px-4 py-2 text-sm font-medium bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center gap-2"
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
