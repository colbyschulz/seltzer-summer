import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import GlobalCSS from '../../globalStyles.css';
import Seltzer from '../../assets/images/seltzer.png';
import { Route, Routes } from 'react-router-dom';
import DetailScreen from '../../screens/detailScreen/DetailScreen';
import LeaderboardScreen from '../../screens/leaderboardScreen/LeaderboardScreen';
import { FooterText, FooterWrapper, HeaderImage, HeaderWrapper } from './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalCSS />
      <HeaderWrapper>
        <HeaderImage src={Seltzer} />
      </HeaderWrapper>

      <Routes>
        <Route path="/" element={<LeaderboardScreen />} />
        <Route path="/:nameId" element={<DetailScreen />} />
      </Routes>

      <FooterWrapper>
        <FooterText>colbyschulz@gmail.com</FooterText>
      </FooterWrapper>
    </QueryClientProvider>
  );
};

export default App;
