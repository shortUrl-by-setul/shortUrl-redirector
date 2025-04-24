import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.js';

const key = window.location.pathname.slice(1, -1);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App url_key={key} />
  </StrictMode>,
);
