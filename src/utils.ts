import { format } from 'date-fns';
import { TableRecord, TableRecordFields } from './types';

export const capitalize = (string: string) => {
  const capitalized = string
    .trim()
    .toLowerCase()
    .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase()));

  return capitalized;
};

export const raceTimeToSeconds = (minutes: string, seconds: string) => {
  return Number(minutes) * 60 + Number(seconds);
};

export const secondsToRaceTime = (timeInSeconds: number) => {
  const minutes = Math.floor(Math.abs(timeInSeconds) / 60).toString();
  const seconds = (Math.abs(timeInSeconds) % 60).toLocaleString('US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  });

  return `${minutes}:${seconds}`;
};

export const racesByNameId = (records: TableRecord[]) => {
  if (records) {
    const byId = records.reduce((accum, { fields: { name, distance, time, date, raceName } }) => {
      const capitalizedName = capitalize(name);
      const mutableName = name;
      const nameId = mutableName.replace(/\s+/g, '');

      if (!accum[nameId]) {
        accum[nameId] = [{ nameId, name: capitalizedName, distance, time, date, raceName }];
      } else {
        accum[nameId].push({ nameId, name: capitalizedName, distance, time, date, raceName });
      }

      return accum;
    }, {} as { [key: string]: TableRecordFields[] });

    return byId;
  }

  return {};
};

export const secondsToPace = (timeInSeconds: number, distanceInMiles = 3.10686) => {
  if (!timeInSeconds) {
    return '';
  }
  const secondsPerMile = timeInSeconds / distanceInMiles;
  const paceMinutesPerMile = secondsPerMile / 60;
  const paceSecondsPerMile = secondsPerMile % 60;
  const pace = `${Math.floor(paceMinutesPerMile)}:${Math.abs(Math.round(paceSecondsPerMile)).toLocaleString('US', {
    minimumIntegerDigits: 2,
    useGrouping: false,
  })}`;

  return pace;
};

export const calcPaceDifference = (pace1: string, pace2: string) => {
  const pace1Minutes = Number(pace1.split(':')[0]);
  const pace1Seconds = Number(pace1.split(':')[1]);
  const pace1TotalSeconds = pace1Minutes * 60 + pace1Seconds;

  const pace2Minutes = Number(pace2.split(':')[0]);
  const pace2Seconds = Number(pace2.split(':')[1]);
  const pace2TotalSeconds = pace2Minutes * 60 + pace2Seconds;

  const difference = pace1TotalSeconds - pace2TotalSeconds;

  return secondsToRaceTime(difference);
};

export const formatDate = (date: string) => {
  const dateObj = new Date(date);
  return format(dateObj, 'MM/dd/yyyy');
};
