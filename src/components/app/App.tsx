import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import GlobalCSS from '../../globalStyles.css';
import Seltzer from '../../assets/images/seltzer.png';
import { Route, Routes, useLocation } from 'react-router-dom';
import DetailScreen from '../../screens/detailScreen/DetailScreen';
import LeaderboardScreen from '../../screens/leaderboardScreen/LeaderboardScreen';
import { AboutLabel, AboutText, AboutWrapper, FooterText, FooterWrapper, HeaderImage, HeaderWrapper } from './App.css';
import SignButton from '../../components/signButton/SignButton';
import Modal from '../modal/Modal';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const App = () => {
  const [isAboutModalOpen, setIsAboutModalOpen] = React.useState(false);
  const location = useLocation();

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalCSS />
      <HeaderWrapper>
        <HeaderImage src={Seltzer} />
        {location.pathname === '/' && <SignButton text="About" onClick={() => setIsAboutModalOpen(true)} />}
      </HeaderWrapper>

      <Routes>
        <Route path="/" element={<LeaderboardScreen />} />
        <Route path="/:nameId" element={<DetailScreen />} />
      </Routes>

      <FooterWrapper>
        <FooterText>colbyschulz@gmail.com</FooterText>
      </FooterWrapper>
      <Modal
        showModal={isAboutModalOpen}
        onClose={() => {
          setIsAboutModalOpen(false);
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', fontSize: '13px' }}>
          <h3 style={{ marginTop: 0, fontSize: '16px' }}>Summer of Speed 5k Challenge</h3>
          <AboutWrapper>
            <AboutLabel>Objective:</AboutLabel>
            <AboutText>
              Starting with a recent baseline 5k, make the most progress lowering your 5k time through the summer.
            </AboutText>
          </AboutWrapper>

          <AboutWrapper>
            <AboutLabel>Rules:</AboutLabel>
            <AboutText>Entries must be a 5k effort</AboutText>
          </AboutWrapper>

          <AboutWrapper>
            <AboutLabel>Measurement:</AboutLabel>
            <AboutText>
              The leaderboard is based on percentages relative to baseline effort. So, as you get faster, each second
              counts for more.
            </AboutText>
            <AboutText>{`e.g  16:00 to 15:50 (-1.04%) vs 20:00 to 19:50(-.83%)`} </AboutText>
          </AboutWrapper>
        </div>
      </Modal>
    </QueryClientProvider>
  );
};

export default App;
