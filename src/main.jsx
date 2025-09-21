import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '@/App';
import '@/index.css';
import '@/styles/modal-fixes.css';
import '@/utils/geminiConsoleTest.js';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { MockAuthProvider } from '@/contexts/MockAuthContext.jsx';
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <MockAuthProvider>
          <HelmetProvider>
            <App />
          </HelmetProvider>
        </MockAuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>
);