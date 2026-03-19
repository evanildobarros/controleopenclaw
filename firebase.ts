import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Arquivo de inicialização de Firebase para a aplicação principal (root)
// A configuração real deve ser obtida do ambiente de execução (ex: AI Studio env vars)
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "simulated_api_key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "project.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "project-id",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "project.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "sender-id",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "app-id",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
