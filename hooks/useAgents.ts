import { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'working' | 'error';
  currentTask: string | null;
  updatedAt: string;
}

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
      } else {
        setAgents(data as any[]);
      }
      setLoading(false);
    };

    fetchAgents();

    // Inscrição em tempo real para mudanças nos agentes deste proprietário
    const channel = supabase
      .channel(`agents-${ownerId}`)
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'agents', 
          filter: `owner_id=eq.${ownerId}` 
        }, 
        (payload) => {
          console.log('Mudança detectada no Supabase:', payload);
          fetchAgents(); // Recarregar lista completa para simplificar o estado
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ownerId]);

  return { agents, loading };
};
