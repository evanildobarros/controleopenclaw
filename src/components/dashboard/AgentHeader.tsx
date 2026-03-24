import { HardDrive } from 'lucide-react';
import { Agent } from '../../hooks/useAgents';
import { useNavigate } from 'react-router-dom';

interface AgentHeaderProps {
  agent: Agent;
}

export function AgentHeader({ agent }: AgentHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm dark:shadow-none">
      <div className="flex items-center gap-6">
        <img 
            className="w-20 h-20 rounded-full border-2 border-emerald-500/50" 
            src={agent.avatar || `https://ui-avatars.com/api/?name=${agent.name}&background=04b983&color=fff`} 
            alt={agent.name} 
        />
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{agent.name}</h1>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
              agent.status === 'working' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/50' : 
              'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-700'
            }`}>
              {agent.status}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{agent.role}</p>
          <div className="flex items-center gap-2 mt-3 text-xs font-mono text-gray-400 dark:text-gray-500">
            <HardDrive className="w-3.5 h-3.5" />
            {agent.localPath}
          </div>
        </div>
      </div>
    </div>
  );
}
