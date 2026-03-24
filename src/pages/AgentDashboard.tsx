import { ArrowLeft, CheckCircle2, CircleDashed, XCircle, PlayCircle, Terminal, HardDrive, FileText, Save, BrainCircuit, Users, Settings2, LayoutDashboard } from 'lucide-react';
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

type TabMode = 'overview' | 'tasks' | 'brain' | 'workspace' | 'subagents';
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
  
  // Mock data for subagents demonstration
  const [subagents, setSubagents] = useState([
      { agentId: 'mary', id: '1', name: 'Sub-Repo (Arquiteto)', status: 'running', task: 'Modelagem Firebase' },
      { agentId: 'mary', id: '2', name: 'Sub-UI (UX)', status: 'idle', task: 'Refinamento Dark/Emerald' },
      { agentId: 'mary', id: '3', name: 'Sub-Logic (Backend)', status: 'idle', task: 'Hooks customizados' },
      { agentId: 'mary', id: '4', name: 'Sub-QA (Logs)', status: 'idle', task: 'Monitoramento' }
  ]);

  useEffect(() => {
    if (agent && activeTab === 'brain') {
      setIsEditing(false); 
      setBrainContent('Carregando arquivo...');
      getFileContent(agent.id, activeBrainFile).then(content => {
          setBrainContent(content);
      });
    }
  }, [agent, activeTab, activeBrainFile]);

  const handleSaveFile = async () => {
    if (!agent) return;
    setIsSaving(true);
    await saveFileContent(agent.id, activeBrainFile, brainContent);
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

        if (taskError) return;

        await supabase
          .from('agents')
          .update({
              status: 'idle',
              current_task: null,
              updated_at: new Date().toISOString()
          })
          .eq('id', agent.id);
    } catch (err: any) {
        console.error("Erro inesperado:", err);
    }
  };

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center p-20 min-h-screen bg-gray-50 dark:bg-black">
        <h2 className="text-gray-900 dark:text-white text-2xl font-bold">Agente não encontrado</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-emerald-600 dark:text-emerald-500 hover:underline">Voltar para Home</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-200 transition-colors duration-200 p-6">
      {/* HEADER DO AGENTE */}
      <div className="max-w-7xl mx-auto mb-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400 mb-6 transition-all font-medium">
          <ArrowLeft className="w-4 h-4" /> Painel de Controle
        </button>
        
        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm dark:shadow-none">
          <div className="flex items-center gap-6">
            <div className="relative">
                <img 
                    className="w-24 h-24 rounded-2xl border-4 border-white dark:border-gray-900 shadow-md" 
                    src={agent.avatar || `https://ui-avatars.com/api/?name=${agent.name}&background=04b983&color=fff`} 
                    alt={agent.name} 
                />
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-4 border-white dark:border-gray-900 shadow-sm" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">{agent.name}</h1>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  agent.status === 'working' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : 
                  'bg-gray-100 dark:bg-gray-800 text-gray-500'
                }`}>
                  {agent.status}
                </span>
              </div>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-lg">{agent.role}</p>
            </div>
          </div>
          
          <div className="flex gap-4">
              <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-6 py-3 rounded-full text-sm font-semibold transition-all">
                <Settings2 className="w-4 h-4" /> Configurar
              </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Navigation Bar */}
        <div className="flex gap-2 bg-white dark:bg-gray-900/50 p-1.5 rounded-2xl border border-gray-200 dark:border-gray-800 mb-8 inline-flex">
          {(
            [
              { id: 'tasks', icon: LayoutDashboard, label: 'Dashboard' },
              { id: 'subagents', icon: Users, label: 'Sub-Equipe' },
              { id: 'brain', icon: BrainCircuit, label: 'Memória' }
            ] as {id: TabMode, icon: any, label: string}[]
          ).map(tab => (
             <button 
               key={tab.id}
               onClick={() => setActiveTab(tab.id as TabMode)}
               className={`flex items-center gap-2.5 px-6 py-3 rounded-xl font-semibold transition-all text-sm ${
                 activeTab === tab.id ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
               }`}
             >
               <tab.icon className="w-4 h-4" />
               {tab.label}
             </button>
          ))}
        </div>

        {/* CONTENT AREA */}
        {activeTab === 'subagents' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {subagents.filter(s => s.agentId === agentId).map(sub => (
              <div key={sub.id} className="bg-white dark:bg-gray-900 p-6 rounded-3xl border border-gray-200 dark:border-gray-800 hover:border-emerald-500/50 transition-all shadow-sm">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-lg">{sub.name}</h4>
                  <p className="text-sm text-gray-500 mb-4">{sub.task}</p>
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
                    <span className={`w-2 h-2 rounded-full ${sub.status === 'running' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                    {sub.status.toUpperCase()}
                  </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Atividades Recentes</h3>
              <div className="space-y-4">
                {agentTasks.map(task => (
                  <div key={task.id} className="flex items-center gap-4 bg-gray-50 dark:bg-gray-950 p-4 rounded-2xl border border-gray-200 dark:border-gray-800">
                    <div className={`p-2 rounded-full ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                      {task.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <CircleDashed className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{task.description}</p>
                      <p className="text-xs text-gray-500">{task.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-500 rounded-3xl p-8 flex flex-col justify-between text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-4">Nova Célula de Comando</h3>
              <form onSubmit={handleAssignTask}>
                <textarea
                  value={taskDescription}
                  onChange={(e) => setTaskDescription(e.target.value)}
                  className="w-full bg-white/20 border border-white/30 rounded-2xl p-4 text-white placeholder-white/70 focus:outline-none h-40 mb-4"
                  placeholder="Defina a nova instrução para os subagentes..."
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-white text-emerald-600 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-50 transition-colors"
                >
                  <PlayCircle className="w-5 h-5" /> Executar Comando
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
