import React, { FC } from 'react';
import { useRecords } from '../../api/records';

import { LineChartWrapper } from './lineChart.css';

const LineChart: FC = () => {
  const { data: records = [] } = useRecords();

  return <LineChartWrapper>LineChart</LineChartWrapper>;
};

export default LineChart;
