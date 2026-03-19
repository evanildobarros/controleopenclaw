import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'working' | 'error';
  currentTask: string | null;
  updatedAt: any; // Timestamp do Firebase
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

    // Define um ID fixo para o agente principal, pois estamos simulando um ambiente onde o App.tsx
    // se autentica como 'admin' (FIXED_UID) e deve ver seus agentes gerenciados.
    // Na versão subagent, os IDs dos subagents seriam listados dinamicamente, mas aqui simulamos com um mock.
    
    // Simulação: Se o ownerId é o fixo, vamos carregar um conjunto de agentes simulados.
    if (ownerId === 'evanildo_admin_001') {
        // Mock de agentes para testes locais sem DB populado
        setAgents([
            { id: 'mary_123', name: 'Mary', role: 'Desenvolvimento/ESG', status: 'working', currentTask: 'Revisar e implementar o tema escuro no controleopenclaw/index.html', updatedAt: new Date() },
            { id: 'vitor_456', name: 'Vitor', role: 'Infra/Deploy', status: 'idle', currentTask: null, updatedAt: new Date() },
            { id: 'tamy_789', name: 'Tamy', role: 'Financeiro/Gestão', status: 'idle', currentTask: null, updatedAt: new Date() },
            { id: 'kewin_012', name: 'Kewin', role: 'Frontend/UX', status: 'working', currentTask: 'Implementar a lógica de toggle de tema no App.tsx', updatedAt: new Date() },
        ]);
        setLoading(false);
        return;
    }
    
    const q = query(collection(db, 'agents'), where('ownerId', '==', ownerId));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const agentsList: Agent[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : doc.data().updatedAt,
      } as Agent));
      
      setAgents(agentsList);
      setLoading(false);
    }, (error) => {
      console.error("Erro ao buscar agentes:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [ownerId]);

  return { agents, loading };
};
