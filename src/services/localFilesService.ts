const INITIAL_MOCK_DATA: Record<string, string> = {
  'SOUL.md': '# Soul\n\nFallback de arquivo SOUL.',
  'IDENTITY.md': '# Identity\n\nFallback de arquivo IDENTITY.',
  'MEMORY.md': '# Memory\n\nFallback de arquivo MEMORY.',
};

export const getFileContent = async (agentPath: string, fileName: string): Promise<string> => {
  try {
    const res = await fetch(`/api/files?path=${encodeURIComponent(agentPath)}&file=${encodeURIComponent(fileName)}`);
    if (res.ok) {
        const body = await res.json();
        return body.content;
    }
    console.warn(`[File Service] File not found or failed reading on path: ${agentPath}/${fileName}`);
  } catch (err) {
    console.error(`[File Service] Fetch error:`, err);
  }
  
  return INITIAL_MOCK_DATA[fileName] || `# ${fileName}\n\nArquivo vazio no diretório local.`;
};

export const saveFileContent = async (agentPath: string, fileName: string, content: string): Promise<void> => {
  try {
     const res = await fetch(`/api/files?path=${encodeURIComponent(agentPath)}&file=${encodeURIComponent(fileName)}`, {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ content })
     });
     if (res.ok) {
         console.log(`[File Service] Sucesso: Salvo ${fileName} no caminho real local: ${agentPath}`);
     } else {
         console.error(`[File Service] Falha na API ao salvar ${fileName}`);
     }
  } catch (err) {
     console.error(`[File Service] Erro de rede ao salvar ${fileName}:`, err);
  }
};
