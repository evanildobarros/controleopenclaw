import { CheckCircle2, CircleDashed, XCircle, PlayCircle, Terminal, HardDrive } from 'lucide-react';
import { Agent } from '../../hooks/useAgents';

interface TaskPanelProps {
  agent: Agent;
  agentTasks: any[];
  taskDescription: string;
  setTaskDescription: (val: string) => void;
  handleAssignTask: (e: React.FormEvent) => void;
  completeTask: (id: string) => void;
}

export function TaskPanel({ agent, agentTasks, taskDescription, setTaskDescription, handleAssignTask, completeTask }: TaskPanelProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden flex flex-col h-[600px] lg:col-span-2 shadow-sm dark:shadow-none">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
          <h3 className="text-sm font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">Histórico de Tarefas</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {agentTasks.length === 0 ? (
              <div className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">Nenhuma tarefa registrada para este agente.</div>
          ) : (
            agentTasks.map(task => {
              const taskDate = task.createdAt ? new Date(task.createdAt) : null;
              return (
                <div key={task.id} className="relative pl-6 pb-4 border-l border-gray-300 dark:border-gray-700 last:border-0 last:pb-0">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-white dark:bg-gray-900 border-2 border-emerald-500" />
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500">
                        {taskDate ? taskDate.toLocaleTimeString() : 'Recente'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        {task.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : task.status === 'in-progress' || task.status === 'pending' ? (
                          <CircleDashed className="w-4 h-4 text-blue-500 animate-spin-slow" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">{task.status}</span>
                      </div>
                      
                      {task.status !== 'completed' && task.status !== 'failed' && (
                        <button 
                          onClick={() => completeTask(task.id)}
                          className="text-xs font-semibold bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg transition-colors border border-emerald-200 dark:border-transparent"
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
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-xl dark:shadow-none">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Nova Tarefa Local</h3>
          <form onSubmit={handleAssignTask}>
            <textarea
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              className="w-full bg-gray-50 dark:bg-black/50 border border-gray-300 dark:border-gray-700 rounded-xl p-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all resize-none h-32 mb-4"
              placeholder={`Instruir ${agent.name}...`}
              required
            />
            <button
              type="submit"
              disabled={!taskDescription.trim() || agent.status === 'working'}
              className="w-full px-4 py-3 text-sm font-bold bg-emerald-500 text-white dark:text-gray-900 hover:bg-emerald-600 dark:hover:bg-emerald-400 disabled:opacity-30 disabled:cursor-not-allowed rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <PlayCircle className="w-5 h-5" /> Iniciar
            </button>
          </form>
        </div>
        
        <div className="bg-gray-50 dark:bg-black rounded-2xl border border-gray-200 dark:border-gray-800 p-4 h-[280px] flex flex-col shadow-inner dark:shadow-none">
          <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 mb-2 font-mono text-xs border-b border-gray-200 dark:border-gray-800 pb-2">
              <Terminal className="w-4 h-4" /> root@{agent.name.toLowerCase()} - stdout
          </div>
          <div className="flex-1 overflow-auto custom-scrollbar font-mono text-xs text-emerald-600 dark:text-emerald-500">
              {agent.status === 'working' ? (
              <>
                  <div className="text-emerald-600 dark:text-emerald-500">&gt; Inicializando ambiente de trabalho...</div>
                  <br/>
                  <div className="animate-pulse text-emerald-600 dark:text-emerald-500">&gt; Analisando tarefa pendente...</div>
                  <div className="text-emerald-600 dark:text-emerald-500">&gt; Carregando pacotes de memória de {agent.localPath}</div>
                  <br/>
                  <div className="text-gray-400 dark:text-gray-500">... aguardando resposta da rotina core ...</div>
              </>
              ) : (
              <div className="text-gray-400 dark:text-gray-600">&gt; Agente aguardando instruções. Sistema em Standby.</div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
