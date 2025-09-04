import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import PipeNetwork3D from './components/PipeNetwork3D';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const root = ReactDOM.createRoot(rootElement);
const path = window.location.pathname;
root.render(
  <React.StrictMode>
    {path === '/3d' ? <PipeNetwork3D /> : <App />}
  </React.StrictMode>,
);
