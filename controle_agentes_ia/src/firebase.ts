import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuração baseada no firebase-applet-config.json, se presente, ou variáveis de ambiente simuladas.
// Como não temos certeza da estrutura exata de injeção, usaremos variáveis de ambiente simuladas (VITE_*)
// que são comuns em projetos Vite.
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_API_KEY",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "your-project.firebaseapp.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "your-project-id",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "your-project.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "your-sender-id",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "your-app-id",
};

// Inicializa o app
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
