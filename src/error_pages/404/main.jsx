import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import 404 from './404.jsx';

const key = window.location.pathname.slice(1, -1);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Nfd url_key={key} />
  </StrictMode>,
);
