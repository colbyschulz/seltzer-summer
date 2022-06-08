import React, { FC, useMemo } from 'react';
import { useRecords } from '../../api/records';
import { racesByNameId, secondsToRaceTime } from '../../utils';
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
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import colors from '../../colors';

import { DefaultTooltipContent } from 'recharts/lib/component/DefaultTooltipContent';

const CustomTooltip: React.FC<TooltipProps<any, any>> = ({ payload, ...rest }) => {
  const newPayload = payload ? [...payload]?.sort((a, b) => b.value - a.value) : [];

  return <DefaultTooltipContent payload={newPayload} {...rest} />;
};

const RaceComparisonChart: FC = () => {
  const { innerWidth } = window;
  const { data: records = [] } = useRecords();
  const { nameId } = useParams();

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
    <ResponsiveContainer aspect={1.6} maxHeight={350} minHeight={innerWidth > 840 ? 350 : 218}>
      <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
        <CartesianGrid />
        <ReferenceLine y={fastestRaceTime} strokeDasharray="8 8" stroke={colors.green} strokeWidth={2} />
        <ReferenceLine y={slowestRaceTime} strokeDasharray="8 8" stroke={colors.red} strokeWidth={2} />
        <ReferenceLine
          y={baseRaceTime}
          strokeDasharray="8 8"
          stroke="black"
          // label={{ position: 'bottom', value: 'Summer Baseline' }}
          strokeWidth={2}
        />

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
        <Tooltip
          itemStyle={{ fontSize: '12px', margin: '0', padding: '0' }}
          labelStyle={{ fontSize: '12px' }}
          content={<CustomTooltip />}
          formatter={(v: number) => secondsToRaceTime(v)}
          labelFormatter={(value) => {
            const parsedDate = value && typeof value === 'string' && value.split('/');
            const currentYear = new Date().getFullYear();
            const dateString =
              parsedDate && new Date(currentYear, parseInt(parsedDate[0]) - 1, parseInt(parsedDate[1]));
            return format(dateString, 'MM/dd/yyyy');
          }}
        />

        {Object.keys(dataNormalizedById).map((key) => {
          const raceArray = dataNormalizedById[key];
          const isActiveLine = key === nameId;
          const name = raceArray[0].name;
          const color = isActiveLine ? '#454545' : '#a7a7a7';
          const dotRadius = isActiveLine ? 4 : 2;
          const activeDotRadius = isActiveLine ? 6 : 3;

          return (
            <Line
              isAnimationActive={false}
              key={key}
              type="monotone"
              dataKey={name}
              strokeWidth={isActiveLine ? 3 : 2}
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
