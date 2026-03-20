import { ArrowLeft, CheckCircle2, CircleDashed, XCircle, PlayCircle, Terminal, HardDrive, FileText, Save, BrainCircuit, Activity } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Agent } from '../../hooks/useAgents';
import { useTasks } from '../../hooks/useTasks';
import { getFileContent, saveFileContent } from '../services/localFilesService';
import { supabase } from '../lib/supabase';

interface AgentDashboardProps {
  agents: Agent[];
  fixedUid: string;
}

type TabMode = 'overview' | 'tasks' | 'brain' | 'workspace';
type BrainFile = 'SOUL.md' | 'IDENTITY.md' | 'MEMORY.md';

export function AgentDashboard({ agents, fixedUid }: AgentDashboardProps) {
  const { agentId } = useParams<{ agentId: string }>();
  const navigate = useNavigate();
  const agent = agents.find(a => a.id === agentId);

  const [activeTab, setActiveTab] = useState<TabMode>('tasks');
  const [activeBrainFile, setActiveBrainFile] = useState<BrainFile>('SOUL.md');
  const [brainContent, setBrainContent] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const { tasks } = useTasks(fixedUid);
  const agentTasks = tasks.filter(t => t.agentId === agentId);
  const logsRef = useRef<HTMLDivElement>(null);
  
  const [taskDescription, setTaskDescription] = useState('');

  // Fetch brain file
  useEffect(() => {
    if (agent && activeTab === 'brain') {
      setIsEditing(false); // Reset editing lock when switching tabs/files
      setBrainContent('Carregando arquivo...');
      getFileContent(agent.localPath, activeBrainFile).then(content => {
          setBrainContent(content);
      });
    }
  }, [agent, activeTab, activeBrainFile]);

  // Handle Save
  const handleSaveFile = async () => {
    if (!agent) return;
    setIsSaving(true);
    await saveFileContent(agent.localPath, activeBrainFile, brainContent);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent || !taskDescription.trim()) return;

    try {
        const { error: taskError } = await supabase
          .from('tasks')
          .insert([
            {
                owner_id: fixedUid,
                agent_id: agent.id,
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
          .eq('id', agent.id);

        if (agentError) console.error("Erro ao atualizar status do agente:", agentError);

        setTaskDescription('');
    } catch (err: any) {
        console.error("Erro inesperado:", err);
    }
  };

  const completeTask = async (taskId: string) => {
    if(!agent) return;
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
          .eq('id', agent.id);

        if (agentError) console.error("Erro ao atualizar status do agente:", agentError);
    } catch (err: any) {
        console.error("Erro inesperado:", err);
    }
  };


  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center p-20">
        <h2 className="text-white text-2xl font-bold">Agente não encontrado</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-emerald-500 hover:underline">Voltar para Home</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 text-gray-200">
      {/* HEADER DO AGENTE */}
      <div className="mb-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel Principal
        </button>
        
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <img 
                className="w-20 h-20 rounded-full border-2 border-emerald-500/50" 
                src={agent.avatar || `https://ui-avatars.com/api/?name=${agent.name}&background=04b983&color=fff`} 
                alt={agent.name} 
            />
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold text-white tracking-tight">{agent.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  agent.status === 'working' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50' : 
                  'bg-gray-800 text-gray-400 border border-gray-700'
                }`}>
                  {agent.status}
                </span>
              </div>
              <p className="text-gray-400 mt-1">{agent.role}</p>
              <div className="flex items-center gap-2 mt-3 text-xs font-mono text-gray-500">
                <HardDrive className="w-3.5 h-3.5" />
                {agent.localPath}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-800 mb-6 overflow-x-auto custom-scrollbar pb-2">
        {(['overview', 'tasks', 'brain', 'workspace'] as TabMode[]).map(tab => (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`px-4 py-2 capitalize font-medium rounded-t-lg transition-colors whitespace-nowrap ${
               activeTab === tab ? 'text-emerald-400 border-b-2 border-emerald-500' : 'text-gray-500 hover:text-gray-300'
             }`}
           >
             {tab === 'brain' ? 'Brain (Arquivos MD)' : tab === 'tasks' ? 'Tasks & Logs' : tab}
           </button>
        ))}
      </div>

      {/* TABS CONTENT */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
             <h3 className="text-xl font-bold text-white mb-4">Informações</h3>
             <p className="text-gray-400 leading-relaxed">
               Este é o painel de propriedades do {agent.name}. 
               Ele opera a partir de diretórios locais mapeados de forma assíncrona.
             </p>
           </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden flex flex-col h-[600px] lg:col-span-2">
            <div className="p-4 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
              <h3 className="text-sm font-mono text-gray-400 uppercase tracking-wider">Histórico de Tarefas</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {agentTasks.length === 0 ? (
                  <div className="text-center text-gray-500 text-sm py-8">Nenhuma tarefa registrada para este agente.</div>
              ) : (
                agentTasks.map(task => {
                  const taskDate = task.createdAt ? new Date(task.createdAt) : null;
                  return (
                    <div key={task.id} className="relative pl-6 pb-4 border-l border-gray-700 last:border-0 last:pb-0">
                      <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-gray-900 border-2 border-emerald-500" />
                      <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] font-mono text-gray-500">
                            {taskDate ? taskDate.toLocaleTimeString() : 'Recente'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-300 mb-4">{task.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            {task.status === 'completed' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : task.status === 'in-progress' || task.status === 'pending' ? (
                              <CircleDashed className="w-4 h-4 text-blue-500 animate-spin-slow" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                            <span className="text-xs uppercase font-bold text-gray-400">{task.status}</span>
                          </div>
                          
                          {task.status !== 'completed' && task.status !== 'failed' && (
                            <button 
                              onClick={() => completeTask(task.id)}
                              className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Concluir Tarefa
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

          <div className="flex flex-col gap-6">
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 shadow-xl">
              <h3 className="text-lg font-bold text-white mb-4">Nova Tarefa Local</h3>
              <form onSubmit={handleAssignTask}>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full bg-black/50 border border-gray-700 rounded-xl p-3 text-white placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none h-32 mb-4"
                  placeholder={`Instruir ${agent.name}...`}
                  required
                />
                <button
                  type="submit"
                  disabled={!taskDescription.trim() || agent.status === 'working'}
                  className="w-full px-4 py-3 text-sm font-bold bg-emerald-500 text-gray-900 hover:bg-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <PlayCircle className="w-5 h-5" /> Iniciar
                </button>
              </form>
            </div>
            
            {/* Terminal Mock */}
            <div className="bg-black rounded-2xl border border-gray-800 p-4 h-[280px] flex flex-col">
              <div className="flex items-center gap-2 text-gray-500 mb-2 font-mono text-xs border-b border-gray-800 pb-2">
                 <Terminal className="w-4 h-4" /> root@{agent.name.toLowerCase()} - stdout
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar font-mono text-xs text-emerald-500" ref={logsRef}>
                 {agent.status === 'working' ? (
                   <>
                     <div>&gt; Inicializando ambiente de trabalho...</div>
                     <br/>
                     <div className="animate-pulse">&gt; Analisando tarefa pendente...</div>
                     <div>&gt; Carregando pacotes de memória de {agent.localPath}</div>
                     <br/>
                     <div className="text-gray-400">... aguardando resposta da rotina core ...</div>
                   </>
                 ) : (
                   <div className="text-gray-600">&gt; Agente aguardando instruções. Sistema em Standby.</div>
                 )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'brain' && (
        <div className="flex flex-col h-[70vh] border border-gray-800 rounded-2xl bg-gray-900 overflow-hidden shadow-2xl">
           <div className="flex border-b border-gray-800 bg-gray-900">
             {(['SOUL.md', 'IDENTITY.md', 'MEMORY.md'] as BrainFile[]).map(file => (
                <button
                  key={file}
                  onClick={() => setActiveBrainFile(file)}
                  className={`px-6 py-3 font-mono text-sm border-r border-gray-800 flex items-center gap-2 transition-colors ${
                    activeBrainFile === file ? 'bg-gray-800 text-emerald-400' : 'text-gray-500 hover:bg-gray-800/50'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  {file}
                </button>
             ))}
             <div className="flex-1 flex justify-end items-center px-4">
                {isEditing ? (
                  <button 
                    onClick={handleSaveFile}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-emerald-500 text-gray-900 px-3 py-1.5 rounded text-sm font-bold hover:bg-emerald-400 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" /> {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                  </button>
                ) : (
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="text-gray-400 hover:text-white text-sm font-medium border border-gray-700 px-3 py-1.5 rounded transition-colors"
                  >
                    Editar Arquivo
                  </button>
                )}
             </div>
           </div>

           <div className="flex-1 flex overflow-hidden">
             {/* Editor lado */}
             <div className={`flex-1 border-r border-gray-800 bg-black ${!isEditing && 'hidden'}`}>
                <textarea 
                   className="w-full h-full bg-transparent text-gray-300 font-mono text-sm p-4 focus:outline-none resize-none custom-scrollbar"
                   value={brainContent}
                   onChange={e => setBrainContent(e.target.value)}
                   spellCheck={false}
                />
             </div>
             
             {/* Preview lado */}
             <div className={`flex-1 bg-gray-900 p-6 overflow-y-auto custom-scrollbar prose prose-invert prose-emerald max-w-none ${!isEditing && 'w-full flex-none'}`}>
                 <ReactMarkdown>{brainContent}</ReactMarkdown>
             </div>
           </div>
        </div>
      )}

      {activeTab === 'workspace' && (
         <div className="p-20 text-center text-gray-500">
            <BrainCircuit className="w-16 h-16 mx-auto mb-4 opacity-50 text-emerald-500" />
            <p>Os artefatos temporários e o espaço de trabalho do agente são restritos a execução local.</p>
         </div>
      )}
    </div>
  );
}
