import React, { FC, useMemo, useState } from 'react';
import { useRecords } from '../../api/records';
import { racesByNameId, secondsToRaceTime } from '../../utils';
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Line, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import colors from '../../colors';

const colorMap: { [k: string]: string } = {
  '0': '#800080',
  '1': '##1E90FF',
  '2': '#4B0082',
  '3': '#FF1493',
  '4': '#D2691E',
  '5': '#A52A2A',
  '6': '#808000',
  '7': '#2F4F4F',
  '8': '#B8860B',
  '9': '#191970',
  '10': '#00CED1',
  '11': '#006400',
  '12': '#BDB76B',
  '13': '#FF0000',
};

const LeaderboardChart: FC = () => {
  const { data: records = [] } = useRecords();
  const { nameId } = useParams();
  const [activeName, setActiveName] = useState('');
  const dataNormalizedById = useMemo(() => racesByNameId(records), [records]);
  const raceArray = (nameId && dataNormalizedById[nameId]) || [];
  const raceArrayMutable = [...raceArray];
  const sortedByDate = raceArrayMutable?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const baseRaceTime = sortedByDate?.splice(0, 1)[0]?.time;

  const fastestRaceTime = raceArrayMutable?.find(
    (race) => race.time === Math.min(...raceArray.map((race) => race.time)),
  )?.time;

  const slowestRaceTime = raceArrayMutable?.find(
    (race) => race.time === Math.max(...raceArray.map((race) => race.time)),
  )?.time;

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
    <ResponsiveContainer aspect={1.2} maxHeight={550}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
        <CartesianGrid />
        <ReferenceLine y={fastestRaceTime} strokeDasharray="8 8" stroke={colors.green} strokeWidth={1} />
        <ReferenceLine y={slowestRaceTime} strokeDasharray="8 8" stroke={colors.red} strokeWidth={1} />
        <ReferenceLine
          y={baseRaceTime}
          strokeDasharray="8 8"
          stroke="black"
          // label={{ position: 'bottom', value: 'Summer Baseline' }}
          strokeWidth={1}
        />

        <XAxis dataKey="date" />

        <YAxis
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
          formatter={(v: number) => secondsToRaceTime(v)}
          labelFormatter={(value) => {
            const parsedDate = value && typeof value === 'string' && value.split('/');
            const currentYear = new Date().getFullYear();
            const dateString =
              parsedDate && new Date(currentYear, parseInt(parsedDate[0]) - 1, parseInt(parsedDate[1]));
            return format(dateString, 'MM/dd/yyyy');
          }}
        />

        {Object.keys(dataNormalizedById).map((key, i) => {
          const raceArray = dataNormalizedById[key];
          const name = raceArray[0].name;
          const color = 'grey';

          return (
            <Line
              onClick={(data) => setActiveName('hi')}
              isAnimationActive={false}
              key={key}
              type="monotone"
              dataKey={name}
              strokeWidth={2}
              stroke={color}
              dot={{ fill: color, r: 3, stroke: color }}
              activeDot={{ fill: color, r: 6, stroke: color }}
              connectNulls
            />
          );
        })}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LeaderboardChart;
