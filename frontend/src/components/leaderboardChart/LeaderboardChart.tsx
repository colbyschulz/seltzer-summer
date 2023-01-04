import React, { Dispatch, FC, SetStateAction, useMemo } from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Line, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

import { useRaces } from '../../api/races';
import { racesByNameId, secondsToRaceTime } from '../../utils';
import colors from '../../colors';
interface LeaderboardChartProps {
  activeDataKey: string;
  setActiveDataKey: Dispatch<SetStateAction<string>>;
}
const LeaderboardChart: FC<LeaderboardChartProps> = ({ activeDataKey, setActiveDataKey }) => {
  const { innerWidth } = window;

  const { data: races = [] } = useRaces();
  const dataNormalizedById = useMemo(() => racesByNameId(races), [races]);

  const raceTimes: number[] = [];

  const chartDataNormalizedByDate = Object.values(dataNormalizedById).reduce((accum, raceArray) => {
    raceArray.forEach(({ raceName, raceDate, timeInSeconds }) => {
      if (!accum[raceDate]) {
        accum[raceDate] = {
          raceDate,
          [raceName]: timeInSeconds,
        };
      } else {
        accum[raceDate] = {
          ...accum[raceDate],
          [raceName]: timeInSeconds,
        };
      }
      raceTimes.push(timeInSeconds);
    });

    return accum;
  }, {} as { [dataKey: string]: any });

  raceTimes.sort((a, b) => a - b);

  const upperBound = raceTimes[raceTimes.length - 1];
  const lowerBound = raceTimes[0];

  const floor = Math.floor(lowerBound / 60);
  const ceiling = Math.ceil(upperBound / 60);
  const floorTime = floor * 60;
  const ceilingTime = ceiling * 60;
  const ticks = [];
  for (let i = floorTime; i <= ceilingTime; i += 30) {
    ticks.push(i);
  }

  const chartData = Object.values(chartDataNormalizedByDate)
    .sort((a, b) => new Date(a.raceDate).getTime() - new Date(b.raceDate).getTime())
    .map((data) => {
      // const parsedDate = data.raceDate.split('-');
      // const dateString = new Date(parseInt(parsedDate[0]), parseInt(parsedDate[1]) - 1, parseInt(parsedDate[2]));
      const dateString = new Date(data.raceDate);
      return { ...data, date: format(dateString, 'MM/dd') };
    });

  return (
    <ResponsiveContainer aspect={1.6} maxHeight={450} minHeight={innerWidth > 840 ? 450 : 206}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid />
        <XAxis dataKey="date" tick={{ fontSize: '14px' }} />
        <YAxis
          tick={{ fontSize: '14px' }}
          ticks={ticks}
          interval={1}
          scale="linear"
          type="number"
          domain={[floorTime, ceilingTime]}
          tickFormatter={(v) => {
            return secondsToRaceTime(v);
          }}
        />
        {Object.keys(dataNormalizedById).map((key) => {
          const raceArray = dataNormalizedById[key];
          const name = raceArray[0].raceName;
          const isLineActive = activeDataKey === name;
          const strokeColor = isLineActive ? colors.lightBrown : '#454545';
          const fillColor = isLineActive ? colors.lightBrown : '#454545';
          const radius = isLineActive ? 4 : 2;
          const lineStrokeWidth = isLineActive ? 2 : 1;
          return (
            <Line
              cursor="pointer"
              onClick={() => {
                setActiveDataKey(name);
              }}
              isAnimationActive={false}
              key={key}
              type="monotone"
              dataKey={name}
              strokeWidth={lineStrokeWidth}
              stroke={strokeColor}
              dot={{
                cursor: 'pointer',
                fill: fillColor,
                strokeWidth: 2,
                r: radius,
                stroke: strokeColor,
                onClick: () => {
                  setActiveDataKey(name);
                },
              }}
              connectNulls
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LeaderboardChart;
