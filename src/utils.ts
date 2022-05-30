import { TableRecord, TableRecordFields } from './types';

export const capitalize = (string: string) => {
  if (!string) {
    return;
  }

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

export const normalizeByName = (records: TableRecord[]) =>
  records.reduce((accum, { fields: { name, distance, time, date, raceName } }) => {
    const capitalizedName = capitalize(name);

    if (!accum[capitalizedName]) {
      accum[capitalizedName] = [{ name: capitalizedName, distance, time, date, raceName }];
    } else {
      accum[capitalizedName].push({ name: capitalizedName, distance, time, date, raceName });
    }

    return accum;
  }, {} as { [key: string]: TableRecordFields[] });
