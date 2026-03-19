import { createApi } from 'unsplash-js';

// O Unsplash não é usado diretamente, mas mantemos como exemplo de API externa
const unsplash = createApi({
  accessKey: 'YOUR_UNSPLASH_ACCESS_KEY', // Substituir por chave real ou env var
});

export { unsplash };
