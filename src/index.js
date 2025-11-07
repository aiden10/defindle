import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { GameProvider } from './shared/GameContext.tsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </React.StrictMode>
);