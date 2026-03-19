import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Importa a função de toggle do tema, se ela existir.
// Como não temos a função de toggle ainda, vamos focar na aplicação da classe inicial baseada no sistema.
// Para o dark mode funcionar, é necessário adicionar a classe 'dark' ao <html> no index.html, o que já foi feito.
// Em um app real, seria necessário adicionar um botão de toggle que manipula a classe 'dark' no elemento <html>.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

