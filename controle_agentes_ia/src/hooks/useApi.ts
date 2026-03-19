import { createApi } from 'unsplash-js';

// Criação de um hook de API simulado (Unsplash como placeholder)
const unsplash = createApi({
  accessKey: import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'simulated_unsplash_key', 
});

export { unsplash };
