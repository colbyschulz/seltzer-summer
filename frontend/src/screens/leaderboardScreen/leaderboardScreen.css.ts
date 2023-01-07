import { Modal } from 'antd';
import styled from 'styled-components';
import colors from '../../colors';

export const StyledTableCell = styled.td<{ isFaster?: boolean }>`
  color: ${({ isFaster }) => (isFaster ? 'green' : 'red')};
`;

export const LeaderboardScreenWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overflow-y: hidden;
  margin-top: 15px;
`;

export const HeaderControls = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 20px 7px 20px;
  align-items: flex-start;
`;

export const LeaderboardTableWrapper = styled.div`
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  border-radius: 5px;
  margin: 10px 20px 20px 20px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
  background-color: ${colors.transparentWhite};
`;

export const AboutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
`;

export const AboutLabel = styled.label``;

export const AboutText = styled.label`
  font-size: 16px;
  @media (max-width: 415px) {
    font-size: 12px;
  }
`;

export const StyledModal = styled(Modal)``;
