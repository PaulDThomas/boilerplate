import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthLayer } from './auth/AuthLayer';
import './custom.scss';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <AuthLayer>
      <App />
    </AuthLayer>
  </React.StrictMode>,
);
