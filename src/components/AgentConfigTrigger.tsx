import React, { useState } from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { processAgentConfigs } from '../utils/AgentConfigManager'; // Assumindo que o manager está lá

// A função real de edição precisa ser injetada aqui ou importada do backend
const executeRealAgentConfigUpdate = async (channelId: string) => {
    // Este é um placeholder. A chamada real seria via exec/sessions_send dependendo da arquitetura
    console.log(\`Tentando executar a atualização real para o canal: \${channelId}\`);
    // Se as ferramentas de baixo nível estiverem funcionando, o código real seria chamado aqui.
    // Por enquanto, simulamos que a função do AgentConfigManager é chamada.
    await processAgentConfigs(channelId); 
    return { success: true };
};

export const AgentConfigTrigger: React.FC = () => {
    const [isUpdating, setIsUpdating] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [lastChannelId, setLastChannelId] = useState<string | null>(null);

    const handleUpdate = async () => {
        setIsUpdating(true);
        setStatus('idle');
        // Usamos o canal que estava em foco na última discussão de ETR
        const channelId = "1484170099000000000"; 
        setLastChannelId(channelId);

        try {
            // Tentativa de chamar a lógica que executaria os comandos 'openclaw edit'
            await executeRealAgentConfigUpdate(channelId);
            setStatus('success');
        } catch (e) {
            console.error(e);
            setStatus('error');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="p-8 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-gray-100 dark:border-white/10">
            <h3 className="text-xl font-bold text-happiness-1 mb-4">Automação de Configuração de Agentes</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
                Clique abaixo para executar a rotina que garante que todos os agentes (Fred, Tamy, Vitor, Kewin, Mary) tenham os canais Discord mais recentes adicionados aos seus arquivos de configuração locais.
            </p>

            <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className={\`w-full py-3 px-4 rounded-lg text-white font-bold uppercase tracking-wider transition-all shadow-md
                    \${isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-happiness-1 hover:bg-happiness-2 active:scale-[0.98] shadow-happiness-1/50'}
                \`}
            >
                {isUpdating ? 'Processando...' : 'Executar Sincronização de Agentes'}
            </button>

            {status === 'success' && lastChannelId && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500 text-green-300 rounded-lg flex items-center gap-2">
                    <CheckCircle size={20} />
                    Sincronização Concluída! Agentes atualizados com o canal ID: {lastChannelId} (Simulação).
                </div>
            )}
            {status === 'error' && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500 text-red-300 rounded-lg flex items-center gap-2">
                    <AlertTriangle size={20} />
                    FALHA na execução real da atualização. Verifique o console ou o estado do sistema.
                </div>
            )}
        </div>
    );
};