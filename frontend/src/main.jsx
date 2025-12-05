import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext.jsx'; // 1. Import AuthProvider

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 2. Wrap the application in the AuthProvider */}
    <AuthProvider> 
      <App />
    </AuthProvider>
  </StrictMode>,
);