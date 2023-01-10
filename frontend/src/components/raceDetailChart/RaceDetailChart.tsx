import React, { FC } from 'react';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import {
  LineChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  ResponsiveContainer,
  ReferenceLine,
  TooltipProps,
} from 'recharts';
import { DefaultTooltipContent } from 'recharts/lib/component/DefaultTooltipContent';

import { useRaces } from '../../api/races';
import { secondsToRaceTime } from '../../utils';
import colors from '../../colors';
import { useUser, useUsers } from '../../api/users';

const CustomTooltip: React.FC<TooltipProps<any, any>> = ({ payload, ...rest }) => {
  const newPayload = payload ? [...payload]?.sort((a, b) => b.value - a.value) : [];

  return <DefaultTooltipContent payload={newPayload} {...rest} />;
};

const RaceComparisonChart: FC = () => {
  const { userId: userIdFromParams } = useParams();
  const { innerWidth } = window;
  const { data: races = [] } = useRaces();
  const { data: user } = useUser(userIdFromParams);
  const { data: users = [] } = useUsers();
  const allRaceTimes = races.map((race) => race.timeInSeconds).sort((a, b) => a - b);

  const userRaces = user?.races || [];
  const userRacesMutable = [...userRaces];
  const userRacesMutableSortedByDate = userRacesMutable?.sort(
    (a, b) => new Date(a.raceDate).getTime() - new Date(b.raceDate).getTime(),
  );
  const baseRaceTime = userRacesMutableSortedByDate?.splice(0, 1)[0]?.timeInSeconds;
  const fastestRemainingTime = userRacesMutable?.find(
    (race) => race.timeInSeconds === Math.min(...userRaces.map((race) => race.timeInSeconds)),
  )?.timeInSeconds;
  const slowestRemainingTime = userRacesMutable?.find(
    (race) => race.timeInSeconds === Math.max(...userRaces.map((race) => race.timeInSeconds)),
  )?.timeInSeconds;

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
    <ResponsiveContainer aspect={1.6} maxHeight={350} minHeight={innerWidth > 840 ? 350 : 180}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid />
        <ReferenceLine y={fastestRemainingTime} strokeDasharray="8 8" stroke={colors.green} strokeWidth={2} />
        <ReferenceLine y={slowestRemainingTime} strokeDasharray="8 8" stroke={colors.red} strokeWidth={2} />
        <ReferenceLine y={baseRaceTime} strokeDasharray="8 8" stroke="black" strokeWidth={2} />

        <XAxis dataKey="date" tick={{ fontSize: '12px' }} />

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
        <Tooltip
          itemStyle={{ fontSize: '12px', margin: '0', padding: '0' }}
          labelStyle={{ fontSize: '12px' }}
          content={<CustomTooltip />}
          formatter={(v: number) => secondsToRaceTime(v)}
        />

        {users.map(({ userFullName, id }) => {
          const isActiveLine = userIdFromParams && id === parseInt(userIdFromParams);
          const color = isActiveLine ? colors.lightBrown : '#c7c7c7';
          const dotRadius = isActiveLine ? 4 : 2;
          const activeDotRadius = 4;

          return (
            <Line
              isAnimationActive={false}
              key={id}
              type="monotone"
              dataKey={userFullName}
              strokeWidth={isActiveLine ? 2 : 1}
              stroke={color}
              connectNulls
              dot={{ fill: color, r: dotRadius, stroke: color }}
              activeDot={{ fill: color, r: activeDotRadius, stroke: color }}
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RaceComparisonChart;
