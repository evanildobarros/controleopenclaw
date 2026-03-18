import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const DEFAULT_AGENTS = [
  { id: 'fred', name: 'Fred', role: 'Main Agent' },
  { id: 'vitor', name: 'Vitor', role: 'Worker Agent' },
  { id: 'kewin', name: 'Kewin', role: 'Worker Agent' },
  { id: 'mary', name: 'Mary', role: 'Worker Agent' },
  { id: 'tamy', name: 'Tamy', role: 'Worker Agent' },
];

export const useAgents = (userId: string | undefined) => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setAgents([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'agents'), where('ownerId', '==', userId));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const agentsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      if (agentsData.length === 0 && !snapshot.metadata.hasPendingWrites) {
        try {
          for (const agent of DEFAULT_AGENTS) {
            await setDoc(doc(db, 'agents', `${userId}_${agent.id}`), {
              ownerId: userId,
              name: agent.name,
              role: agent.role,
              status: 'idle',
              updatedAt: serverTimestamp(),
            });
          }
        } catch (error) {
          console.error("Error bootstrapping agents:", error);
        }
      } else {
        setAgents(agentsData);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { agents, loading };
};
