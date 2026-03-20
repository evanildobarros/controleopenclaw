import { initializeApp } from 'firebase/app';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const agents = [
  { id: 'fred', name: 'Fred', role: 'Mestre Orquestrador e Mentor Pessoal' },
  { id: 'vitor', name: 'Vitor', role: 'Worker Agent' },
  { id: 'kewin', name: 'Kewin', role: 'Worker Agent' },
  { id: 'mary', name: 'Mary', role: 'Worker Agent' },
  { id: 'tamy', name: 'Tamy', role: 'Worker Agent' },
];

const userId = 'evanildo_admin_001';

async function updateAgents() {
  for (const agent of agents) {
    const agentRef = doc(db, 'agents', `${userId}_${agent.id}`);
    await updateDoc(agentRef, {
      name: agent.name,
      role: agent.role,
    });
    console.log(`Updated ${agent.name}`);
  }
}

updateAgents().catch(console.error);
