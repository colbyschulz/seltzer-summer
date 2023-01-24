import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Seltzer from '../../assets/images/seltzer.png';
import DetailScreen from '../../screens/raceDetailScreen/RaceDetailScreen';
import LeaderboardScreen from '../../screens/leaderboardScreen/LeaderboardScreen';
import GlobalCSS from '../../globalStyles.css';
import { FooterText, FooterWrapper, HeaderImage, HeaderWrapper } from './App.css';
import { ConfigProvider } from 'antd';
import colors from '../../colors';

const App = () => {
  return (
    <>
      <GlobalCSS />
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: colors.lightBrown,
            borderRadius: 2,
            colorError: colors.red,
          },
          components: {
            Popover: {
              // borderRadiusLG: 6,
            },
          },
        }}
      >
        <HeaderWrapper>
          <HeaderImage src={Seltzer} />
        </HeaderWrapper>

        <Routes>
          <Route path="/" element={<LeaderboardScreen />} />
          <Route path="/:userId" element={<DetailScreen />} />
        </Routes>

        <FooterWrapper>
          <FooterText>colbyschulz@gmail.com</FooterText>
        </FooterWrapper>
      </ConfigProvider>
    </>
  );
};

export default App;
