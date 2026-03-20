import { useState } from 'react';

const DEFAULT_AGENTS = [
  { id: 'fred', name: 'Fred', role: 'Mestre Orquestrador e Mentor Pessoal', status: 'idle' },
  { id: 'vitor', name: 'Vitor', role: 'Estrategista de Docência e Autoridade Acadêmica', status: 'idle' },
  { id: 'kewin', name: 'Kewin', role: 'Worker Agent', status: 'idle' },
  { id: 'mary', name: 'TMary', role: 'Dev Full Time Pessoal', status: 'idle' },
  { id: 'tamy', name: 'Tamy', role: 'Consultora de Finanças Pessoais & Parceira de Negócios', status: 'idle' },
];

export const useAgents = (_userId?: string) => {
  const [agents] = useState<any[]>(DEFAULT_AGENTS);
  const [loading] = useState(false);

  return { agents, loading };
};
