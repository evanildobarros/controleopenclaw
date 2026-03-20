import { useState } from 'react';

// Mock de tarefas
const DEFAULT_TASKS = [
  { id: '1', agentId: 'fred', description: 'Monitorar métricas de sistema', status: 'completed', createdAt: new Date() },
  { id: '2', agentId: 'tamy', description: 'Análise de fluxo de caixa', status: 'in-progress', createdAt: new Date() },
];

export const useTasks = (_userId?: string) => {
  const [tasks] = useState<any[]>(DEFAULT_TASKS);
  return { tasks };
};
