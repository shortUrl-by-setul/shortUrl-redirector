import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import RedirectorApp from './App.jsx';

const key = window.location.pathname.slice(1);

createRoot(document.getElementById('root')).render(
  <RedirectorApp url_key={key} />,
);
{/* <StrictMode>
    <RedirectorApp url_key={key} />
  </StrictMode>, */}