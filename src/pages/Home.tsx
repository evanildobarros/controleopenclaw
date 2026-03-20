import { Activity, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Agent } from '../../hooks/useAgents';

interface HomeProps {
  agents: Agent[];
  agentsLoading: boolean;
}

export function Home({ agents, agentsLoading }: HomeProps) {
  const navigate = useNavigate();

  return (
    <div className="py-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">Meet our Agents</h2>
          <p className="mt-4 text-lg text-gray-400">Dynamic agents dedicated to orchestrating results.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Total Ativos</p>
              <p className="text-2xl font-semibold text-white">{agents.length}</p>
          </div>
          <div className="bg-gray-800 border border-emerald-500/30 p-4 rounded-xl shadow-[0_0_15px_rgba(4,185,131,0.1)]">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Em Execução</p>
              <p className="text-2xl font-semibold text-emerald-500">{agents.filter(a => a.status === 'working').length}</p>
          </div>
          <div className="bg-gray-800 border border-gray-700 p-4 rounded-xl">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Ociosos</p>
              <p className="text-2xl font-semibold text-gray-500">{agents.filter(a => a.status === 'idle').length}</p>
          </div>
        </div>

        {agentsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {[1, 2, 3].map(i => <div key={i} className="h-64 bg-gray-800 rounded-2xl border border-gray-700 animate-pulse" />)}
          </div>
        ) : (
          <ul role="list" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map(agent => (
              <li 
                key={agent.id} 
                onClick={() => navigate(`/agent/${agent.id}`)}
                className="bg-gray-800 border border-gray-700 p-8 rounded-3xl hover:border-emerald-500/50 cursor-pointer transition-all hover:shadow-[0_0_30px_rgba(4,185,131,0.1)] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-x-6">
                    <img 
                      className="size-16 rounded-full border border-gray-600" 
                      src={agent.avatar || `https://ui-avatars.com/api/?name=${agent.name}&background=04b983&color=fff`} 
                      alt={agent.name} 
                    />
                    <div>
                      <p className="text-xs font-bold text-emerald-500 uppercase tracking-widest">{agent.name}</p>
                      <h3 className="text-sm font-semibold text-white leading-tight mt-1">{agent.role}</h3>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${agent.status === 'working' ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'}`} />
                    <span className="text-xs text-gray-400 font-mono">{agent.status === 'working' ? 'Processando' : 'Aguardando'}</span>
                  </div>
                </div>
                <div className="mt-6">
                  <span
                    className="w-full text-sm font-medium bg-gray-700/50 hover:bg-emerald-500/20 hover:text-emerald-400 text-gray-300 px-4 py-2 rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Acessar Dashboard
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
