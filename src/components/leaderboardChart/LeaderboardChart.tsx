import React, { Dispatch, FC, SetStateAction, useMemo } from 'react';
import { useRecords } from '../../api/records';
import { racesByNameId, secondsToRaceTime } from '../../utils';
import { LineChart, CartesianGrid, XAxis, YAxis, Line, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import colors from '../../colors';
interface LeaderboardChartProps {
  activeDataKey: string;
  setActiveDataKey: Dispatch<SetStateAction<string>>;
}
const LeaderboardChart: FC<LeaderboardChartProps> = ({ activeDataKey, setActiveDataKey }) => {
  const { innerWidth } = window;

  const { data: records = [] } = useRecords();
  const dataNormalizedById = useMemo(() => racesByNameId(records), [records]);

  const raceTimes: number[] = [];

  const chartDataNormalizedByDate = Object.values(dataNormalizedById).reduce((accum, raceArray) => {
    raceArray.forEach(({ name, date, time }) => {
      if (!accum[date]) {
        accum[date] = {
          date,
          [name]: time,
        };
      } else {
        accum[date] = {
          ...accum[date],
          [name]: time,
        };
      }
      raceTimes.push(time);
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
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((data) => ({ ...data, date: format(new Date(data.date), 'MM/dd') }));

  return (
    <ResponsiveContainer aspect={1.5} maxHeight={550} minHeight={innerWidth > 840 ? 550 : 218}>
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
        {/* <Tooltip
          formatter={(v: number) => secondsToRaceTime(v)}
          labelFormatter={(value) => {
            const parsedDate = value && typeof value === 'string' && value.split('/');
            const currentYear = new Date().getFullYear();
            const dateString =
              parsedDate && new Date(currentYear, parseInt(parsedDate[0]) - 1, parseInt(parsedDate[1]));
            return format(dateString, 'MM/dd/yyyy');
          }}
        /> */}
        {Object.keys(dataNormalizedById).map((key) => {
          const raceArray = dataNormalizedById[key];
          const name = raceArray[0].name;
          const color = activeDataKey === name ? colors.lightBrown : '#131313';
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
              strokeWidth={2}
              stroke={color}
              dot={{
                cursor: 'pointer',
                fill: color,
                r: 3,
                stroke: color,
                onClick: () => {
                  setActiveDataKey(name);
                },
              }}
              activeDot={{
                fill: color,
                r: 6,
                stroke: color,
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
