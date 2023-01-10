import React, { Dispatch, FC, SetStateAction } from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Line, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

import { useRaces } from '../../api/races';
import { secondsToRaceTime } from '../../utils';
import colors from '../../colors';
import { User } from '../../types';
interface LeaderboardChartProps {
  activeDataKey: number | null;
  setActiveDataKey: Dispatch<SetStateAction<number | null>>;
}
const LeaderboardChart: FC<LeaderboardChartProps> = ({ activeDataKey, setActiveDataKey }) => {
  const { innerWidth } = window;
  const { data: races = [] } = useRaces();
  const allRaceTimes = races.map((race) => race.timeInSeconds).sort((a, b) => a - b);
  const users: User[] = [];
  const racesNormalizedByDate = races.reduce((accum, race) => {
    const { user, timeInSeconds, raceDate } = race;
    const userName = user?.userFullName ?? 'user';
    const formattedDate = format(new Date(raceDate), 'M/dd');
    if (!accum[formattedDate]) {
      accum[formattedDate] = {
        [userName]: timeInSeconds,
        raceDate: formattedDate,
      };
    } else {
      accum[formattedDate] = {
        ...accum[formattedDate],
        [userName]: timeInSeconds,
      };
    }
    user && users.push(user);
    return accum;
  }, {} as { [date: string]: { [name: string]: number | string } });
  const chartData = Object.values(racesNormalizedByDate);

  const upperBound = allRaceTimes[allRaceTimes.length - 1];
  const lowerBound = allRaceTimes[0];
  const floor = Math.floor(lowerBound / 60);
  const ceiling = Math.ceil(upperBound / 60);
  const floorTime = floor * 60;
  const ceilingTime = ceiling * 60;
  const ticks = [];
  for (let i = floorTime; i <= ceilingTime; i += 30) {
    ticks.push(i);
  }

  return (
    <ResponsiveContainer aspect={1.6} maxHeight={450} minHeight={innerWidth > 840 ? 450 : 206}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid />
        <XAxis dataKey="raceDate" tick={{ fontSize: '12px' }} />
        <YAxis
          tick={{ fontSize: '12px' }}
          ticks={ticks}
          interval={1}
          scale="linear"
          type="number"
          domain={[floorTime, ceilingTime]}
          tickFormatter={(v) => {
            return secondsToRaceTime(v);
          }}
        />
        {users.map(({ userFullName, id }) => {
          const isLineActive = activeDataKey === id;
          const strokeColor = isLineActive ? colors.lightBrown : '#454545';
          const fillColor = isLineActive ? colors.lightBrown : '#454545';
          const radius = isLineActive ? 4 : 2;
          const lineStrokeWidth = isLineActive ? 2 : 1;
          return (
            <Line
              cursor="pointer"
              onClick={() => {
                setActiveDataKey(id ?? null);
              }}
              isAnimationActive={false}
              key={userFullName}
              type="monotone"
              dataKey={userFullName}
              strokeWidth={lineStrokeWidth}
              stroke={strokeColor}
              dot={{
                cursor: 'pointer',
                fill: fillColor,
                strokeWidth: 2,
                r: radius,
                stroke: strokeColor,
                onClick: () => {
                  setActiveDataKey(id ?? null);
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
