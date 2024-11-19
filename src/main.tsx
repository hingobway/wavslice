import React from 'react';
import ReactDOM from 'react-dom/client';

import { RecoilRoot } from 'recoil';

import '@fontsource/atkinson-hyperlegible/400.css';
import '@fontsource/atkinson-hyperlegible/700.css';

import App from './App';

import './main.css';
import FileDropState from './components/FileDropState';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <FileDropState>
        <App />
      </FileDropState>
    </RecoilRoot>
  </React.StrictMode>,
);
