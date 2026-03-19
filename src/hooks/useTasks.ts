import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

export const useTasks = (userId: string | undefined) => {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) {
      setTasks([]);
      return;
    }

    const q = query(
      collection(db, 'tasks'),
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [userId]);

  return { tasks };
};
