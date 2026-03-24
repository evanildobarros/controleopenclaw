import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Agent } from '../../hooks/useAgents';
import { useTasks } from '../../hooks/useTasks';
import { getFileContent, saveFileContent } from '../services/localFilesService';
import { supabase } from '../lib/supabase';
import { AgentHeader } from '../components/dashboard/AgentHeader';
import { TaskPanel } from '../components/dashboard/TaskPanel';
import { BrainEditor } from '../components/dashboard/BrainEditor';

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
  
  const [taskDescription, setTaskDescription] = useState('');
  
  // Mock data for subagents demonstration
  const [subagents] = useState([
      { agentId: 'mary', id: '1', name: 'ESG Analyst', status: 'running', task: 'GEE Calculation' },
      { agentId: 'mary', id: '2', name: 'Storyteller', status: 'idle', task: 'README Generation' },
      { agentId: 'kewin', id: '3', name: 'Health Monitor', status: 'idle', task: 'Heart Rate Sync' }
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
      <div className="flex flex-col items-center justify-center p-20">
        <h2 className="text-gray-900 dark:text-white text-2xl font-bold">Agente não encontrado</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-emerald-600 dark:text-emerald-500 hover:underline">Voltar para Home</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 text-gray-800 dark:text-gray-200 transition-colors duration-200">
      <div className="mb-8">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Painel Principal
        </button>
        <AgentHeader agent={agent} />
      </div>

      <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800 mb-6 overflow-x-auto custom-scrollbar pb-2">
        {(['overview', 'tasks', 'subagents', 'brain', 'workspace'] as TabMode[]).map(tab => (
           <button 
             key={tab}
             onClick={() => setActiveTab(tab)}
             className={`px-4 py-2 capitalize font-medium rounded-t-lg transition-colors whitespace-nowrap ${
               activeTab === tab ? 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500' : 'text-gray-500 dark:text-gray-500 hover:text-gray-800 dark:hover:text-gray-300'
             }`}
           >
             {tab === 'brain' ? 'Brain (Arquivos MD)' : tab === 'tasks' ? 'Tasks & Logs' : tab}
           </button>
        ))}
      </div>

      {activeTab === 'subagents' && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Subagentes Ativos</h3>
          {subagents.filter(s => s.agentId === agentId).length === 0 ? (
            <p className="text-gray-500 italic">Nenhum subagente ativo para este agente.</p>
          ) : (
            subagents.filter(s => s.agentId === agentId).map(sub => (
              <div key={sub.id} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{sub.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{sub.task}</p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${sub.status === 'running' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'}`}>
                    {sub.status}
                  </span>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'tasks' && (
        <TaskPanel 
            agent={agent} 
            agentTasks={agentTasks} 
            taskDescription={taskDescription} 
            setTaskDescription={setTaskDescription}
            handleAssignTask={handleAssignTask}
            completeTask={completeTask}
        />
      )}

      {activeTab === 'brain' && (
        <BrainEditor 
            activeBrainFile={activeBrainFile}
            setActiveBrainFile={setActiveBrainFile}
            brainContent={brainContent}
            setBrainContent={setBrainContent}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            handleSaveFile={handleSaveFile}
            isSaving={isSaving}
        />
      )}
    </div>
  );
}
