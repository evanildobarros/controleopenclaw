import { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'working' | 'error';
  currentTask: string | null;
  updatedAt: string;
  localPath: string; // MAPEADO PARA A NOVA REQUISIÇÃO
  avatar?: string;
}

const LOCAL_PATHS: Record<string, string> = {
  'Fred': '/home/evanildobarros/.openclaw',
  'Mary': '/home/evanildobarros/.openclaw-mary',
  'Tamy': '/home/evanildobarros/.openclaw-tamy',
  'Kewin': '/home/evanildobarros/.openclaw-kewin',
  'Vitor': '/home/evanildobarros/.openclaw-vitor'
};

const AVATAR_MAP: Record<string, string> = {
  'Fred': '/avatars/fred.jpg',
  'Mary': '/avatars/mary.png',
  'Tamy': '/avatars/tamy.png',
  'Kewin': '/avatars/kewin.png',
  'Vitor': '/avatars/vitor.jpg'
};

export const useAgents = (ownerId: string | undefined) => {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId) {
      setAgents([]);
      setLoading(false);
      return;
    }

    const fetchAgents = async () => {
      const { data, error } = await supabase
        .from('agents')
        .select('id, name, role, status, currentTask:current_task, updatedAt:updated_at')
        .eq('owner_id', ownerId)
        .order('name');
      
      if (error) {
        console.error("Erro ao buscar agentes:", error);
      } else if (data) {
        const mappedData = data.map((a: any) => ({
             ...a,
             localPath: LOCAL_PATHS[a.name] || `/home/evanildobarros/.openclaw-${a.name.toLowerCase()}`,
             avatar: AVATAR_MAP[a.name] || a.avatar || `https://ui-avatars.com/api/?name=${a.name}&background=04b983&color=fff`
        }));
        setAgents(mappedData);
      }
      setLoading(false);
    };

    fetchAgents();

    const channel = supabase
      .channel(`agents-${ownerId}`)
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'agents'
        }, 
        (payload) => {
          fetchAgents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ownerId]);

  return { agents, loading };
};
