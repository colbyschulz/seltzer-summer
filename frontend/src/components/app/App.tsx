import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Seltzer from '../../assets/images/seltzer.png';
import DetailScreen from '../../screens/raceDetailScreen/RaceDetailScreen';
import LeaderboardScreen from '../../screens/leaderboardScreen/LeaderboardScreen';
import GlobalCSS from '../../globalStyles.css';
import { FooterText, FooterWrapper, HeaderImage, HeaderWrapper } from './App.css';

const App = () => {
  return (
    <>
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
    </>
  );
};

export default App;
