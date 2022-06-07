import styled from 'styled-components';
import colors from '../../colors';

export const DetailScreenWrapper = styled.div`
  margin: 20px;
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
  overflow-y: hidden;
`;

export const DetailTableWrapper = styled.div`
  -webkit-overflow-scrolling: touch;
  overflow-y: scroll;
  margin-top: 10px;
  border-radius: 5px;
  background-color: ${colors.tan};
`;

export const Metrics = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

export const MetricLabel = styled.label``;

export const MetricValue = styled.span<{ color?: string }>`
  color: ${({ color }) => color ?? 'inherit'};
`;
