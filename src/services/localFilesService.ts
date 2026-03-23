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

export const listSkills = async (agentId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('agent_files')
      .select('file_name')
      .eq('agent_id', agentId)
      .ilike('file_name', 'skills/%');

    if (error || !data) {
      console.warn(`[File Service] Nenhuma skill encontrada para o agente ${agentId}.`);
      return [];
    }

    return data.map(f => f.file_name.replace('skills/', ''));
  } catch (err) {
    console.error(`[File Service] Erro ao listar skills:`, err);
    return [];
  }
};

export const getSkillContent = async (agentId: string, skillName: string): Promise<string> => {
    return await getFileContent(agentId, `skills/${skillName}`);
};

export const saveFileContent = async (agentId: string, fileName: string, content: string): Promise<void> => {
  alert('Modo Nuvem (Vercel): Edição direta do Brain desativada visando preservar a integridade local.');
  console.log(`[File Service] Save abortado (Modo Read-Only). Arquivo: ${fileName}`);
};
