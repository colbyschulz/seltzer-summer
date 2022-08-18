import styled from 'styled-components';
import colors from '../../colors';

export const DetailScreenWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overflow-y: hidden;
  margin-top: 15px;
`;

export const DetailTableWrapper = styled.div`
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  border-radius: 5px;
  margin: 10px 20px 20px 20px;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
  background-color: ${colors.transparentWhite};
`;

export const Metrics = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 20px 5px 20px;
`;

export const MetricLabel = styled.label`
  font-size: 14px;
`;

export const MetricValue = styled.span<{ color?: string }>`
  font-size: 14px;
  color: ${({ color }) => color ?? 'inherit'};
`;
