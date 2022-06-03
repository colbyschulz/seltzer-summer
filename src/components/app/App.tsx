import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import GlobalCSS from '../../globalStyles.css';
import Seltzer from '../../assets/images/seltzer.jpg';
import { Route, Routes } from 'react-router-dom';
import DetailScreen from '../../screens/detailScreen/DetailScreen';
import LeaderboardScreen from '../../screens/leaderboardScreen/LeaderboardScreen';
import { HeaderImage, HeaderWrapper } from './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: 30000,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalCSS />
      <HeaderWrapper>
        <HeaderImage style={{ maxHeight: '400px' }} src={Seltzer} />
      </HeaderWrapper>

      <Routes>
        <Route path="/" element={<LeaderboardScreen />} />
        <Route path="/:nameId" element={<DetailScreen />} />
      </Routes>
    </QueryClientProvider>
  );
};

export default App;
