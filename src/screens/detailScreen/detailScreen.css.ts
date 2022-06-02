import styled from 'styled-components';

export const DetailScreenWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 20px 20px 20px;
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
