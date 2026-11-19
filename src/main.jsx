import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import ChristmasOverlay from './christmas/ChristmasOverlay.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <ChristmasOverlay />
    </BrowserRouter>
  </StrictMode>,
);
