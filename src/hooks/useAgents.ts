import { useState } from 'react';

const DEFAULT_AGENTS = [
  { id: 'fred', name: 'Fred', role: 'Mestre Orquestrador e Mentor Pessoal', status: 'idle' },
  { id: 'tamy', name: 'Tamy', role: 'Consultora de Finanças Pessoais & Parceira de Negócios de Elite', status: 'idle', avatar: '/avatars/tamy.png' },
  { id: 'mary', name: 'Mary', role: 'Dev Full Time Pessoal', status: 'idle' },
  { id: 'kewin', name: 'Kewin', role: 'Worker Agent', status: 'idle', avatar: '/avatars/kewin.png' },
  { id: 'vitor', name: 'Vitor', role: 'Estrategista de Docência e Autoridade Acadêmica', status: 'idle' },
];

export const useAgents = (_userId?: string) => {
  const [agents, setAgents] = useState<any[]>(DEFAULT_AGENTS);
  const [loading] = useState(false);

  // Since we are mocking everything now (DB not in use), 
  // just return DEFAULT_AGENTS directly for simplicity.
  return { agents, loading };
};
