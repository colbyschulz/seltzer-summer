import styled from 'styled-components';
import colors from '../../colors';

export const DetailScreenWrapper = styled.div`
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
  margin: 10px 20px 20px 20px;
  border-radius: 5px;
  background-color: ${colors.tan};
`;

export const Metrics = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 20px 15px 20px;
`;

export const MetricLabel = styled.label``;

export const MetricValue = styled.span<{ color?: string }>`
  color: ${({ color }) => color ?? 'inherit'};
`;
