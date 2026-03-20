import { supabase } from '../lib/supabase';

const INITIAL_MOCK_DATA: Record<string, string> = {
  'SOUL.md': '# Soul\n\nFallback de arquivo SOUL.',
  'IDENTITY.md': '# Identity\n\nFallback de arquivo IDENTITY.',
  'MEMORY.md': '# Memory\n\nFallback de arquivo MEMORY.',
};

export const getFileContent = async (agentId: string, fileName: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('agent_files')
      .select('content')
      .eq('agent_id', agentId)
      .eq('file_name', fileName)
      .single();

    if (error || !data) {
      console.warn(`[File Service] Não foi encontrado ${fileName} para o agente ${agentId} no banco.`);
      return INITIAL_MOCK_DATA[fileName] || `# ${fileName}\n\nArquivo ainda não sincronizado da máquina local.`;
    }

    return data.content;
  } catch (err) {
    console.error(`[File Service] Fetch error:`, err);
    return `# Erro de Conexão\n\nNão foi possível acessar a nuvem para o ${fileName}`;
  }
};

export const saveFileContent = async (agentId: string, fileName: string, content: string): Promise<void> => {
  // Conforme sua escolha: O Dashboard na nuvem agora opera apenas em leitura para esses arquivos 
  // O conteúdo real será empurrado de baixo para cima pelo Script Daemon local do seu Ubuntu.
  alert('Modo Nuvem (Vercel): Edição direta do Brain desativada visando preservar a integridade local.');
  console.log(`[File Service] Save abortado (Modo Read-Only). Arquivo: ${fileName}`);
};
