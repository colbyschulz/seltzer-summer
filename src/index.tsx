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
    <div style={{ alignSelf: 'center' }}>
      {/* <img style={{ height: '100%', objectFit: 'contain', alignSelf: 'center' }} src={Seltzer} /> */}
      <img style={{ maxWidth: '100%' }} src={Seltzer} />
    </div>

    <App />
  </QueryClientProvider>,
  document.getElementById('root'),
);
