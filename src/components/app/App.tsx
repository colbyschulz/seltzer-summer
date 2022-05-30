import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import GlobalCSS from '../../globalStyles.css';
import Seltzer from '../../assets/images/seltzer.jpg';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import DetailScreen from '../../screens/detailScreen/DetailScreen';
import LeaderboardScreen from '../../screens/leaderboardScreen/LeaderboardScreen';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GlobalCSS />
        <div style={{ alignSelf: 'center' }}>
          <img style={{ maxWidth: '100%' }} src={Seltzer} />
        </div>

        <Routes>
          <Route path="/" element={<LeaderboardScreen />} />
          <Route path="/:nameId" element={<DetailScreen />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;
