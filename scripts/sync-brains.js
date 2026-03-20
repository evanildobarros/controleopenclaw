import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Configura o ambiente puxando as variáveis locais do App Controller
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ ERRO: Não encontramos as credenciais do Supabase no arquivo .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function syncAgentFiles() {
  console.log('\n🔄 Iniciando leitura dos discos e sincronização online...');

  try {
    // 1. Busca os IDs (strings de owner_id = evanildo_admin_001) para parear
    const { data: agentsData, error: agentsError } = await supabase
      .from('agents')
      .select('id, name')
      .eq('owner_id', 'evanildo_admin_001');

    if (agentsError || !agentsData) {
      console.error('❌ Falha ao buscar lista de Agentes no banco:', agentsError);
      return;
    }

    // 2. Itera sobre cada agente físico para extrair seus SOUL, IDENTITY e MEMORY
    let filesUpdated = 0;
    
    for (const agent of agentsData) {
      const localFolderName = agent.name === 'Fred' ? '.openclaw' : `.openclaw-${agent.name.toLowerCase()}`;
      const dirPath = path.join('/home/evanildobarros', localFolderName);

      if (!fs.existsSync(dirPath)) {
        console.warn(`⚠️ [Aviso] Diretório do ${agent.name} não encontrado: ${dirPath}`);
        continue;
      }

      const filesToSync = ['SOUL.md', 'IDENTITY.md', 'MEMORY.md'];
      
      for (const file of filesToSync) {
        const filePath = path.join(dirPath, file);
        if (fs.existsSync(filePath)) {
          const content = fs.readFileSync(filePath, 'utf-8');
          
          // 3. Atualiza (UPSERT) na nova tabela isolada
          const { error } = await supabase
            .from('agent_files')
            .upsert({
              agent_id: agent.id,
              file_name: file,
              content: content,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'agent_id, file_name'
            });

          if (error) {
            console.error(`❌ Erro ao subir ${file} do ${agent.name}:`, error.message);
          } else {
            console.log(`✅ [${agent.name}] Ensaio enviado para nuvem: ${file}`);
            filesUpdated++;
          }
        }
      }
    }
    
    console.log(`🏁 Sincronização concluída! Arquivos atualizados no Supabase: ${filesUpdated}`);
  } catch (err) {
    console.error(`💥 Erro fatal de daemon:`, err);
  }
}

// Rodar imediatamente ao iniciar
syncAgentFiles();

// Configurar Loop para rodar a cada 60 segundos (1 minuto) mantendo o feed da Vercel sempre fresco!
setInterval(syncAgentFiles, 60 * 1000);
