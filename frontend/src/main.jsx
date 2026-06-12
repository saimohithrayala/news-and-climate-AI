import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx'; // 👈 Line 4 (the index.css import) is completely gone now!

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);