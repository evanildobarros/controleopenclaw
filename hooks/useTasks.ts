import { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';

interface Task {
  id: string;
  ownerId: string;
  agentId: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  createdAt: string; 
  completedAt?: string;
}

export const useTasks = (ownerId: string | undefined) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ownerId) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const fetchTasks = async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('id, ownerId:owner_id, agentId:agent_id, description, status, createdAt:created_at, completedAt:completed_at')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) {
        console.error("Erro ao buscar tarefas:", error);
      } else {
        setTasks(data as any[]);
      }
      setLoading(false);
    };

    fetchTasks();

    // Inscrição em tempo real para mudanças nas tarefas deste proprietário
    const channel = supabase
      .channel(`tasks-${ownerId}`)
      .on(
        'postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'tasks', 
          filter: `owner_id=eq.${ownerId}` 
        }, 
        (payload) => {
          console.log('Mudança detectada em tarefas:', payload);
          fetchTasks(); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ownerId]);

  return { tasks, loading };
};
