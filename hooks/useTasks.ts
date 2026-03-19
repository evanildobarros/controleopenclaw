import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface Task {
  id: string;
  ownerId: string;
  agentId: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  createdAt: any; // Timestamp do Firebase
  completedAt?: any;
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

    // Simulação: Se o ownerId é o fixo, vamos carregar um conjunto de tarefas simuladas.
    if (ownerId === 'evanildo_admin_001') {
        // Mock de tarefas para testes locais sem DB populado
        setTasks([
            { id: 't1', ownerId: 'evanildo_admin_001', agentId: 'mary_123', description: 'Revisar e implementar o tema escuro no controleopenclaw/index.html', status: 'in-progress', createdAt: new Date(Date.now() - 300000) },
            { id: 't2', ownerId: 'evanildo_admin_001', agentId: 'kewin_012', description: 'Implementar a lógica de toggle de tema no App.tsx', status: 'pending', createdAt: new Date(Date.now() - 120000) },
            { id: 't3', ownerId: 'evanildo_admin_001', agentId: 'vitor_456', description: 'Verificar a conexão do Firebase no ambiente de produção.', status: 'completed', createdAt: new Date(Date.now() - 600000) },
        ]);
        setLoading(false);
        return;
    }
    
    const q = query(
      collection(db, 'tasks'), 
      where('ownerId', '==', ownerId), 
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksList: Task[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt,
        completedAt: doc.data().completedAt?.toDate ? doc.data().completedAt.toDate() : doc.data().completedAt,
      } as Task));
      
      setTasks(tasksList.slice(0, 20)); 
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar tarefas:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [ownerId]);

  return { tasks, loading };
};
