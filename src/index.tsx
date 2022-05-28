import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
import { QueryClient, QueryClientProvider } from 'react-query';
import GlobalCSS from './globalStyles.css';
import Seltzer from './assets/images/seltzer.jpg';

const queryClient = new QueryClient();

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <GlobalCSS />
    <img style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={Seltzer} />

    <App />
  </QueryClientProvider>,
  document.getElementById('root'),
);
