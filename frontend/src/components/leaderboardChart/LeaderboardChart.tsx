import React, { Dispatch, FC, SetStateAction } from 'react';
import { LineChart, CartesianGrid, XAxis, YAxis, Line, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

import { useRaces } from '../../api/races';
import { secondsToRaceTime } from '../../utils';
import colors from '../../colors';
import { useUsers } from '../../api/users';
import { Spin } from 'antd';
interface LeaderboardChartProps {
  activeDataKey: number | null;
  setActiveDataKey: Dispatch<SetStateAction<number | null>>;
  loading: boolean;
}
const LeaderboardChart: FC<LeaderboardChartProps> = ({ activeDataKey, setActiveDataKey, loading }) => {
  const { innerWidth } = window;
  const { data: races = [] } = useRaces();
  const { data: users = [] } = useUsers();

  const allEffectiveRaceTimes = races.map((race) => race.effectiveTimeInSeconds).sort((a, b) => (a ?? 0) - (b ?? 0));

  const racesNormalizedByDate = races.reduce((accum, race) => {
    const { user, effectiveTimeInSeconds, raceDate } = race;
    const userName = user?.userFullName ?? 'user';
    const formattedDate = format(new Date(raceDate), 'M/dd');
    if (!accum[formattedDate]) {
      accum[formattedDate] = {
        [userName]: effectiveTimeInSeconds,
        raceDate: formattedDate,
      };
    } else {
      accum[formattedDate] = {
        ...accum[formattedDate],
        [userName]: effectiveTimeInSeconds,
      };
    }
    return accum;
  }, {} as { [date: string]: { [name: string]: number | string | undefined } });

  const chartData = Object.values(racesNormalizedByDate);

  const upperBound = allEffectiveRaceTimes[allEffectiveRaceTimes.length - 1];
  const lowerBound = allEffectiveRaceTimes[0];
  const floor = Math.floor((lowerBound ?? 0) / 60);
  const ceiling = Math.ceil((upperBound ?? 0) / 60);
  const floorTime = floor * 60;
  const ceilingTime = ceiling * 60;
  const ticks = [];
  for (let i = floorTime; i <= ceilingTime; i += 30) {
    ticks.push(i);
  }

  return (
    <ResponsiveContainer aspect={1.6} maxHeight={450} minHeight={innerWidth > 840 ? 450 : 206}>
      {loading ? (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Spin size="large" />
        </div>
      ) : (
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
                key={id}
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
      )}
    </ResponsiveContainer>
  );
};

export default LeaderboardChart;
