import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'next/link';
import App from './App';
import './tailwind.css';
import './styles.css';
import GoogleAnalytics from './components/GoogleAnalytics';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
     <GoogleAnalytics />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
